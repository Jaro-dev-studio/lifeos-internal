"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  createWorkflow,
  deleteWorkflow,
  toggleWorkflow,
  runWorkflow,
} from "@/lib/actions/workflows";
import {
  Plus,
  Play,
  Clock,
  Webhook,
  Hand,
  Settings,
  Trash2,
  Power,
  X,
  Workflow,
  Loader2,
} from "lucide-react";
import type { WorkflowTrigger } from "@/prisma/generated/prisma/client";

interface WorkflowRun {
  id: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
}

interface WorkflowData {
  id: string;
  name: string;
  description: string | null;
  trigger: WorkflowTrigger;
  triggerConfig: unknown;
  actions: unknown;
  isEnabled: boolean;
  createdAt: Date;
  runs: WorkflowRun[];
}

interface WorkflowsClientProps {
  initialWorkflows: WorkflowData[];
}

const triggerTypes: { value: WorkflowTrigger; label: string; icon: typeof Clock }[] = [
  { value: "CRON", label: "Scheduled (Cron)", icon: Clock },
  { value: "WEBHOOK", label: "Webhook", icon: Webhook },
  { value: "MANUAL", label: "Manual Trigger", icon: Hand },
  { value: "EVENT", label: "Event-Based", icon: Settings },
];

export function WorkflowsClient({ initialWorkflows }: WorkflowsClientProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await createWorkflow({
        name: formData.get("name") as string,
        description: (formData.get("description") as string) || undefined,
        trigger: (formData.get("trigger") as WorkflowTrigger) || "MANUAL",
        actions: [{ type: "log", message: "Workflow executed" }],
      });
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async (id: string) => {
    setRunningId(id);
    try {
      await runWorkflow(id);
    } catch {
      // Handled by server action
    } finally {
      setRunningId(null);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleWorkflow(id);
    } catch {
      // Handled by server action
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    try {
      await deleteWorkflow(id);
    } catch {
      // Handled by server action
    }
  };

  const getTriggerIcon = (trigger: WorkflowTrigger) => {
    const found = triggerTypes.find((t) => t.value === trigger);
    return found?.icon || Settings;
  };

  const getTriggerLabel = (trigger: WorkflowTrigger) => {
    const found = triggerTypes.find((t) => t.value === trigger);
    return found?.label || trigger;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Workflows
          </h1>
          <p className="text-muted-foreground">
            Automate tasks with cron jobs, webhooks, and manual triggers.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Create New Workflow</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreating(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="wf-name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name *
                  </label>
                  <Input
                    id="wf-name"
                    name="name"
                    placeholder="e.g., Daily Health Sync"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="wf-trigger"
                    className="text-sm font-medium text-foreground"
                  >
                    Trigger Type
                  </label>
                  <select
                    id="wf-trigger"
                    name="trigger"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={isSubmitting}
                    defaultValue="MANUAL"
                  >
                    {triggerTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="wf-description"
                  className="text-sm font-medium text-foreground"
                >
                  Description
                </label>
                <Input
                  id="wf-description"
                  name="description"
                  placeholder="What does this workflow do?"
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Workflow"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Workflows List */}
      {initialWorkflows.length > 0 ? (
        <div className="grid gap-4">
          {initialWorkflows.map((workflow) => {
            const TriggerIcon = getTriggerIcon(workflow.trigger);
            const lastRun =
              workflow.runs.length > 0 ? workflow.runs[0] : null;

            return (
              <Card key={workflow.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
                      <TriggerIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{workflow.name}</h3>
                        <Badge
                          variant={
                            workflow.isEnabled ? "accent" : "secondary"
                          }
                        >
                          {workflow.isEnabled ? "Active" : "Disabled"}
                        </Badge>
                        <Badge variant="outline">
                          {getTriggerLabel(workflow.trigger)}
                        </Badge>
                      </div>
                      {workflow.description && (
                        <p className="text-sm text-muted-foreground">
                          {workflow.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {lastRun
                          ? `Last run: ${new Date(lastRun.startedAt).toLocaleString()} (${lastRun.status.toLowerCase()})`
                          : "Never run"}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggle(workflow.id)}
                        title={
                          workflow.isEnabled
                            ? "Disable workflow"
                            : "Enable workflow"
                        }
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRun(workflow.id)}
                        disabled={runningId === workflow.id}
                      >
                        {runningId === workflow.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Play className="h-4 w-4 mr-1" />
                        )}
                        Run
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(workflow.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        !isCreating && (
          <Card>
            <CardContent className="p-12 text-center">
              <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No workflows yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first workflow to automate tasks and processes.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Workflow
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
