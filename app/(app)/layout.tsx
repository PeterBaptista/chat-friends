"use client";
import { BubblesBackground } from "@/components/bubbles";
import { WSProvider } from "@/modules/chat/context/ws-context";
import { SidebarShadcnProvider } from "@/providers/sidebar-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative bg-transparent overflow-hidden">
      <BubblesBackground className="absolute z-10 " />
      <WSProvider>
        <SidebarShadcnProvider>{children}</SidebarShadcnProvider>
      </WSProvider>
    </div>
  );
}
