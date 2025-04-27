import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TanstackQueryProvider } from "@/providers/tanstack-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarShadcnProvider } from "@/providers/sidebar-provider";
import { ThemeProvider } from "../providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat Friends",
  description: "Chat with your friends in real time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
        >

          <TanstackQueryProvider>{children}</TanstackQueryProvider>
          <Toaster />

        </ThemeProvider>


      </body>
    </html>
  );
}
