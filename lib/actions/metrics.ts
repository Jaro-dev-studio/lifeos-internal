"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { MetricType } from "@/prisma/generated/prisma/client";

interface CreateMetricInput {
  name: string;
  description?: string;
  unit?: string;
  type: MetricType;
  category?: string;
  target?: number;
}

interface LogEntryInput {
  metricId: string;
  value: number;
  note?: string;
  date?: string;
}

export async function createMetric(input: CreateMetricInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Metrics] Creating new metric:", input.name);

  const metric = await prisma.metric.create({
    data: {
      userId: session.user.id,
      name: input.name,
      description: input.description || null,
      unit: input.unit || null,
      type: input.type,
      category: input.category || null,
      target: input.target || null,
    },
  });

  console.log("[Metrics] Metric created successfully:", metric.id);

  revalidatePath("/metrics");
  revalidatePath("/");
  return metric;
}

export async function updateMetric(
  id: string,
  input: Partial<CreateMetricInput>
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Metrics] Updating metric:", id);

  // Verify ownership
  const existing = await prisma.metric.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Metric not found");

  const metric = await prisma.metric.update({
    where: { id },
    data: {
      name: input.name,
      description: input.description,
      unit: input.unit,
      type: input.type,
      category: input.category,
      target: input.target,
    },
  });

  console.log("[Metrics] Metric updated successfully");

  revalidatePath("/metrics");
  revalidatePath("/");
  return metric;
}

export async function deleteMetric(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Metrics] Deleting metric:", id);

  // Verify ownership
  const existing = await prisma.metric.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Metric not found");

  await prisma.metric.delete({ where: { id } });

  console.log("[Metrics] Metric deleted successfully");

  revalidatePath("/metrics");
  revalidatePath("/");
}

export async function archiveMetric(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Metrics] Archiving metric:", id);

  const existing = await prisma.metric.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Metric not found");

  await prisma.metric.update({
    where: { id },
    data: { isArchived: true },
  });

  console.log("[Metrics] Metric archived successfully");

  revalidatePath("/metrics");
  revalidatePath("/");
}

export async function logMetricEntry(input: LogEntryInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Metrics] Logging entry for metric:", input.metricId);

  // Verify ownership of the metric
  const metric = await prisma.metric.findFirst({
    where: { id: input.metricId, userId: session.user.id },
  });
  if (!metric) throw new Error("Metric not found");

  const entry = await prisma.metricEntry.create({
    data: {
      metricId: input.metricId,
      userId: session.user.id,
      value: input.value,
      note: input.note || null,
      date: input.date ? new Date(input.date) : new Date(),
    },
  });

  console.log("[Metrics] Entry logged successfully:", entry.id);

  revalidatePath("/metrics");
  revalidatePath("/health");
  revalidatePath("/finance");
  revalidatePath("/");
  return entry;
}

export async function getMetrics() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.metric.findMany({
    where: { userId: session.user.id, isArchived: false },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: 10,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMetricHistory(metricId: string, limit = 30) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const metric = await prisma.metric.findFirst({
    where: { id: metricId, userId: session.user.id },
  });
  if (!metric) throw new Error("Metric not found");

  return prisma.metricEntry.findMany({
    where: { metricId },
    orderBy: { date: "desc" },
    take: limit,
  });
}
