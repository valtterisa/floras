"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { AccountSection } from "@/components/account/account-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenerationAccess } from "@/lib/hooks/use-generation-access";
import { assertOk } from "@/lib/errors";

export function ApiKeySection() {
  const t = useTranslations("account.apiKey");
  const tCommon = useTranslations("common");
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
      toast.success(t("saved"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("saveFailed")
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
      toast.success(t("removed"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("removeFailed")
      );
    } finally {
      setRemoving(false);
    }
  };

  return (
    <AccountSection
      id="api-key"
      title={t("title")}
      description={
        hasByokPlan && !hasProPlan
          ? t("descByok")
          : hasProPlan
            ? t("descPro")
            : t("descDefault")
      }
    >
      {meta === undefined ? (
        <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
      ) : configured && !replacing ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {t("onFile")}{" "}
            <span className="font-mono text-foreground">••••{last4}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-none"
              onClick={() => setReplacing(true)}
            >
              {t("replace")}
            </Button>
            <Button
              variant="outline"
              className="rounded-none"
              disabled={removing}
              onClick={() => void remove()}
            >
              {removing ? t("removing") : t("remove")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="anthropic-key">{t("label")}</Label>
            <Input
              id="anthropic-key"
              type="password"
              autoComplete="off"
              placeholder="sk-ant-…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {t("hint")}{" "}
              <a
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                console.anthropic.com
              </a>
              {t("hintAfter")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="brand"
              className="rounded-none"
              disabled={saving || !apiKey.trim()}
              onClick={() => void save()}
            >
              {saving ? tCommon("saving") : t("save")}
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
                {tCommon("cancel")}
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </AccountSection>
  );
}
