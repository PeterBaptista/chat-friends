import { WSProvider } from "@/modules/chat/context/ws-context";
import { SidebarShadcnProvider } from "@/providers/sidebar-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WSProvider>
      <SidebarShadcnProvider>{children}</SidebarShadcnProvider>
    </WSProvider>
  );
}
