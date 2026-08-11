import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { noIndexRobots } from "@/lib/seo";
import { routing, type Locale, withLocalePrefix } from "@/i18n/routing";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type Props = { params: Promise<{ locale: string }> };

export default async function AccountRedirect({ params }: Props) {
  const { locale: loc } = await params;
  const locale = (hasLocale(routing.locales, loc)
    ? loc
    : routing.defaultLocale) as Locale;
  redirect(withLocalePrefix(locale, "/dashboard/account"));
}
