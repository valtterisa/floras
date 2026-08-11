import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing, type Locale, withLocalePrefix } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function PricingPage({ params }: Props) {
  const { locale: loc } = await params;
  const locale = (hasLocale(routing.locales, loc)
    ? loc
    : routing.defaultLocale) as Locale;
  const home = withLocalePrefix(locale);
  redirect(home === "/" ? "/#pricing" : `${home}/#pricing`);
}
