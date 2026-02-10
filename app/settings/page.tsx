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
import { User, Bell, Shield, Palette, Database, Key } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your account details",
      icon: User,
      fields: [
        { label: "Name", value: session.user.name || "", type: "text" },
        { label: "Email", value: session.user.email || "", type: "email", disabled: true },
      ],
    },
    {
      title: "Notifications",
      description: "Configure how you receive updates",
      icon: Bell,
      fields: [],
    },
    {
      title: "Privacy & Security",
      description: "Manage your security settings",
      icon: Shield,
      fields: [],
    },
    {
      title: "Appearance",
      description: "Customize the look and feel",
      icon: Palette,
      fields: [],
    },
    {
      title: "Data & Export",
      description: "Export your data or delete your account",
      icon: Database,
      fields: [],
    },
    {
      title: "API Keys",
      description: "Manage your API keys for integrations",
      icon: Key,
      fields: [],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <section.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {section.fields.length > 0 ? (
                <div className="space-y-4">
                  {section.fields.map((field, fieldIndex) => (
                    <div key={fieldIndex} className="grid gap-2">
                      <label className="text-sm font-medium">{field.label}</label>
                      <Input
                        type={field.type}
                        defaultValue={field.value}
                        disabled={field.disabled}
                      />
                    </div>
                  ))}
                  <Button>Save Changes</Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Settings coming soon. Connect your database to enable this feature.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
