"use client";

import { AGENT_MODELS, type AgentModelId } from"@/lib/ai/models";
import { cn } from"@/lib/utils";

export function ModelSelector({
 value,
 onChange,
 disabled = false,
}: {
 value: AgentModelId;
 onChange: (modelId: AgentModelId) => void;
 disabled?: boolean;
}) {
 return (
 <div
 role="group"aria-label="Model"className="inline-flex border border-border bg-background">
 {AGENT_MODELS.map((model, i) => {
 const active = value === model.id;
 return (
 <button
 key={model.id}
 type="button"disabled={disabled}
 aria-pressed={active}
 title={`${model.label} · ${model.hint}`}
 onClick={() => onChange(model.id)}
 className={cn("cursor-pointer px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
 i > 0 &&"border-l border-border",
 active
 ?"bg-foreground text-background":"text-muted-foreground hover:bg-card hover:text-foreground")}
 >
 {model.label}
 </button>
 );
 })}
 </div>
 );
}
