import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "@/components/settings/settings-client";

export default async function SettingsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      })
    : null;

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Unable to load user settings.</p>
      </div>
    );
  }

  return <SettingsClient user={user} />;
}
