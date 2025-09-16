import { NextResponse } from "next/server";
import { Sandbox } from "@vercel/sandbox";
import { createAppAuth } from "@octokit/auth-app";
import { createClient } from "@/lib/supabase/server";
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
      // Soft exit so the user can proceed with creation flow
      return NextResponse.json({ repoExists: false });
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

    // Install deps and start dev server
    try {
      console.log("[projects/start] running npm install");
      const install = await sandbox.runCommand({
        cmd: "npm",
        args: ["install", "--silent"],
      });
      if (install.exitCode !== 0) {
        console.warn("[projects/start] npm install failed", {
          exitCode: install.exitCode,
        });
      }
    } catch (e) {
      console.warn("[projects/start] npm install error", e);
    }

    try {
      console.log("[projects/start] starting dev server");
      await sandbox.runCommand({
        cmd: "npm",
        args: ["run", "dev"],
        detached: true,
      });
    } catch (e) {
      console.warn("[projects/start] npm run dev error", e);
    }

    // Persist sandbox id to preview_environments
    try {
      const supabase = await createClient();
      const { data: existing, error: selectError } = await supabase
        .from("preview_environments")
        .select("app_name, sandbox_id")
        .eq("app_name", appName)
        .maybeSingle();
      if (selectError)
        console.warn("[projects/start] select preview env failed", selectError);
      if (existing) {
        await supabase
          .from("preview_environments")
          .update({ sandbox_id: sandbox.sandboxId })
          .eq("app_name", appName)
          .select("app_name, sandbox_id");
      } else {
        await supabase
          .from("preview_environments")
          .insert({ app_name: appName, sandbox_id: sandbox.sandboxId })
          .select("app_name, sandbox_id");
      }
    } catch (dbErr) {
      console.error("[projects/start] failed to save sandbox_id", dbErr);
    }

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
