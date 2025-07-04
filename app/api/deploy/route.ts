import { NextRequest, NextResponse } from "next/server";
import { getWebsite, updateWebsite } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { Vercel } from "@vercel/sdk";

// POST: Trigger deployment
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appName } = body as {
      appName?: string;
    };

    if (!appName) {
      return NextResponse.json({ error: "Missing variables" }, { status: 400 });
    }

    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
    const project = await vercel.projects.createProject({
      teamId: process.env.VERCEL_TEAM_ID!,
      slug: "builddrr-user-sites",
      requestBody: {
        name: appName,
        framework: "nextjs",
        gitRepository: {
          repo: `builddrr-user-sites/builddrr-user-site-${appName}`,
          type: "github",
        },
        publicSource: false,
      },
    });

    console.log("[VERCEL] project:", project);

    // Create a deployment with github repo that is already created and has the files from AI generated website
    const deployment = await vercel.deployments.createDeployment({
      teamId: process.env.VERCEL_TEAM_ID!,
      slug: "builddrr-user-sites",
      requestBody: {
        gitSource: {
          org: "builddrr-user-sites",
          ref: "main",
          repo: `builddrr-user-site-${appName}`,
          type: "github",
        },
        name: appName,
        project: project.id,
        projectSettings: {
          buildCommand: "next build",
          installCommand: "npm install",
        },
        target: "production",
      },
    });

    console.log("[VERCEL] deployment:", deployment);

    // Return deployment ID for polling
    const vercelUrl = `https://${appName}.vercel.app`;
    revalidatePath("/dashboard/website/all");
    revalidatePath(`/website/editor/${appName}`);

    return NextResponse.json({
      url: vercelUrl,
      deploymentId: deployment.id,
    });
  } catch (error) {
    console.error("Error deploying website:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET: Poll deployment status (streaming)
export async function GET(req: NextRequest) {
  console.log("[VERCEL] GET request received");
  const deploymentId = req.nextUrl.searchParams.get("id");
  if (!deploymentId) {
    return new Response(JSON.stringify({ error: "Missing deployment ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
  console.log(
    "[VERCEL] starting to fetch events for deployment:",
    deploymentId
  );

  const pollInterval = 10000;
  const maxWaitTime = 5 * 60 * 1000;
  const startTime = Date.now();

  try {
    while (true) {
      const events = await vercel.deployments.getDeployment({
        idOrUrl: deploymentId,
        teamId: process.env.VERCEL_TEAM_ID!,
        slug: "builddrr-user-sites",
      });

      const status = events.status;
      if (status === "READY") {
        return new Response(JSON.stringify({ status }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log("[VERCEL] status:", status);

      if (Date.now() - startTime > maxWaitTime) {
        return new Response(JSON.stringify({ status: "TIMEOUT" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Wait for pollInterval before next check
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch deployment status" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
