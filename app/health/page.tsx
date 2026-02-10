import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Heart, Moon, Activity, Droplets, Scale, Brain } from "lucide-react";

export default async function HealthPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const healthMetrics = [
    { name: "Heart Rate", value: "72", unit: "bpm", icon: Heart, color: "text-red-500" },
    { name: "Sleep", value: "7.5", unit: "hours", icon: Moon, color: "text-purple-500" },
    { name: "Steps", value: "8,432", unit: "today", icon: Activity, color: "text-green-500" },
    { name: "Water", value: "6", unit: "glasses", icon: Droplets, color: "text-blue-500" },
    { name: "Weight", value: "175", unit: "lbs", icon: Scale, color: "text-orange-500" },
    { name: "Mood", value: "Good", unit: "", icon: Brain, color: "text-yellow-500" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Health
        </h1>
        <p className="text-muted-foreground">
          Track your health metrics and wellness data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {healthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-muted`}>
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
            Connect Fitbit, Apple Health, or other health services to automatically
            sync your health data. You can also manually log metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
