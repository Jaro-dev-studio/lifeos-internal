"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createConversation(title?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Chat] Creating new conversation...");

  const conversation = await prisma.chatConversation.create({
    data: {
      userId: session.user.id,
      title: title || "New Conversation",
    },
  });

  console.log("[Chat] Conversation created:", conversation.id);

  revalidatePath("/chat");
  return conversation;
}

export async function getConversations() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.chatConversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function getConversation(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const conversation = await prisma.chatConversation.findFirst({
    where: { id, userId: session.user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) throw new Error("Conversation not found");
  return conversation;
}

export async function deleteConversation(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  console.log("[Chat] Deleting conversation:", id);

  const existing = await prisma.chatConversation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Conversation not found");

  await prisma.chatConversation.delete({ where: { id } });

  console.log("[Chat] Conversation deleted successfully");

  revalidatePath("/chat");
}

export async function updateConversationTitle(id: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await prisma.chatConversation.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) throw new Error("Conversation not found");

  await prisma.chatConversation.update({
    where: { id },
    data: { title },
  });

  revalidatePath("/chat");
}
