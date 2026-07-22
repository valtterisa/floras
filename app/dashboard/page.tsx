import { SiteNav } from "@/components/site/site-nav";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  return (
    <>
      <SiteNav />
      <main>
        <Dashboard />
      </main>
    </>
  );
}
