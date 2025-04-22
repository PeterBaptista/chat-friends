"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "./icons";
import { SidebarNotifications } from "./sidebar-notifications";

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex gap-2 items-center">
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Icons.reducedLogo className=" fill-background" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">ChatFriends</span>
          </div>
        </SidebarMenuButton>

        <SidebarNotifications />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
