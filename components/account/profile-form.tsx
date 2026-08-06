"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountSection } from "@/components/account/account-section";

import type { UserMe } from "@/lib/types/user";

export function ProfileForm() {
  const t = useTranslations("account.profile");
  const tCommon = useTranslations("common");
  const me = useQuery(api.users.me, {}) as UserMe | null | undefined;
  const updateProfile = useMutation(api.users.updateProfile);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (me) setName(me.name ?? "");
  }, [me]);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name });
      toast.success(t("saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const dirty = me != null && name.trim() !== (me.name ?? "").trim();

  return (
    <AccountSection
      id="profile"
      title={t("title")}
      description={t("description")}
    >
      {me === undefined ? (
        <p className="text-sm text-muted-foreground">{tCommon("loading")}</p>
      ) : (
        <div className="flex max-w-md flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-name">{t("name")}</Label>
            <Input
              id="account-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("namePlaceholder")}
              maxLength={80}
              autoComplete="name"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-email">{t("email")}</Label>
            <Input
              id="account-email"
              value={me?.email ?? ""}
              disabled
              readOnly
            />
          </div>
          <div>
            <Button
              onClick={() => void onSave()}
              disabled={saving || !name.trim() || !dirty}
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
