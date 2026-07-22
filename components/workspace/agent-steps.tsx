"use client";

import {
  FileText,
  Globe,
  Info,
  PencilLine,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task";

export interface Step {
  kind: string;
  label: string;
  detail?: string;
}

const ICONS: Record<string, typeof Sparkles> = {
  plan: Sparkles,
  write: PencilLine,
  read: FileText,
  command: TerminalSquare,
  preview: Globe,
  note: Info,
};

export function AgentSteps({ steps, active }: { steps: Step[]; active?: boolean }) {
  if (!steps.length) return null;
  const last = steps[steps.length - 1];
  return (
    <Task defaultOpen={active} className="mb-3 w-full">
      <TaskTrigger title={active ? last.label : `${steps.length} build steps`} />
      <TaskContent>
        {steps.map((step, i) => {
          const Icon = ICONS[step.kind] ?? Info;
          return (
            <TaskItem key={i} className="flex items-start gap-2">
              <Icon className="mt-0.5 size-3.5 shrink-0 text-brand" />
              <span>
                {step.label}
                {step.detail && (
                  <span className="block truncate text-xs text-muted-foreground/70">
                    {step.detail}
                  </span>
                )}
              </span>
            </TaskItem>
          );
        })}
      </TaskContent>
    </Task>
  );
}
