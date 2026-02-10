"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/auth/user-button";
import { Bell, Zap } from "lucide-react";

/**
 * Notification data - placeholder for real notifications
 */
const notifications = [
  {
    id: 1,
    title: "Workflow completed",
    description: "Daily health sync finished",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "New metric recorded",
    description: "Sleep tracked: 7.5 hours",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "AI insight available",
    description: "Weekly spending analysis ready",
    time: "3 hours ago",
    unread: false,
  },
];

export interface HeaderProps {
  /** Optional className for additional styling */
  className?: string;
  /** Callback to toggle mobile menu */
  onMobileMenuToggle?: () => void;
  /** Whether mobile menu is open */
  isMobileMenuOpen?: boolean;
}

/**
 * Dashboard header component with logo and user menu.
 * CUSTOMIZE: Update logo and user information per client.
 */
export function Header({ className, onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            onClick={onMobileMenuToggle}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
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
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* LifeOS Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              LifeOS
            </span>
          </Link>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {/* Notification badge */}
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="fixed top-16 right-2 left-2 z-20 rounded-lg border border-border bg-background shadow-lg sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-80">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <h3 className="font-semibold text-foreground">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          className={cn(
                            "flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted",
                            notification.unread && "bg-primary/5"
                          )}
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          <div
                            className={cn(
                              "mt-1 h-2 w-2 shrink-0 rounded-full",
                              notification.unread
                                ? "bg-primary"
                                : "bg-transparent"
                            )}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {notification.description}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="border-t border-border p-2">
                    <button
                      type="button"
                      className="w-full rounded-md px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                      onClick={() => setIsNotificationsOpen(false)}
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <UserButton />
        </div>
      </div>
    </header>
  );
}
