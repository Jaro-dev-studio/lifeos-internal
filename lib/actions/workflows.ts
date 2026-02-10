"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { WorkflowTrigger } from "@/prisma/generated/prisma/client";
import type { InputJsonValue } from "@/prisma/generated/prisma/internal/prismaNamespace";

interface CreateWorkflowInput {
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  triggerConfig?: string;
  actions: { type: string; message: string }[];
}

export async function createWorkflow(input: CreateWorkflowInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Workflows] Creating new workflow:", input.name);

  const workflow = await prisma.workflow.create({
    data: {
      userId: session.user.id,
      name: input.name,
      description: input.description || null,
      trigger: input.trigger,
      triggerConfig: input.triggerConfig
        ? JSON.parse(input.triggerConfig)
        : undefined,
      actions: input.actions as unknown as InputJsonValue,
    },
  });

  console.log("[Workflows] Workflow created successfully:", workflow.id);

  revalidatePath("/workflows");
  revalidatePath("/");
  return workflow;
}

export async function updateWorkflow(
  id: string,
  input: Partial<CreateWorkflowInput> & { isEnabled?: boolean }
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Workflows] Updating workflow:", id);

  const existing = await prisma.workflow.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Workflow not found");

  const workflow = await prisma.workflow.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      trigger: input.trigger,
      triggerConfig: input.triggerConfig
        ? JSON.parse(input.triggerConfig)
        : undefined,
      actions: input.actions
        ? (input.actions as unknown as InputJsonValue)
        : undefined,
      isEnabled: input.isEnabled,
    },
  });

  console.log("[Workflows] Workflow updated successfully");

  revalidatePath("/workflows");
  revalidatePath("/");
  return workflow;
}

export async function deleteWorkflow(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Workflows] Deleting workflow:", id);

  const existing = await prisma.workflow.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Workflow not found");

  await prisma.workflow.delete({ where: { id } });

  console.log("[Workflows] Workflow deleted successfully");

  revalidatePath("/workflows");
  revalidatePath("/");
}

export async function toggleWorkflow(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Workflows] Toggling workflow:", id);

  const existing = await prisma.workflow.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Workflow not found");

  const workflow = await prisma.workflow.update({
    where: { id },
    data: { isEnabled: !existing.isEnabled },
  });

  console.log(
    "[Workflows] Workflow toggled:",
    workflow.isEnabled ? "enabled" : "disabled"
  );

  revalidatePath("/workflows");
  return workflow;
}

export async function runWorkflow(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Workflows] Running workflow:", id);

  const workflow = await prisma.workflow.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!workflow) throw new Error("Workflow not found");

  console.log("[Workflows] Creating workflow run record...");

  // Create a run record
  const run = await prisma.workflowRun.create({
    data: {
      workflowId: id,
      userId: session.user.id,
      status: "RUNNING",
    },
  });

  console.log("[Workflows] Executing workflow actions...");

  // Simulate workflow execution
  try {
    // In a real implementation, this would execute the workflow actions
    await new Promise((resolve) => setTimeout(resolve, 100));

    await prisma.workflowRun.update({
      where: { id: run.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        output: { message: "Workflow completed successfully" },
      },
    });

    console.log("[Workflows] Workflow run completed successfully:", run.id);
  } catch (error) {
    await prisma.workflowRun.update({
      where: { id: run.id },
      data: {
        status: "FAILED",
        completedAt: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    console.error("[Workflows] Workflow run failed:", error);
  }

  revalidatePath("/workflows");
  revalidatePath("/activity");
  return run;
}
