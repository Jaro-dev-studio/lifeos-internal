"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logMetricEntry } from "@/lib/actions/metrics";
import { X } from "lucide-react";

interface LogEntryFormProps {
  metricId: string;
  metricName: string;
  metricUnit?: string;
  onClose: () => void;
}

export function LogEntryForm({
  metricId,
  metricName,
  metricUnit,
  onClose,
}: LogEntryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await logMetricEntry({
        metricId,
        value: Number(formData.get("value")),
        note: (formData.get("note") as string) || undefined,
        date: (formData.get("date") as string) || undefined,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold">
          Log {metricName}
        </h4>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
          <X className="h-3 w-3" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              name="value"
              type="number"
              step="any"
              placeholder={`Value${metricUnit ? ` (${metricUnit})` : ""}`}
              required
              disabled={isLoading}
            />
          </div>
          <div className="w-36">
            <Input
              name="date"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              disabled={isLoading}
            />
          </div>
        </div>

        <Input
          name="note"
          placeholder="Optional note..."
          disabled={isLoading}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? "Saving..." : "Log Entry"}
          </Button>
        </div>
      </form>
    </div>
  );
}
