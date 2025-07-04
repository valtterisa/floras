import { NextRequest, NextResponse } from "next/server";
import { getWebsite, updateWebsite } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { Vercel } from "@vercel/sdk";

export async function POST(req: NextRequest) {
  try {
    // Upload files to GitHub
    const body = await req.json();
    const { appName } = body as {
      appName?: string;
    };

    if (!appName) {
      return NextResponse.json({ error: "Missing variables" }, { status: 400 });
    }

    const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! });
    const deployment = await vercel.projects.createProject({
      teamId: process.env.VERCEL_TEAM_ID!,
      slug: "valtterisas-projects",
      requestBody: {
        name: appName,
        framework: "nextjs",
        gitRepository: {
          repo: `builddrr-user-site-${appName}`,
          type: "github",
        },
        publicSource: false,
      },
    });

    if (!deployment) {
      return NextResponse.json({ error: "Failed to deploy" }, { status: 500 });
    }

    // Update website record
    const vercelUrl = `https://${appName}.valtterisavonen.fi`;
    await updateWebsite(appName, {
      status: "deployed",
      last_deployed: new Date().toISOString(),
      primary_url: vercelUrl,
    });
    revalidatePath("/dashboard/website/all");
    revalidatePath(`/website/editor/${appName}`);

    return NextResponse.json({
      url: vercelUrl,
      status: "deployed",
      message: "Website deployed successfully to Vercel.",
    });
  } catch (error) {
    console.error("Error deploying website:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
