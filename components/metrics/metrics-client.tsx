"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateMetricForm } from "./create-metric-form";
import { LogEntryForm } from "./log-entry-form";
import { deleteMetric } from "@/lib/actions/metrics";
import {
  Plus,
  BarChart3,
  TrendingUp,
  Pencil,
  Trash2,
  Target,
} from "lucide-react";
import type { MetricType } from "@/prisma/generated/prisma/client";

interface MetricEntry {
  id: string;
  value: number;
  note: string | null;
  date: Date;
}

interface Metric {
  id: string;
  name: string;
  description: string | null;
  unit: string | null;
  type: MetricType;
  category: string | null;
  target: number | null;
  entries: MetricEntry[];
}

interface MetricsClientProps {
  initialMetrics: Metric[];
}

export function MetricsClient({ initialMetrics }: MetricsClientProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [loggingMetricId, setLoggingMetricId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this metric and all its entries?")) {
      return;
    }
    setIsDeleting(id);
    try {
      await deleteMetric(id);
    } catch {
      // Error handled by server action
    } finally {
      setIsDeleting(null);
    }
  };

  const getLatestValue = (metric: Metric) => {
    if (metric.entries.length === 0) return "--";
    return String(metric.entries[0].value);
  };

  const getTrend = (metric: Metric) => {
    if (metric.entries.length < 2) return null;
    const latest = metric.entries[0].value;
    const previous = metric.entries[1].value;
    const diff = latest - previous;
    const pct = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : "0";
    return {
      value: diff > 0 ? `+${pct}%` : `${pct}%`,
      isPositive: diff >= 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Metrics
          </h1>
          <p className="text-muted-foreground">
            Track and visualize your life metrics.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Metric
        </Button>
      </div>

      {/* Create Metric Form */}
      {isCreating && (
        <CreateMetricForm onClose={() => setIsCreating(false)} />
      )}

      {/* Metrics Grid */}
      {initialMetrics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialMetrics.map((metric) => {
            const trend = getTrend(metric);
            return (
              <Card
                key={metric.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardDescription className="font-medium">
                      {metric.name}
                    </CardDescription>
                    <div className="flex items-center gap-1">
                      {metric.category && (
                        <Badge variant="outline" className="text-xs">
                          {metric.category}
                        </Badge>
                      )}
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {getLatestValue(metric)}
                    {metric.unit && (
                      <span className="text-lg font-normal text-muted-foreground ml-1">
                        {metric.unit}
                      </span>
                    )}
                  </div>

                  {metric.target && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Target className="h-3 w-3" />
                      Target: {metric.target} {metric.unit || ""}
                    </div>
                  )}

                  {trend && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp
                        className={`h-3 w-3 ${trend.isPositive ? "text-accent" : "text-destructive"}`}
                      />
                      <span
                        className={
                          trend.isPositive ? "text-accent" : "text-destructive"
                        }
                      >
                        {trend.value}
                      </span>{" "}
                      from last entry
                    </p>
                  )}

                  {metric.entries.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {metric.entries.length} entries | Last:{" "}
                      {new Date(metric.entries[0].date).toLocaleDateString()}
                    </p>
                  )}

                  {/* Log Entry Form */}
                  {loggingMetricId === metric.id ? (
                    <div className="mt-3">
                      <LogEntryForm
                        metricId={metric.id}
                        metricName={metric.name}
                        metricUnit={metric.unit || undefined}
                        onClose={() => setLoggingMetricId(null)}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => setLoggingMetricId(metric.id)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Log Entry
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(metric.id)}
                        disabled={isDeleting === metric.id}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        !isCreating && (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No metrics yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first metric to start tracking the data that matters
                to you.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Metric
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
