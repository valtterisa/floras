import type { InferUITools, UIMessage, UIMessageStreamWriter } from "ai";
import type { DataPart } from "../messages/data-parts";
import { createSandbox } from "./create-sandbox";
import { generateFiles } from "./generate-files";
import { getSandboxURL } from "./get-sandbox-url";
import { runCommand } from "./run-command";
interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
  appName?: string;
}

export function tools({ writer, appName }: Params) {
  return {
    createSandbox: createSandbox({ writer }),
    generateFiles: generateFiles({ writer, appName }),
    getSandboxURL: getSandboxURL({ writer }),
    runCommand: runCommand({ writer }),
  };
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>;
