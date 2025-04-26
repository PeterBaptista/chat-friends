"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import shadcnAvatar from "@/public/shadcn-avatar.png";

import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";
import axiosClient from "@/lib/axios-client";
import { useQuery } from "@tanstack/react-query";
import { User } from "better-auth/types";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

export function UsersFallback() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Amigos</SidebarGroupLabel>
      <SidebarMenu>
        {Array.from({ length: 5 }).map((_, index) => (
          <SidebarMenuItem key={index} className="flex items-center gap-2 px-2">
            <Skeleton className="h-6 w-6 rounded-full bg-muted-foreground/40" />

            <Skeleton className="h-4 w-full bg-muted-foreground/40" />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavMain() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const { toggleSidebar } = useSidebar();

  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const isMobile = useIsMobile();

  const usersQuery = useQuery({
    queryKey: ["friends-users-query"],
    queryFn: async (): Promise<User[]> => {
      const { data } = await axiosClient.get("/friends", {});
      return data ?? [];
    },
    enabled: !!userId,
  });
  if (usersQuery.isLoading) return <UsersFallback />;
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Amigos</SidebarGroupLabel>
      <SidebarMenu>
        {usersQuery.data?.map((user) => (
          <SidebarMenuItem key={user.id}>
            <SidebarMenuButton
              tooltip={user.name}
              onClick={() => {
                if (isMobile) {
                  toggleSidebar(); // Add toggleSidebar() inside the if block for mobile
                }
                router.push(
                  pathname + "?" + createQueryString("userId", user.id)
                );
              }}
            >
              <Avatar>
                <AvatarImage
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="overflow-hidden">
                  <Image
                    src={shadcnAvatar}
                    alt="Shadcn Avatar"
                    width={24}
                    height={24}
                    className="overflow-hidden"
                  />
                </AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
