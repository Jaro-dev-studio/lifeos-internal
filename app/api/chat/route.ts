import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOpenAIClient } from "@/lib/ai/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("[Chat API] Received chat request...");

  const { message, conversationId } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }

  console.log("[Chat API] Fetching or creating conversation...");

  // Get or create conversation
  let convId = conversationId;
  if (!convId) {
    const conversation = await prisma.chatConversation.create({
      data: {
        userId: session.user.id,
        title: message.substring(0, 50),
      },
    });
    convId = conversation.id;
  } else {
    // Verify ownership
    const existing = await prisma.chatConversation.findFirst({
      where: { id: convId, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }
  }

  console.log("[Chat API] Saving user message...");

  // Save user message
  await prisma.chatMessage.create({
    data: {
      conversationId: convId,
      role: "USER",
      content: message,
    },
  });

  console.log("[Chat API] Fetching conversation history...");

  // Get conversation history for context
  const history = await prisma.chatMessage.findMany({
    where: { conversationId: convId },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  console.log("[Chat API] Fetching user metrics for context...");

  // Get user's metrics for context
  const userMetrics = await prisma.metric.findMany({
    where: { userId: session.user.id, isArchived: false },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  const metricsContext = userMetrics
    .map((m) => {
      const latestValue =
        m.entries.length > 0 ? `${m.entries[0].value} ${m.unit || ""}` : "No data";
      return `- ${m.name} (${m.type}): ${latestValue}`;
    })
    .join("\n");

  console.log("[Chat API] Calling OpenAI API...");

  // Build messages for OpenAI
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [
      {
        role: "system",
        content: `You are LifeOS AI, a personal life assistant. You help users track and understand their life metrics, health data, finances, and workflows.

The user has the following metrics:
${metricsContext || "No metrics configured yet."}

Be helpful, concise, and actionable. When discussing metrics, reference their actual data. Suggest insights and patterns when possible.`,
      },
      ...history.map((msg) => ({
        role: (msg.role === "USER"
          ? "user"
          : msg.role === "ASSISTANT"
            ? "assistant"
            : "system") as "system" | "user" | "assistant",
        content: msg.content,
      })),
    ];

  try {
    // Check if OpenAI API key is configured
    const openai = getOpenAIClient();
    if (!openai) {
      console.log("[Chat API] No OpenAI API key configured, returning mock response");

      const mockResponse = `I'm your LifeOS AI assistant. I can help you with your metrics, health data, finances, and workflows.

However, the OpenAI API key is not configured yet. To enable AI responses, add your \`OPENAI_API_KEY\` to the environment variables.

In the meantime, here's what I can see about your data:
${metricsContext || "You haven't set up any metrics yet. Head to the Metrics page to create some!"}`;

      await prisma.chatMessage.create({
        data: {
          conversationId: convId,
          role: "ASSISTANT",
          content: mockResponse,
        },
      });

      return NextResponse.json({
        conversationId: convId,
        message: mockResponse,
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content || "I could not generate a response.";

    console.log("[Chat API] Saving assistant response...");

    // Save assistant response
    await prisma.chatMessage.create({
      data: {
        conversationId: convId,
        role: "ASSISTANT",
        content: assistantMessage,
      },
    });

    // Update conversation title if it was the first message
    if (history.length <= 1) {
      await prisma.chatConversation.update({
        where: { id: convId },
        data: {
          title: message.substring(0, 50),
        },
      });
    }

    console.log("[Chat API] Response sent successfully");

    return NextResponse.json({
      conversationId: convId,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("[Chat API] Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to process chat";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
