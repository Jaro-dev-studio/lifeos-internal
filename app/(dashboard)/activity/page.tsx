import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Activity,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ActivityPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch real activity data
  const [recentEntries, recentWorkflowRuns] = await Promise.all([
    prisma.metricEntry.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { metric: true },
    }),
    prisma.workflowRun.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: { workflow: true },
    }),
  ]);

  // Merge and sort activity items
  const activityItems = [
    ...recentEntries.map((entry) => ({
      type: "metric" as const,
      title: `${entry.metric.name} logged`,
      description: `${entry.value} ${entry.metric.unit || ""}${entry.note ? ` - ${entry.note}` : ""}`,
      time: entry.createdAt,
      status: "success" as const,
    })),
    ...recentWorkflowRuns.map((run) => ({
      type: "workflow" as const,
      title: `${run.workflow.name} ${run.status.toLowerCase()}`,
      description: run.error || `Status: ${run.status}`,
      time: run.startedAt,
      status: (run.status === "COMPLETED"
        ? "success"
        : run.status === "FAILED"
          ? "error"
          : "pending") as "success" | "error" | "pending",
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 15);

  const successCount = activityItems.filter(
    (i) => i.status === "success"
  ).length;
  const errorCount = activityItems.filter((i) => i.status === "error").length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-accent" />;
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Activity
        </h1>
        <p className="text-muted-foreground">
          View your recent activity and system events.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{successCount}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{errorCount}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activityItems.length}</p>
                <p className="text-sm text-muted-foreground">Total events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Recent system events and user actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityItems.length > 0 ? (
            <div className="space-y-4">
              {activityItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                >
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{item.title}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(item.time)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No activity yet. Start tracking metrics or running workflows to
              see activity here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
