import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus, BarChart3, TrendingUp, Calendar } from "lucide-react";

export default async function MetricsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Metrics
          </h1>
          <p className="text-muted-foreground">
            Track and visualize your life metrics.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Metric
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder metric cards */}
        {[
          { name: "Weight", value: "175", unit: "lbs", trend: "-2 this month" },
          { name: "Steps Today", value: "8,432", unit: "steps", trend: "+12% avg" },
          { name: "Water Intake", value: "6", unit: "glasses", trend: "Goal: 8" },
          { name: "Meditation", value: "15", unit: "min", trend: "Streak: 7 days" },
          { name: "Savings Rate", value: "22", unit: "%", trend: "+3% from last month" },
          { name: "Books Read", value: "3", unit: "this year", trend: "Goal: 24" },
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardDescription>{metric.name}</CardDescription>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {metric.value}
                <span className="text-lg font-normal text-muted-foreground ml-1">
                  {metric.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-accent" />
                {metric.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Set up your first metrics to start tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your database and start tracking the metrics that matter to you.
            Create custom metrics with different types: numbers, currency, percentages, and more.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              View History
            </Button>
            <Button variant="outline" size="sm">
              Import Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
