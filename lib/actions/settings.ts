"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateProfileInput {
  name?: string;
}

export async function updateProfile(input: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Settings] Updating user profile...");

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: input.name,
    },
  });

  console.log("[Settings] Profile updated successfully");

  revalidatePath("/settings");
  revalidatePath("/");
  return { name: user.name, email: user.email };
}

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error("User not found");
  return user;
}
