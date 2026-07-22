"use client";

import { DashboardPrompt } from "@/components/dashboard/dashboard-prompt";
import { useDashboardChrome } from "@/components/dashboard/dashboard-shell";

export function Dashboard() {
  const { resetKey } = useDashboardChrome();
  return <DashboardPrompt resetKey={resetKey} />;
}
