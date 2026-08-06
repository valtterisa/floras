"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout01Icon,
  Message01Icon,
  SidebarLeft01Icon,
  PanelLeftCloseIcon,
  Search01Icon,
  Settings01Icon,
  PencilEdit02Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons";

import { Link } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Logo } from "@/components/brand/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCredits } from "@/lib/billing/constants";
import { useGenerationAccess } from "@/lib/hooks/use-generation-access";
import { cn } from "@/lib/utils";
import type { DashboardProject } from "@/components/dashboard/types";
import type { UserMe } from "@/lib/types/user";

export function DashboardSidebar({
  projects,
  collapsed,
  onToggleCollapsed,
  onNewChat,
}: {
  projects: DashboardProject[] | undefined;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNewChat: () => void;
}) {
  const t = useTranslations("dashboard");
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.me, {}) as UserMe | null | undefined;
  const unread = useQuery(api.forms.unreadCount, {});
  const { balance, hasProPlan, hasByokPlan, hasSubscription, billingReady } =
    useGenerationAccess();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!projects) return undefined;
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(q));
  }, [projects, query]);

  const displayName = me?.name?.trim() || me?.email?.split("@")[0] || t("account");
  const initials = displayName.slice(0, 2).toUpperCase();
  const creditLabel = formatCredits(balance);
  const planLabel = !billingReady
    ? "…"
    : !hasSubscription
      ? t("noPlan")
      : hasByokPlan && !hasProPlan
        ? "BYOK"
        : `${creditLabel} credit`;

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[56px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "justify-between gap-2 px-3"
        )}
      >
        {!collapsed ? <Logo href="/dashboard" className="text-[16px]" /> : null}
        <button
          type="button"
          onClick={onToggleCollapsed}
          className="inline-flex size-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
        >
          {collapsed ? (
            <HugeiconsIcon icon={SidebarLeft01Icon} className="size-4" />
          ) : (
            <HugeiconsIcon icon={PanelLeftCloseIcon} className="size-4" />
          )}
        </button>
      </div>

      <div className={cn("flex flex-col gap-1 border-b border-sidebar-border p-2", collapsed && "items-center")}>
        <button
          type="button"
          onClick={onNewChat}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center gap-2 bg-foreground px-3 text-sm font-medium text-background transition-[filter] hover:brightness-110 active:scale-[0.98]",
            collapsed ? "size-9 justify-center px-0" : "w-full"
          )}
          aria-label={t("newChat")}
        >
          <HugeiconsIcon icon={PencilEdit02Icon} className="size-4 shrink-0" />
          {!collapsed ? <span>{t("newChat")}</span> : null}
        </button>
        <Link
          href="/dashboard/inbox"
          className={cn(
            "inline-flex h-9 items-center gap-2 px-3 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
            collapsed ? "size-9 justify-center px-0" : "w-full"
          )}
          aria-label={t("inbox")}
          title={t("inbox")}
        >
          <HugeiconsIcon icon={Mail01Icon} className="size-4 shrink-0" />
          {!collapsed ? (
            <span className="flex flex-1 items-center justify-between gap-2">
              {t("inbox")}
              {typeof unread === "number" && unread > 0 ? (
                <span className="rounded-sm bg-brand/15 px-1.5 font-mono text-[10px] text-brand">
                  {unread > 99 ? "99+" : unread}
                </span>
              ) : null}
            </span>
          ) : null}
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        {!collapsed ? (
          <div className="px-3 pt-3 pb-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("recentChats")}
            </p>
            <label htmlFor="dashboard-chat-search" className="sr-only">
              {t("searchChats")}
            </label>
            <div className="relative mt-2">
              <HugeiconsIcon icon={Search01Icon} className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                id="dashboard-chat-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-8 w-full border border-border bg-background pr-3 pl-8 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        ) : null}

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-2" aria-label={t("recentChats")}>
          {filtered === undefined ? (
            <p
              className={cn(
                "px-2 py-3 text-sm text-muted-foreground",
                collapsed && "sr-only"
              )}
            >
              {t("loading")}
            </p>
          ) : filtered.length === 0 ? (
            <p
              className={cn(
                "px-2 py-3 text-sm text-muted-foreground",
                collapsed && "sr-only"
              )}
            >
              {query ? t("noMatches") : t("noChats")}
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {filtered.map((project) => (
                <li key={project._id}>
                  <Link
                    href={`/build/${project._id}`}
                    title={project.name}
                    className={cn(
                      "group flex items-center gap-2 px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <HugeiconsIcon icon={Message01Icon} className="size-3.5 shrink-0 opacity-60" />
                    {!collapsed ? (
                      <span className="truncate">{project.name}</span>
                    ) : (
                      <span className="sr-only">{project.name}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>

      <div className="mt-auto border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 px-2 py-2 text-left transition-colors hover:bg-sidebar-accent",
                collapsed && "justify-center px-0"
              )}
            >
              <Avatar className="size-7 rounded-none">
                <AvatarFallback className="rounded-none bg-muted font-mono text-[10px] tracking-wide text-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {!collapsed ? (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {displayName}
                  </span>
                  {hasProPlan && balance != null ? (
                    <span className="shrink-0 border border-border px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-muted-foreground">
                      {creditLabel}
                    </span>
                  ) : hasByokPlan ? (
                    <span className="shrink-0 border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      BYOK
                    </span>
                  ) : null}
                </>
              ) : null}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={collapsed ? "center" : "start"}
            side="top"
            className="w-56 rounded-none"
          >
            <DropdownMenuLabel className="px-2 py-2 font-normal">
              <p className="truncate text-sm font-medium text-foreground">
                {displayName}
              </p>
              <p className="mt-1 font-mono text-[11px] tabular-nums text-muted-foreground">
                {planLabel}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account" className="cursor-pointer gap-2">
                <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                {t("account")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2"
              onClick={() => void signOut()}
            >
              <HugeiconsIcon icon={Logout01Icon} className="size-4" />
              {t("signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
