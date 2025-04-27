"use client";

import { ChevronsUpDown, LogOut, UserCog } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import shadcnAvatar from "@/public/shadcn-avatar.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SettingsDialog } from "./settings-dialog";
import { ToggleTheme } from "./toggle-theme";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: session } = authClient.useSession();

  return (
    <>
      <SettingsDialog open={open} setOpen={setOpen} />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={session?.user?.image || "/placeholder.svg"}
                    alt={session?.user?.name || ""}
                  />
                  <AvatarFallback className="overflow-hidden">
                    <Image
                      src={shadcnAvatar}
                      alt="Shadcn Avatar"
                      sizes="100%"
                      className="overflow-hidden"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user?.name || ""}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user?.email || ""}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={session?.user?.image || "/placeholder.svg"}
                      alt={session?.user?.name || ""}
                    />
                    <AvatarFallback className="rounded-lg">
                      <Image
                        src={shadcnAvatar}
                        alt="Shadcn Avatar"
                        width={24}
                        height={24}
                        className="overflow-hidden"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {session?.user?.name || ""}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email || ""}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ToggleTheme />
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <UserCog />
                  Configurações do usuário
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={async () => {
                  await authClient.signOut();
                  router.refresh();
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
