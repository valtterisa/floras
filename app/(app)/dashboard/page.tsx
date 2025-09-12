import { getWebsitesForUser, Website } from "@/lib/database";
import { getUserProfileAndSubscription } from "@/lib/actions/user-profile";
import DashboardClient from "../../../components/editor/dashboard/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { data: userData, error: userError } =
    await getUserProfileAndSubscription();

  if (userError || !userData) {
    redirect("/login");
  }

  let websites: Website[] = [];
  let error: string | null = null;

  try {
    websites = await getWebsitesForUser(userData.profile.id);
  } catch (err) {
    error =
      typeof err === "string"
        ? err
        : err && typeof err === "object" && "message" in err
          ? (err as any).message
          : "Failed to fetch websites";
  }

  return (
    <DashboardClient websites={websites} error={error} userData={userData} />
  );
}
