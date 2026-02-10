import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Activity,
  Heart,
  Wallet,
  Moon,
  MessageSquare,
  Workflow,
  Plus,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch real data from DB
  const [metricsCount, workflowsCount, recentEntries, conversations] =
    await Promise.all([
      prisma.metric.count({ where: { userId, isArchived: false } }),
      prisma.workflow.count({ where: { userId, isEnabled: true } }),
      prisma.metricEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 5,
        include: { metric: true },
      }),
      prisma.chatConversation.count({ where: { userId } }),
    ]);

  const userName =
    session?.user?.name || session?.user?.email?.split("@")[0] || "User";

  const quickMetrics = [
    {
      label: "Tracked Metrics",
      value: String(metricsCount),
      unit: "",
      description: "metrics defined",
      icon: BarChart3,
      color: "text-blue-500",
      href: "/metrics",
    },
    {
      label: "Active Workflows",
      value: String(workflowsCount),
      unit: "",
      description: "running",
      icon: Workflow,
      color: "text-purple-500",
      href: "/workflows",
    },
    {
      label: "AI Conversations",
      value: String(conversations),
      unit: "",
      description: "total chats",
      icon: MessageSquare,
      color: "text-green-500",
      href: "/chat",
    },
    {
      label: "Recent Entries",
      value: String(recentEntries.length),
      unit: "",
      description: "logged recently",
      icon: TrendingUp,
      color: "text-orange-500",
      href: "/metrics",
    },
  ];

  const quickActions = [
    { label: "Log Metric", href: "/metrics", icon: Plus },
    { label: "Start Chat", href: "/chat", icon: MessageSquare },
    { label: "Run Workflow", href: "/workflows", icon: Workflow },
    { label: "View Health", href: "/health", icon: Heart },
  ];

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
          <Link key={index} href={metric.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardDescription className="text-sm font-medium">
                  {metric.label}
                </CardDescription>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value}
                  {metric.unit && (
                    <span className="text-sm font-normal text-muted-foreground">
                      {metric.unit}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest metric entries and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-medium">
                        {entry.metric.name} logged
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.value} {entry.metric.unit || ""}
                        {entry.note ? ` - ${entry.note}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No activity yet. Start by creating metrics and logging entries.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform.</CardDescription>
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
                Ask questions about your metrics, get insights, or run workflows
                using natural language.
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
