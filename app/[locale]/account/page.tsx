import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  robots: noIndexRobots,
};

type Props = { params: Promise<{ locale: string }> };

export default async function AccountRedirect({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard/account`);
}
