"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "../../app-sidebar";
import { SidebarInset, SidebarProvider } from "../../ui/sidebar";
import { useEffect, useState } from "react";
import { UserSubscriptionData } from "@/lib/actions/user-profile";
import { Website } from "@/lib/database";

export function DashboardShell({
  children,
  userData,
  websites,
}: {
  children: React.ReactNode;
  userData: UserSubscriptionData;
  websites: Website[];
}) {
  const pathname = usePathname();
  const [activeWebsite, setActiveWebsite] = useState<Website | null>(null);

  // Set first website as active if none is selected and websites are available
  useEffect(() => {
    if (websites.length > 0 && !activeWebsite) {
      setActiveWebsite(websites[0]);
      // Store selection in localStorage
      localStorage.setItem("activeWebsiteId", websites[0].id);
    }
  }, [websites, activeWebsite]);

  // Load active website from localStorage on initial render
  useEffect(() => {
    const savedWebsiteId = localStorage.getItem("activeWebsiteId");
    if (savedWebsiteId && websites.length > 0) {
      const website = websites.find((site) => site.id === savedWebsiteId);
      if (website) {
        setActiveWebsite(website);
      }
    }
  }, [websites]);

  // If on editor page, show chat on left instead of sidebar
  if (pathname?.includes("editor")) {
    return (
      <SidebarProvider>
        <SidebarInset className="rounded-3xl min-w-0 flex-1">
          {children}
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-dvh h-screen px-2 md:p-2 md:px-0 w-full">
        <AppSidebar
          className="hidden md:flex"
          user={userData.profile}
          userData={userData}
        />
        <SidebarInset className="rounded-3xl min-w-0 flex-1">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
