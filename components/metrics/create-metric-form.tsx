"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createMetric } from "@/lib/actions/metrics";
import { X } from "lucide-react";
import type { MetricType } from "@/prisma/generated/prisma/client";

const metricTypes: { value: MetricType; label: string }[] = [
  { value: "NUMBER", label: "Number" },
  { value: "CURRENCY", label: "Currency" },
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "DURATION", label: "Duration" },
  { value: "BOOLEAN", label: "Yes/No" },
  { value: "TEXT", label: "Text" },
];

const categories = [
  "health",
  "finance",
  "fitness",
  "productivity",
  "wellness",
  "custom",
];

interface CreateMetricFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateMetricForm({ onClose, onSuccess }: CreateMetricFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await createMetric({
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        unit: (formData.get("unit") as string) || undefined,
        type: (formData.get("type") as MetricType) || "NUMBER",
        category: (formData.get("category") as string) || undefined,
        target: formData.get("target")
          ? Number(formData.get("target"))
          : undefined,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create metric");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Create New Metric</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Weight, Steps, Sleep"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="unit"
                className="text-sm font-medium text-foreground"
              >
                Unit
              </label>
              <Input
                id="unit"
                name="unit"
                placeholder="e.g., lbs, steps, hours"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Description
            </label>
            <Input
              id="description"
              name="description"
              placeholder="What is this metric tracking?"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="type"
                className="text-sm font-medium text-foreground"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
                defaultValue="NUMBER"
              >
                {metricTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium text-foreground"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isLoading}
                defaultValue=""
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="target"
                className="text-sm font-medium text-foreground"
              >
                Target
              </label>
              <Input
                id="target"
                name="target"
                type="number"
                step="any"
                placeholder="Goal value"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Metric"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
