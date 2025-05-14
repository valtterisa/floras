import { z } from "zod";

// Default API base URL in case environment variable is not set
export const FLY_API_BASE =
  process.env.FLY_API_BASE || "https://api.machines.dev";

// Interface for defining files to be included in a machine configuration
// This is used when updating a machine's config with files
// Note: There is no direct /files endpoint in the Fly.io API, but we can include
// files in the machine config when creating or updating a machine
export interface MachineFile {
  guest_path: string; // Absolute path in the machine
  raw_value: string; // Base64 encoded file contents
}

// Get machine details from a specific app
export async function getMachine(machineId: string, appName?: string) {
  if (!appName) {
    throw new Error("appName is required for getting a machine on Fly.io");
  }
  const targetApp = appName;
  return flyApiRequest(`/v1/apps/${targetApp}/machines/${machineId}`);
}

// List all machines in an app
export async function listMachines(appName?: string) {
  if (!appName) {
    throw new Error("appName is required for listing machines on Fly.io");
  }
  const targetApp = appName;
  return flyApiRequest(`/v1/apps/${targetApp}/machines`);
}

// Restart a machine in a specific app
export async function restartMachine(machineId: string, appName?: string) {
  if (!appName) {
    throw new Error("appName is required for restarting a machine on Fly.io");
  }
  const targetApp = appName;
  return flyApiRequest(`/v1/apps/${targetApp}/machines/${machineId}/restart`, {
    method: "POST",
    body: JSON.stringify({ config: {} }),
  });
}

// Stop a machine in a specific app
export async function stopMachine(machineId: string, appName?: string) {
  if (!appName) {
    throw new Error("appName is required for stopping a machine on Fly.io");
  }
  const targetApp = appName;
  return flyApiRequest(`/v1/apps/${targetApp}/machines/${machineId}/stop`, {
    method: "POST",
    body: JSON.stringify({ config: {} }),
  });
}

// Delete a machine from a specific app
export async function deleteMachine(machineId: string, appName?: string) {
  if (!appName) {
    throw new Error("appName is required for deleting a machine on Fly.io");
  }
  const targetApp = appName;
  return flyApiRequest(`/v1/apps/${targetApp}/machines/${machineId}`, {
    method: "DELETE",
  });
}

// Update machine configuration in a specific app
export async function updateMachine(
  machineId: string,
  config: Partial<MachineConfig>,
  appName?: string
) {
  if (!appName) {
    throw new Error("appName is required for updating a machine on Fly.io");
  }
  const targetApp = appName;
  return flyApiRequest(`/v1/apps/${targetApp}/machines/${machineId}`, {
    method: "PATCH",
    body: JSON.stringify(config),
  });
}

// Write files to a machine by updating its configuration
export async function updateMachineWithFiles(
  machineId: string,
  files: MachineFile[],
  appName?: string
) {
  try {
    if (!appName) {
      throw new Error(
        "appName is required for updating machine files on Fly.io"
      );
    }
    const targetApp = appName;
    console.log(
      `Adding ${files.length} files to machine ${machineId} in app ${targetApp}`
    );

    // Get the current machine config first
    const machineData = await getMachine(machineId, targetApp);

    if (!machineData || !machineData.config) {
      throw new Error("Failed to get machine configuration");
    }

    // Update the machine config with the new files
    const updatedConfig = {
      ...machineData.config,
      files: files,
    };

    // Update the machine with the new config
    const response = await flyApiRequest(
      `/v1/apps/${targetApp}/machines/${machineId}`,
      {
        method: "POST",
        body: JSON.stringify({
          config: updatedConfig,
        }),
      }
    );

    console.log("Machine update response:", JSON.stringify(response, null, 2));

    return { success: true, data: response };
  } catch (error) {
    console.error("Error updating machine with files:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error adding files",
    };
  }
}
