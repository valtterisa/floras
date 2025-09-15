import type { UIMessageStreamWriter, UIMessage } from "ai";
import type { DataPart } from "../messages/data-parts";
import { Sandbox } from "@vercel/sandbox";
import { getContents, type File } from "./generate-files/get-contents";
import { getRichError } from "./get-rich-error";
import { getWriteFiles } from "./generate-files/get-write-files";
import { tool } from "ai";
import description from "./generate-files.md";
import z from "zod";

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
}

export const generateFiles = ({ writer }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      sandboxId: z.string(),
      paths: z.array(z.string()),
    }),
    execute: async ({ sandboxId, paths }, { toolCallId, messages }) => {
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

      return `Successfully generated and uploaded ${
        uploaded.length
      } files. Their paths and contents are as follows:
        ${uploaded
          .map((file) => `Path: ${file.path}\nContent: ${file.content}\n`)
          .join("\n")}`;
    },
  });
