"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Workflow,
  Plug,
  Settings,
  Activity,
  Wallet,
  Heart,
} from "lucide-react";

/**
 * Sidebar navigation item type
 */
interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

/**
 * Sidebar section with grouped items
 */
interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

/**
 * LifeOS sidebar navigation sections
 */
const sidebarSections: SidebarSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "Metrics",
        href: "/metrics",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        label: "AI Chat",
        href: "/chat",
        icon: <MessageSquare className="h-5 w-5" />,
        badge: "AI",
      },
    ],
  },
  {
    title: "Automation",
    items: [
      {
        label: "Workflows",
        href: "/workflows",
        icon: <Workflow className="h-5 w-5" />,
      },
      {
        label: "Integrations",
        href: "/integrations",
        icon: <Plug className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "Life Areas",
    items: [
      {
        label: "Health",
        href: "/health",
        icon: <Heart className="h-5 w-5" />,
      },
      {
        label: "Finance",
        href: "/finance",
        icon: <Wallet className="h-5 w-5" />,
      },
      {
        label: "Activity",
        href: "/activity",
        icon: <Activity className="h-5 w-5" />,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

export interface SidebarProps {
  /** Optional className for additional styling */
  className?: string;
  /** Custom sections override */
  sections?: SidebarSection[];
  /** Whether this is a mobile drawer */
  isMobile?: boolean;
  /** Whether the mobile drawer is open */
  isOpen?: boolean;
  /** Callback to close the mobile drawer */
  onClose?: () => void;
}

/**
 * Sidebar navigation component for dashboard layouts.
 * CUSTOMIZE: Update navigation items in sidebarSections array.
 */
export function Sidebar({
  className,
  sections = sidebarSections,
  isMobile = false,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex-1 overflow-y-auto py-4">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="px-3">
          {section.title && (
            <h3 className="mb-2 mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
          )}
          <nav className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );

  // Mobile drawer mode
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          {/* Mobile drawer header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <span className="text-lg font-semibold text-foreground">Menu</span>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={onClose}
              aria-label="Close menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop mode
  return (
    <aside
      className={cn(
        "flex w-64 flex-col border-r border-border bg-background",
        className
      )}
    >
      {sidebarContent}
    </aside>
  );
}
