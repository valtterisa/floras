import type { InferUITools, UIMessage, UIMessageStreamWriter } from "ai";
import type { DataPart } from "../messages/data-parts";
import { createSandbox } from "./create-sandbox";
import { generateFiles } from "./generate-files";
import { getSandboxURL } from "./get-sandbox-url";
import { runCommand } from "./run-command";

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>;
}

export function tools({ writer }: Params) {
  return {
    createSandbox: createSandbox({ writer }),
    generateFiles: generateFiles({ writer }),
    getSandboxURL: getSandboxURL({ writer }),
    runCommand: runCommand({ writer }),
  };
}

export type ToolSet = InferUITools<ReturnType<typeof tools>>;
