"use client";

import { ProfileForm } from "@/components/account/profile-form";
import { BillingSection } from "@/components/account/billing-section";
import { CustomInstructionsForm } from "@/components/account/custom-instructions-form";
import { DomainsSection } from "@/components/account/domains-section";
import { SettingsNav } from "@/components/account/settings-nav";

export function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pb-16 md:px-8">
      <div className="border-b border-border py-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Account
        </h1>
        <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
          Manage your profile, billing, domains, and how Floras writes your
          sites.
        </p>
      </div>

      <div className="mt-0 flex flex-col lg:mt-8 lg:flex-row lg:gap-10">
        <SettingsNav />
        <div className="mt-6 flex min-w-0 flex-1 flex-col gap-6 lg:mt-0">
          <ProfileForm />
          <BillingSection />
          <DomainsSection />
          <CustomInstructionsForm />
        </div>
      </div>
    </div>
  );
}
