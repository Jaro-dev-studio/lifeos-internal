import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint for external integrations.
 * Triggers the corresponding workflow when called.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  console.log("[Webhooks] Received webhook for workflow:", id);

  try {
    // Find the workflow
    const workflow = await prisma.workflow.findFirst({
      where: {
        id,
        trigger: "WEBHOOK",
        isEnabled: true,
      },
    });

    if (!workflow) {
      console.log("[Webhooks] Workflow not found or not a webhook trigger");
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    console.log("[Webhooks] Parsing request body...");

    const body = await req.json().catch(() => ({}));

    console.log("[Webhooks] Creating workflow run...");

    // Create a run record
    const run = await prisma.workflowRun.create({
      data: {
        workflowId: workflow.id,
        userId: workflow.userId,
        status: "RUNNING",
        input: body,
      },
    });

    console.log("[Webhooks] Executing workflow actions...");

    // Execute workflow (simplified - would contain real action execution)
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      await prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: "COMPLETED",
          completedAt: new Date(),
          output: { message: "Webhook processed successfully", input: body },
        },
      });

      console.log("[Webhooks] Workflow executed successfully");

      return NextResponse.json({
        success: true,
        runId: run.id,
      });
    } catch (error) {
      await prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });

      console.error("[Webhooks] Workflow execution failed:", error);

      return NextResponse.json(
        { error: "Workflow execution failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[Webhooks] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
