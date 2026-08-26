"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { asProjectId } from "@/lib/convex/ids";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { triggerGeneration } from "@/lib/generate/trigger-api";
import { userFacingError } from "@/lib/errors";
import type { RedesignAnswers } from "@/lib/schema/redesign";

const DIRECTIONS: { id: RedesignAnswers["direction"]; label: string }[] = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "premium", label: "Premium" },
  { id: "playful", label: "Playful" },
];

const THEMES: { id: RedesignAnswers["theme"]; label: string }[] = [
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
  { id: "either", label: "Either" },
];

const SCOPES: { id: RedesignAnswers["scope"]; label: string }[] = [
  { id: "visuals", label: "Same pages, new visuals" },
  { id: "restructure", label: "Restructure pages" },
  { id: "fresh", label: "Mostly start fresh" },
];

function Chip({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 text-left text-sm transition-colors",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-transparent text-foreground hover:border-foreground/40"
      )}
    >
      {label}
    </button>
  );
}

export function RedesignQuestionsDialog({
  projectId,
  open,
}: {
  projectId: string;
  open: boolean;
}) {
  const submit = useMutation(api.projects.submitRedesignAnswers);
  const cancel = useMutation(api.projects.cancelPendingRedesign);
  const pid = asProjectId(projectId);

  const [direction, setDirection] =
    useState<RedesignAnswers["direction"]>("minimal");
  const [directionNote, setDirectionNote] = useState("");
  const [theme, setTheme] = useState<RedesignAnswers["theme"]>("either");
  const [keep, setKeep] = useState("");
  const [scope, setScope] = useState<RedesignAnswers["scope"]>("visuals");
  const [pending, setPending] = useState(false);

  const dismiss = async () => {
    if (pending) return;
    try {
      await cancel({ projectId: pid });
    } catch (e) {
      toast.error(userFacingError(e, "Could not cancel redesign."));
    }
  };

  const onSubmit = async () => {
    setPending(true);
    try {
      await submit({
        projectId: pid,
        answers: {
          direction,
          directionNote: directionNote.trim() || undefined,
          theme,
          keep: keep.trim() || undefined,
          scope,
        },
      });
      await triggerGeneration(projectId);
    } catch (e) {
      toast.error(userFacingError(e, "Could not start redesign."));
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) void dismiss();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-none border-border p-0 sm:max-w-md">
        <div className="border-b border-border px-6 py-5 pr-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Site-wide redesign
          </p>
          <DialogTitle className="mt-2 text-2xl font-semibold tracking-tight">
            Shape the new look
          </DialogTitle>
          <DialogDescription className="mt-2 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
            Three quick answers, then Floras replans the whole site.
          </DialogDescription>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              What should the new site feel like?
            </p>
            <div className="flex flex-wrap gap-2">
              {DIRECTIONS.map((d) => (
                <Chip
                  key={d.id}
                  label={d.label}
                  selected={direction === d.id}
                  onClick={() => setDirection(d.id)}
                />
              ))}
            </div>
            <input
              value={directionNote}
              onChange={(e) => setDirectionNote(e.target.value)}
              placeholder="Anything else? (optional)"
              className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Light or dark, and what must stay?
            </p>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <Chip
                  key={t.id}
                  label={t.label}
                  selected={theme === t.id}
                  onClick={() => setTheme(t.id)}
                />
              ))}
            </div>
            <input
              value={keep}
              onChange={(e) => setKeep(e.target.value)}
              placeholder="Brand name, colors, logo to keep (optional)"
              className="mt-2 w-full border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">How much should change?</p>
            <div className="flex flex-col gap-2">
              {SCOPES.map((s) => (
                <Chip
                  key={s.id}
                  label={s.label}
                  selected={scope === s.id}
                  onClick={() => setScope(s.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            disabled={pending}
            onClick={() => void dismiss()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-none"
            disabled={pending}
            onClick={() => void onSubmit()}
          >
            {pending ? "Starting…" : "Continue redesign"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
