import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SessionProvider } from "@/components/auth/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LifeOS - Your Life Operating System",
  description: "Dashboard for your life. Track metrics, run workflows, chat with AI, and integrate all your data.",
  keywords: ["life", "dashboard", "metrics", "ai", "workflows", "automation"],
};

/**
 * Root layout component with dashboard structure.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-background font-sans antialiased`}
      >
        <SessionProvider>
          <DashboardShell>{children}</DashboardShell>
        </SessionProvider>
      </body>
    </html>
  );
}
