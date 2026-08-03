"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { AccountSection } from "@/components/account/account-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerationAccess } from "@/lib/hooks/use-generation-access";
import { assertOk } from "@/lib/errors";

export function ApiKeySection() {
  const meta = useQuery(api.users.getAnthropicKeyMeta);
  const { hasByokPlan, hasProPlan } = useGenerationAccess();
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [replacing, setReplacing] = useState(false);

  const configured = Boolean(meta?.configured);
  const last4 = meta?.last4 ?? null;

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/anthropic-key", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      await assertOk(res);
      setApiKey("");
      setReplacing(false);
      toast.success("Anthropic API key saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save API key."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setRemoving(true);
    try {
      const res = await fetch("/api/account/anthropic-key", {
        method: "DELETE",
      });
      await assertOk(res);
      setReplacing(false);
      toast.success("API key removed.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not remove API key."
      );
    } finally {
      setRemoving(false);
    }
  };

  return (
    <AccountSection
      id="api-key"
      title="API key"
      description={
        hasByokPlan && !hasProPlan
          ? "BYOK uses your Anthropic key for generation. Usage is billed by Anthropic."
          : hasProPlan
            ? "Optional. Pro uses Floras credits by default; a saved key is unused unless you switch plans."
            : "Required on the BYOK plan. Pro uses Floras AI credits instead."
      }
    >
      {meta === undefined ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : configured && !replacing ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Key on file ending in{" "}
            <span className="font-mono text-foreground">••••{last4}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => setReplacing(true)}
            >
              Replace key
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              disabled={removing}
              onClick={() => void remove()}
            >
              {removing ? "Removing…" : "Remove"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="anthropic-key">Anthropic API key</Label>
            <Input
              id="anthropic-key"
              type="password"
              autoComplete="off"
              placeholder="sk-ant-…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Stored encrypted. Get a key from{" "}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                console.anthropic.com
              </a>
              . Usage is billed by Anthropic.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="brand"
              className="rounded-none"
              disabled={saving || !apiKey.trim()}
              onClick={() => void save()}
            >
              {saving ? "Saving…" : "Save key"}
            </Button>
            {replacing ? (
              <Button
                variant="outline"
                className="rounded-none"
                onClick={() => {
                  setReplacing(false);
                  setApiKey("");
                }}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </AccountSection>
  );
}
