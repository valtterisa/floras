import type { UIMessageStreamWriter, UIMessage } from "ai";
import type { DataPart } from "../messages/data-parts";
import { Sandbox } from "@vercel/sandbox";
import { getContents, type File } from "./generate-files/get-contents";
import { getRichError } from "./get-rich-error";
import { getWriteFiles } from "./generate-files/get-write-files";
import { tool } from "ai";
import description from "./generate-files.md";
import z from "zod";
import { createRepoFromTemplate, uploadFilesToRepo } from "@/lib/github";

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
}

export const generateFiles = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z.string(),
      paths: z.array(z.string()),
      repo: z.string().describe("GitHub repo slug to upload to (in org)"),
      ensureTemplate: z
        .boolean()
        .default(true)
        .describe("Create repo from template when missing (default: true)"),
    }),
    execute: async (
      { sandboxId, paths, repo, ensureTemplate = true },
      { toolCallId, messages }
    ) => {
      writer.write({
        id: toolCallId,
        type: "data-generating-files",
        data: { paths: [], status: "generating" },
      });

      let sandbox: Sandbox | null = null;

      try {
        sandbox = await Sandbox.get({
          teamId: process.env.VERCEL_TEAM_ID!,
          projectId: process.env.VERCEL_SANDBOX_TEMPLATE_PROJECT_ID!,
          token: process.env.VERCEL_TOKEN!,
          sandboxId,
        });
      } catch (error) {
        const richError = getRichError({
          action: "get sandbox by id",
          args: { sandboxId },
          error,
        });

        writer.write({
          id: toolCallId,
          type: "data-generating-files",
          data: { error: richError.error, paths: [], status: "error" },
        });

        return richError.message;
      }

      const writeFiles = getWriteFiles({ sandbox, toolCallId, writer });
      const iterator = getContents({ messages, paths });
      const uploaded: File[] = [];

      try {
        for await (const chunk of iterator) {
          if (chunk.files.length > 0) {
            const error = await writeFiles(chunk);
            if (error) {
              return error;
            } else {
              uploaded.push(...chunk.files);
            }
          } else {
            writer.write({
              id: toolCallId,
              type: "data-generating-files",
              data: {
                status: "generating",
                paths: chunk.paths,
              },
            });
          }
        }
      } catch (error) {
        const richError = getRichError({
          action: "generate file contents",
          args: { paths },
          error,
        });

        writer.write({
          id: toolCallId,
          type: "data-generating-files",
          data: {
            error: richError.error,
            status: "error",
            paths,
          },
        });

        return richError.message;
      }

      writer.write({
        id: toolCallId,
        type: "data-generating-files",
        data: { paths: uploaded.map((file) => file.path), status: "done" },
      });

      // Always upload to GitHub
      if (uploaded.length > 0) {
        try {
          if (ensureTemplate) {
            await createRepoFromTemplate(repo);
          }
          const filesMap = Object.fromEntries(
            uploaded.map((f) => [f.path, f.content])
          );
          await uploadFilesToRepo(repo, filesMap);
          return `Generated ${uploaded.length} files, wrote to sandbox, and uploaded to GitHub repo '${repo}'.`;
        } catch (error) {
          return `Generated ${uploaded.length} files and wrote to sandbox, but GitHub upload failed: ${String(
            (error as any)?.message || error
          )}`;
        }
      }

      return `No files generated.`;
    },
  });
