"use client";

import { useTranslations } from "next-intl";
import { ProfileForm } from "@/components/account/profile-form";
import { BillingSection } from "@/components/account/billing-section";
import { ApiKeySection } from "@/components/account/api-key-section";
import { CustomInstructionsForm } from "@/components/account/custom-instructions-form";
import { DomainsSection } from "@/components/account/domains-section";
import { SettingsNav } from "@/components/account/settings-nav";
import { Container } from "@/components/site/container";
import { PageHeader } from "@/components/site/page-header";

export function AccountPage() {
  const t = useTranslations("account");

  return (
    <Container className="max-w-5xl pb-16 md:px-8">
      <PageHeader
        className="border-b border-border py-8"
        title={t("title")}
        description={t("description")}
      />

      <div className="mt-0 flex flex-col lg:mt-8 lg:flex-row lg:gap-10">
        <SettingsNav />
        <div className="mt-6 flex min-w-0 flex-1 flex-col gap-6 lg:mt-0">
          <ProfileForm />
          <BillingSection />
          <ApiKeySection />
          <DomainsSection />
          <CustomInstructionsForm />
        </div>
      </div>
    </Container>
  );
}
