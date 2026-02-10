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
import { Plus, Play, Clock, Webhook, Hand, Settings } from "lucide-react";

export default async function WorkflowsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const workflows = [
    {
      name: "Daily Health Sync",
      description: "Sync health data from connected devices",
      trigger: "CRON",
      schedule: "Every day at 6:00 AM",
      status: "active",
      lastRun: "2 hours ago",
    },
    {
      name: "Weekly Spending Report",
      description: "Generate and send weekly spending summary",
      trigger: "CRON",
      schedule: "Every Sunday at 9:00 AM",
      status: "active",
      lastRun: "3 days ago",
    },
    {
      name: "Bank Transaction Webhook",
      description: "Process incoming bank transactions",
      trigger: "WEBHOOK",
      schedule: "On webhook trigger",
      status: "active",
      lastRun: "1 hour ago",
    },
    {
      name: "Monthly Goal Review",
      description: "Review and update monthly goals",
      trigger: "MANUAL",
      schedule: "Manual trigger",
      status: "inactive",
      lastRun: "2 weeks ago",
    },
  ];

  const getTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case "CRON":
        return Clock;
      case "WEBHOOK":
        return Webhook;
      case "MANUAL":
        return Hand;
      default:
        return Settings;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workflows
          </h1>
          <p className="text-muted-foreground">
            Automate tasks with cron jobs, webhooks, and manual triggers.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows.map((workflow, index) => {
          const TriggerIcon = getTriggerIcon(workflow.trigger);
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                    <TriggerIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{workflow.name}</h3>
                      <Badge
                        variant={workflow.status === "active" ? "accent" : "secondary"}
                      >
                        {workflow.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {workflow.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {workflow.schedule} | Last run: {workflow.lastRun}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
