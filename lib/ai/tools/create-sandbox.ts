import type { UIMessageStreamWriter, UIMessage } from "ai";
import type { DataPart } from "../messages/data-parts";
import { Sandbox } from "@vercel/sandbox";
import { getRichError } from "./get-rich-error";
import { tool } from "ai";
import description from "./create-sandbox.md";
import z from "zod";
import { createAppAuth } from "@octokit/auth-app";

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
}

export const createSandbox = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      timeout: z
        .number()
        .min(600000)
        .max(2700000)
        .optional()
        .describe(
          "Maximum time in milliseconds the Vercel Sandbox will remain active before automatically shutting down. Minimum 600000ms (10 minutes), maximum 2700000ms (45 minutes). Defaults to 600000ms (10 minutes). The sandbox will terminate all running processes when this timeout is reached."
        ),
      ports: z
        .array(z.number())
        .max(2)
        .optional()
        .describe(
          "Array of network ports to expose and make accessible from outside the Vercel Sandbox. These ports allow web servers, APIs, or other services running inside the Vercel Sandbox to be reached externally. Common ports include 3000 (Next.js), 8000 (Python servers), 5000 (Flask), etc."
        ),
    }),
    execute: async ({ timeout, ports }, { toolCallId }) => {
      writer.write({
        id: toolCallId,
        type: "data-create-sandbox",
        data: { status: "loading" },
      });

      try {
        const auth = createAppAuth({
          appId: process.env.GITHUB_APP_ID!,
          privateKey: process.env.GITHUB_APP_PRIVATE_KEY!,
          installationId: process.env.GITHUB_APP_INSTALLATION_ID!,
        });

        // Get the installation access token (not a JWT)
        const { token } = await auth({ type: "installation" });

        const sandbox = await Sandbox.create({
          teamId: process.env.VERCEL_TEAM_ID!,
          projectId: process.env.VERCEL_SANDBOX_TEMPLATE_PROJECT_ID!,
          token: process.env.VERCEL_TOKEN!,
          timeout: timeout ?? 600000,
          ports,
        });

        writer.write({
          id: toolCallId,
          type: "data-create-sandbox",
          data: { sandboxId: sandbox.sandboxId, status: "done" },
        });

        return (
          `Sandbox created with ID: ${sandbox.sandboxId}.` +
          `\nYou can now upload files, run commands, and access services on the exposed ports.`
        );
      } catch (error) {
        const richError = getRichError({
          action: "Creating Sandbox",
          error,
        });

        writer.write({
          id: toolCallId,
          type: "data-create-sandbox",
          data: {
            error: { message: richError.error.message },
            status: "error",
          },
        });

        console.log("Error creating Sandbox:", richError.error);
        return richError.message;
      }
    },
  });
