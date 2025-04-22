import { SidebarShadcnProvider } from "@/providers/sidebar-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarShadcnProvider>{children}</SidebarShadcnProvider>;
}
