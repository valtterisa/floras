import type { Metadata } from "next";
import { InboxView } from "@/components/dashboard/inbox-view";
import { noIndexRobots } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Inbox",
  robots: noIndexRobots,
};

export default function InboxPage() {
  return <InboxView />;
}
