import {
  stopMachine,
  restartMachine,
  deleteMachine,
  getMachine,
} from "./machine";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { FileOperation } from "./file-manager";
import { getFlyRegistryUrl } from "@/lib/fly/registry";

/**
 * Create a unique app name for a user's website
 * @param userId User ID
 * @returns A unique app name valid for Fly.io
 */
function randomString(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateAppName(userId: string): string {
  // Use only lowercase alphanumeric for userId
  let userPart = userId
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()
    .slice(0, 8);
  if (!userPart) userPart = randomString(6);
  let rand = randomString(8);
  let appName = `app-${userPart}-${rand}`;
  // Remove any non-alphanumeric or dash, and ensure no leading/trailing dash
  appName = appName.replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "");
  // Enforce length and no leading/trailing dash
  if (appName.length > 30) appName = appName.slice(0, 30);
  if (appName.length < 3) appName = appName + randomString(3 - appName.length);
  appName = appName.replace(/^-+|-+$/g, "");
  return appName;
}

/**
 * Assign a machine to a user's website
 * @param userId User ID
 * @param websiteName Website name
 * @param files File operations to add to the machine
 * @returns Machine data
 */
export async function assignMachineToUser(
  userId: string,
  websiteName: string,
  files?: FileOperation[]
) {
  try {
    // Check if FLY_API_TOKEN is set
    if (!process.env.FLY_API_TOKEN) {
      console.error("FLY_API_TOKEN environment variable is not set");
      throw new Error(
        "FLY_API_TOKEN is not set. Please configure your environment variables."
      );
    }

    // Generate a unique app name for the user's website
    const appName = generateAppName(userId);
    if (
      !appName ||
      appName.length < 3 ||
      appName.length > 30 ||
      !/^[a-z0-9-]+$/.test(appName) ||
      appName.startsWith("-") ||
      appName.endsWith("-")
    ) {
      throw new Error(`Generated app name '${appName}' is invalid for Fly.io`);
    }
    console.log(`Creating new Fly.io app: ${appName}`);

    let imageTag = `${getFlyRegistryUrl(websiteName)}:latest`;

    const gitlabRepoUrl =
      "https://gitlab.com/bittive-group/plain-nextjs-app.git";

    const response = await fetch(process.env.PREVIEW_DEPLOY_URL!, {
      method: "POST",
      body: JSON.stringify({
        gitlabRepoUrl: gitlabRepoUrl,
        imageTag: imageTag,
        appName: appName,
        websiteName: websiteName,
        userId: userId,
        files: files,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PREVIEW_DEPLOY_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to deploy preview: ${response.statusText}`);
    }

    const machine = await response.json();

    // Return the machine data that will be used in the website record
    return {
      success: true,
      data: {
        machine_id: machine.id,
        app_name: appName,
        name: `${websiteName}-${userId.slice(0, 8)}`,
        region: "arn",
        status: "creating",
        user_id: userId,
      },
    };
  } catch (error) {
    console.error("Error assigning machine:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function getUserMachines(userId: string) {
  try {
    // Use the authenticated server client
    const supabase = await createServerClient();

    // Get machines from the websites table
    const { data, error } = await supabase
      .from("websites")
      .select("id, machine_id, name, status, created_at, updated_at")
      .eq("user_id", userId);

    if (error) throw error;

    // Transform to the expected format
    const machines = data.map((website) => ({
      id: website.id,
      user_id: userId,
      machine_id: website.machine_id,
      name: website.name,
      status: website.status || "stopped",
      created_at: website.created_at,
      updated_at: website.updated_at,
    }));

    return { success: true, data: machines };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function startUserMachine(
  userId: string,
  machineId: string,
  appName?: string
) {
  try {
    // Use the authenticated server client
    const supabase = await createServerClient();

    // Verify machine ownership through the websites table
    const { data: website, error: fetchError } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", userId)
      .eq("machine_id", machineId)
      .single();

    if (fetchError || !website) {
      throw new Error("Website with this machine ID not found or unauthorized");
    }

    // Use the app name from the database if not provided
    const targetApp = appName || website.app_name;
    if (!targetApp) {
      throw new Error("appName is required for user machine operations");
    }

    // Check if the machine exists first
    try {
      // Get current machine state
      console.log(
        `Getting machine ${machineId} current state in app ${targetApp}...`
      );
      await getMachine(machineId, targetApp);
    } catch (machineError) {
      console.error(
        `Error getting machine state: ${machineError instanceof Error ? machineError.message : String(machineError)}`
      );
      throw new Error(
        `Machine not found or cannot be accessed. It may have been deleted.`
      );
    }

    // Start the machine with retry logic
    console.log(`Starting machine ${machineId}...`);

    // Implement retry with exponential backoff
    const maxRetries = 3;
    let delay = 2000; // Start with 2 seconds
    let success = false;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Start machine attempt ${attempt}/${maxRetries}`);
        await restartMachine(machineId, targetApp);
        success = true;
        console.log(
          `Machine ${machineId} started successfully on attempt ${attempt}`
        );
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `Failed to start machine on attempt ${attempt}: ${lastError.message}`
        );

        if (attempt < maxRetries) {
          console.log(`Waiting ${delay / 1000}s before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    if (!success) {
      throw (
        lastError ||
        new Error("Failed to start machine after multiple attempts")
      );
    }

    // Update website status
    const { error: updateError } = await supabase
      .from("websites")
      .update({ status: "running" })
      .eq("id", website.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function stopUserMachine(
  userId: string,
  machineId: string,
  appName?: string
) {
  try {
    // Use the authenticated server client
    const supabase = await createServerClient();

    // Verify machine ownership through the websites table
    const { data: website, error: fetchError } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", userId)
      .eq("machine_id", machineId)
      .single();

    if (fetchError || !website) {
      throw new Error("Website with this machine ID not found or unauthorized");
    }

    // Use the app name from the database if not provided
    const targetApp = appName || website.app_name;
    if (!targetApp) {
      throw new Error("appName is required for user machine operations");
    }

    // Stop the machine with retry logic
    console.log(`Stopping machine ${machineId} in app ${targetApp}...`);

    // Implement retry with exponential backoff
    const maxRetries = 3;
    let delay = 2000; // Start with 2 seconds
    let success = false;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Stop machine attempt ${attempt}/${maxRetries}`);
        await stopMachine(machineId, targetApp);
        success = true;
        console.log(
          `Machine ${machineId} stopped successfully on attempt ${attempt}`
        );
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `Failed to stop machine on attempt ${attempt}: ${lastError.message}`
        );

        if (attempt < maxRetries) {
          console.log(`Waiting ${delay / 1000}s before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    if (!success) {
      throw (
        lastError || new Error("Failed to stop machine after multiple attempts")
      );
    }

    // Update website status
    const { error: updateError } = await supabase
      .from("websites")
      .update({ status: "stopped" })
      .eq("id", website.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteUserMachine(
  userId: string,
  machineId: string,
  appName?: string
) {
  try {
    // Use the authenticated server client
    const supabase = await createServerClient();

    // Verify machine ownership through the websites table
    const { data: website, error: fetchError } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", userId)
      .eq("machine_id", machineId)
      .single();

    if (fetchError || !website) {
      throw new Error("Website with this machine ID not found or unauthorized");
    }

    // Use the app name from the database if not provided
    const targetApp = appName || website.app_name;
    if (!targetApp) {
      throw new Error("appName is required for user machine operations");
    }

    // Delete the machine with retry logic
    console.log(`Deleting machine ${machineId} in app ${targetApp}...`);

    // Implement retry with exponential backoff
    const maxRetries = 3;
    let delay = 2000; // Start with 2 seconds
    let success = false;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Delete machine attempt ${attempt}/${maxRetries}`);
        await deleteMachine(machineId, targetApp);
        success = true;
        console.log(
          `Machine ${machineId} deleted successfully on attempt ${attempt}`
        );
        break;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          `Failed to delete machine on attempt ${attempt}: ${lastError.message}`
        );

        if (attempt < maxRetries) {
          console.log(`Waiting ${delay / 1000}s before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }

    if (!success) {
      throw (
        lastError ||
        new Error("Failed to delete machine after multiple attempts")
      );
    }

    // Update the website status and keep it in the table for reference
    const { error: updateError } = await supabase
      .from("websites")
      .update({
        status: "deleted",
        machine_id: null,
      })
      .eq("id", website.id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get the URL for a specific website based on its app name
 *
 * @param appName The Fly.io app name for the website
 * @returns The fly.dev URL for the app
 */
export function getMachineUrl(appName: string): string {
  if (!appName) {
    throw new Error("App name is required");
  }

  // Return the direct fly.dev URL for the app
  return `https://${appName}.fly.dev`;
}
