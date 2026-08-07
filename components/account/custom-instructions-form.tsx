"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AccountSection } from "@/components/account/account-section";

import type { UserMe } from "@/lib/types/user";

const MAX_INSTRUCTIONS = 4000;

export function CustomInstructionsForm() {
  const t = useTranslations("account.instructions");
  const tCommon = useTranslations("common");
  const me = useQuery(api.users.me, {}) as UserMe | null | undefined;
  const updateProfile = useMutation(api.users.updateProfile);
  const [instructions, setInstructions] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (me) setInstructions(me.customInstructions ?? "");
  }, [me]);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ customInstructions: instructions });
      toast.success(t("saved"));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t("saveFailed")
      );
    } finally {
      setSaving(false);
    }
  };

  const dirty =
    me !== undefined &&
    me !== null &&
    instructions !== (me.customInstructions ?? "");

  return (
    <AccountSection
      id="instructions"
      title={t("title")}
      description={t("description")}
    >
      {me === undefined ? (
        <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="custom-instructions">{t("label")}</Label>
            <Textarea
              id="custom-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t("placeholder")}
              className="min-h-40"
              maxLength={MAX_INSTRUCTIONS}
            />
            <p className="text-xs text-muted-foreground">
              {instructions.length} / {MAX_INSTRUCTIONS}
            </p>
          </div>
          <div>
            <Button
              onClick={() => void onSave()}
              disabled={saving || !dirty}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {saving ? tCommon("saving") : t("save")}
            </Button>
          </div>
        </div>
      )}
    </AccountSection>
  );
}
