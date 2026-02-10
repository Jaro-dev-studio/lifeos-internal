import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Heart,
  Wallet,
  Moon,
  MessageSquare,
  Workflow,
  Plus,
} from "lucide-react";
import Link from "next/link";

/**
 * Dashboard quick metrics - placeholder data
 */
const quickMetrics = [
  {
    label: "Health Score",
    value: "87",
    unit: "/100",
    change: "+3",
    isPositive: true,
    icon: Heart,
    color: "text-red-500",
  },
  {
    label: "Monthly Spending",
    value: "$2,450",
    unit: "",
    change: "-12%",
    isPositive: true,
    icon: Wallet,
    color: "text-green-500",
  },
  {
    label: "Sleep Average",
    value: "7.2",
    unit: "hrs",
    change: "+0.5",
    isPositive: true,
    icon: Moon,
    color: "text-purple-500",
  },
  {
    label: "Active Workflows",
    value: "5",
    unit: "",
    change: "running",
    isPositive: true,
    icon: Workflow,
    color: "text-blue-500",
  },
];

/**
 * Recent activity - placeholder data
 */
const recentActivity = [
  {
    type: "metric",
    title: "Sleep logged",
    description: "7.5 hours recorded",
    time: "2 hours ago",
    icon: Moon,
  },
  {
    type: "workflow",
    title: "Daily sync completed",
    description: "Health data synced from Fitbit",
    time: "4 hours ago",
    icon: Activity,
  },
  {
    type: "ai",
    title: "AI insight generated",
    description: "Weekly spending analysis ready",
    time: "Yesterday",
    icon: MessageSquare,
  },
  {
    type: "metric",
    title: "Budget updated",
    description: "February budget set to $3,000",
    time: "2 days ago",
    icon: Wallet,
  },
];

/**
 * Quick actions for the dashboard
 */
const quickActions = [
  { label: "Log Metric", href: "/metrics", icon: Plus },
  { label: "Start Chat", href: "/chat", icon: MessageSquare },
  { label: "Run Workflow", href: "/workflows", icon: Workflow },
  { label: "View Health", href: "/health", icon: Heart },
];

export default async function DashboardPage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user) {
    redirect("/sign-in");
  }

  const userName = session.user.name || session.user.email?.split("@")[0] || "User";

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your life metrics and recent activity.
        </p>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardDescription className="text-sm font-medium">
                {metric.label}
              </CardDescription>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}
                <span className="text-sm font-normal text-muted-foreground">
                  {metric.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={
                    metric.isPositive ? "text-accent" : "text-destructive"
                  }
                >
                  {metric.change}
                </span>{" "}
                from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest metrics, workflows, and insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Prompt */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Chat with your data</h3>
              <p className="text-sm text-muted-foreground">
                Ask questions about your metrics, get insights, or run workflows using natural language.
              </p>
            </div>
            <Link href="/chat">
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
