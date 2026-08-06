import type { Metadata } from "next";
import { noIndexRobots } from "@/lib/seo";
import { AccountPage } from "@/components/account/account-page";

export const metadata: Metadata = {
  title: "Account",
  robots: noIndexRobots,
};

export default function DashboardAccountPage() {
  return <AccountPage />;
}
