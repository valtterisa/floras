"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountSection } from "@/components/account/account-section";

type Me = {
  id: string;
  name: string;
  email: string;
  customInstructions?: string;
};

export function ProfileForm() {
  const me = useQuery((api as any).users.me, {}) as Me | null | undefined;
  const updateProfile = useMutation((api as any).users.updateProfile);
  const [callSign, setCallSign] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (me) setCallSign(me.name ?? "");
  }, [me]);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name: callSign });
      toast.success("Call sign saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save call sign"
      );
    } finally {
      setSaving(false);
    }
  };

  const dirty = me != null && callSign.trim() !== (me.name ?? "").trim();

  return (
    <AccountSection
      title="Profile"
      description="Your call sign is how you appear in Floras. Email is tied to your sign-in."
    >
      {me === undefined ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="flex max-w-md flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-call-sign">Call sign</Label>
            <Input
              id="account-call-sign"
              value={callSign}
              onChange={(e) => setCallSign(e.target.value)}
              placeholder="e.g. Val"
              maxLength={80}
              autoComplete="nickname"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="account-email">Email</Label>
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
              disabled={saving || !callSign.trim() || !dirty}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {saving ? "Saving…" : "Save call sign"}
            </Button>
          </div>
        </div>
      )}
    </AccountSection>
  );
}
