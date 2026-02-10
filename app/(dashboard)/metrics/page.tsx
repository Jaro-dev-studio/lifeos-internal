import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MetricsClient } from "@/components/metrics/metrics-client";

export default async function MetricsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const metrics = userId
    ? await prisma.metric.findMany({
        where: { userId, isArchived: false },
        include: {
          entries: {
            orderBy: { date: "desc" },
            take: 10,
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="p-6">
      <MetricsClient initialMetrics={metrics} />
    </div>
  );
}
