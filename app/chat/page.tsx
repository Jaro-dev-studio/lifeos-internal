import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MessageSquare, Send, Mic, Sparkles } from "lucide-react";

export default async function ChatPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const suggestedPrompts = [
    "How much did I spend on food this month?",
    "What's my average sleep this week?",
    "Show me my health trends",
    "Create a daily check-in workflow",
  ];

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          AI Chat
        </h1>
        <p className="text-muted-foreground">
          Chat with your data using natural language.
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-6">
          {/* Empty state */}
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Start a conversation
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Ask questions about your metrics, get insights, or run workflows.
              The AI can access your data and execute tools on your behalf.
            </p>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
              {suggestedPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto py-3 px-4 text-left justify-start"
                >
                  <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                  <span className="text-sm">{prompt}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Ask anything about your data..."
                className="pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground mt-4">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
