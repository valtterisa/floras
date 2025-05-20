"use client";

import {
  MailIcon,
  PlusCircleIcon,
  type LucideIcon,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { cva } from "class-variance-authority";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    children?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
}) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item, idx) => (
            <SidebarMenuItem key={item.title}>
              <div className="flex items-center w-full">
                {item.children ? (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="bg-sidebar hover:bg-sidebar-hover"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronDown
                      className={cn(
                        "ml-auto transition-transform",
                        openIndex === idx ? "rotate-180" : ""
                      )}
                    />
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="bg-sidebar hover:bg-sidebar-hover"
                  >
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </div>
              {item.children && openIndex === idx && (
                <SidebarMenuSub>
                  {item.children.map((sub) => (
                    <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton
                        href={sub.url}
                        className="bg-sidebar hover:bg-sidebar-hover"
                      >
                        {sub.icon && <sub.icon />}
                        <span>{sub.title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
