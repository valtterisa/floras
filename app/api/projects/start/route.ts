import { NextResponse } from "next/server";
import { Sandbox } from "@vercel/sandbox";
import { createAppAuth } from "@octokit/auth-app";
import {
  checkRepoExists,
  listRepoDirectory,
  getRepoFileContent,
} from "@/lib/github";

export async function POST(req: Request) {
  try {
    const start = Date.now();
    const { appName, port = 3000, timeout = 600000 } = await req.json();
    console.log("[projects/start] request", { appName, port, timeout });

    if (!appName || typeof appName !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'appName'" },
        { status: 400 }
      );
    }

    const exists = await checkRepoExists(appName);
    console.log("[projects/start] repoExists", { appName, exists });
    if (!exists) {
      return NextResponse.json(
        { error: "Repository not found" },
        { status: 404 }
      );
    }

    // Use GitHub cloning when repo exists
    const auth = createAppAuth({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
      installationId: process.env.GITHUB_APP_INSTALLATION_ID!,
    });
    const { token } = await auth({ type: "installation" });
    const cloneUrl = `https://github.com/builddrr-user-sites/${appName}.git`;
    console.log("[projects/start] creating sandbox from git", { cloneUrl });

    const sandbox = await Sandbox.create({
      teamId: process.env.VERCEL_TEAM_ID!,
      projectId: process.env.VERCEL_SANDBOX_TEMPLATE_PROJECT_ID!,
      token: process.env.VERCEL_TOKEN!,
      source: {
        url: cloneUrl,
        type: "git",
        username: "x-access-token",
        password: token,
        depth: 1,
      },
      ports: [port],
      timeout,
    });
    console.log("[projects/start] sandbox created", {
      sandboxId: sandbox.sandboxId,
    });

    const url = (
      await Sandbox.get({
        teamId: process.env.VERCEL_TEAM_ID!,
        projectId: process.env.VERCEL_SANDBOX_TEMPLATE_PROJECT_ID!,
        token: process.env.VERCEL_TOKEN!,
        sandboxId: sandbox.sandboxId,
      })
    ).domain(port);
    const ms = Date.now() - start;
    console.log("[projects/start] success", {
      sandboxId: sandbox.sandboxId,
      url,
      ms,
    });
    return NextResponse.json({ sandboxId: sandbox.sandboxId, url });
  } catch (error: any) {
    console.error("[projects/start] error", {
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: error?.message || "Failed to start project sandbox" },
      { status: 500 }
    );
  }
}
