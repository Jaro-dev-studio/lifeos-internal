import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Heart, Moon, Activity, Droplets, Scale, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HealthPage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch health-category metrics from DB
  const healthMetrics = userId
    ? await prisma.metric.findMany({
        where: { userId, category: "health", isArchived: false },
        include: {
          entries: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      })
    : [];

  const defaultMetrics = [
    {
      name: "Heart Rate",
      value: "--",
      unit: "bpm",
      icon: Heart,
      color: "text-red-500",
    },
    {
      name: "Sleep",
      value: "--",
      unit: "hours",
      icon: Moon,
      color: "text-purple-500",
    },
    {
      name: "Steps",
      value: "--",
      unit: "today",
      icon: Activity,
      color: "text-green-500",
    },
    {
      name: "Water",
      value: "--",
      unit: "glasses",
      icon: Droplets,
      color: "text-blue-500",
    },
    {
      name: "Weight",
      value: "--",
      unit: "lbs",
      icon: Scale,
      color: "text-orange-500",
    },
    {
      name: "Mood",
      value: "--",
      unit: "",
      icon: Brain,
      color: "text-yellow-500",
    },
  ];

  // Merge DB metrics with defaults
  const displayMetrics = defaultMetrics.map((def) => {
    const dbMetric = healthMetrics.find(
      (m) => m.name.toLowerCase() === def.name.toLowerCase()
    );
    if (dbMetric && dbMetric.entries.length > 0) {
      return {
        ...def,
        value: String(dbMetric.entries[0].value),
        unit: dbMetric.unit || def.unit,
      };
    }
    return def;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Health
          </h1>
          <p className="text-muted-foreground">
            Track your health metrics and wellness data.
          </p>
        </div>
        <Link href="/metrics">
          <Button variant="outline">Manage Metrics</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit && (
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Overview</CardTitle>
          <CardDescription>
            Connect health integrations to automatically track your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connect Fitbit, Apple Health, or other health services to
            automatically sync your health data. You can also manually log
            metrics from the{" "}
            <Link href="/metrics" className="text-primary hover:underline">
              Metrics
            </Link>{" "}
            page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
