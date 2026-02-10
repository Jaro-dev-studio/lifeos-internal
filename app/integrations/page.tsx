import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plug, Check, AlertCircle, RefreshCw } from "lucide-react";

export default async function IntegrationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const integrations = [
    {
      name: "Plaid",
      description: "Connect your bank accounts for financial tracking",
      category: "Finance",
      status: "disconnected",
      icon: "bank",
    },
    {
      name: "Fitbit",
      description: "Sync health and fitness data",
      category: "Health",
      status: "disconnected",
      icon: "heart",
    },
    {
      name: "Apple Health",
      description: "Import health data from Apple devices",
      category: "Health",
      status: "disconnected",
      icon: "apple",
    },
    {
      name: "Google Calendar",
      description: "Sync events and schedule workflows",
      category: "Productivity",
      status: "disconnected",
      icon: "calendar",
    },
    {
      name: "Notion",
      description: "Connect your Notion workspace",
      category: "Productivity",
      status: "disconnected",
      icon: "file",
    },
    {
      name: "Custom Webhook",
      description: "Set up custom webhook integrations",
      category: "Developer",
      status: "available",
      icon: "webhook",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="accent" className="gap-1">
            <Check className="h-3 w-3" />
            Connected
          </Badge>
        );
      case "error":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Error
          </Badge>
        );
      default:
        return <Badge variant="secondary">Not Connected</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Integrations
        </h1>
        <p className="text-muted-foreground">
          Connect external services to sync your data automatically.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Plug className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold">{integration.name}</h3>
                    {getStatusBadge(integration.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {integration.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{integration.category}</Badge>
                    <Button
                      variant={integration.status === "connected" ? "outline" : "primary"}
                      size="sm"
                    >
                      {integration.status === "connected" ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Sync
                        </>
                      ) : (
                        "Connect"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
