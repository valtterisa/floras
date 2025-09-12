import { ReactNode } from "react";
import { DashboardShell } from "@/components/editor/dashboard/dashboard-shell";
import {
  getUserProfileAndSubscription,
  getUserWebsites,
} from "@/lib/actions/user-profile";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: userData, error: userError } =
    await getUserProfileAndSubscription();

  if (userError || !userData) {
    redirect("/login");
  }

  const { websites } = await getUserWebsites();

  return (
    <DashboardShell userData={userData} websites={websites}>
      {children}
    </DashboardShell>
  );
}
