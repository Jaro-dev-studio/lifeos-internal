import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WorkflowsClient } from "@/components/workflows/workflows-client";

export default async function WorkflowsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const workflows = userId
    ? await prisma.workflow.findMany({
        where: { userId, isArchived: false },
        include: {
          runs: {
            orderBy: { startedAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="p-6">
      <WorkflowsClient initialWorkflows={workflows} />
    </div>
  );
}
