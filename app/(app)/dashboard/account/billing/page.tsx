import { redirect } from "next/navigation";
import { getUserProfileAndSubscription } from "@/lib/actions/user-profile";
import BillingClient from "./BillingClient";

export default async function BillingPage() {
  const { data: userData, error } = await getUserProfileAndSubscription();

  if (error || !userData) {
    redirect("/login");
  }

  return <BillingClient userData={userData} />;
}
