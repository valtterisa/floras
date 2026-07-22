"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignInForm } from "@/components/auth/sign-in-form";

export type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: string | null;
};

export function AuthModal({ open, onOpenChange, prompt = null }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            {prompt
              ? "Create an account or sign in to start generating your site."
              : "Create an account or sign in to continue."}
          </DialogDescription>
        </DialogHeader>
        <SignInForm
          key={prompt ?? "auth"}
          pendingPrompt={prompt}
          variant="modal"
        />
      </DialogContent>
    </Dialog>
  );
}
