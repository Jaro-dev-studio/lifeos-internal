"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/settings";
import { User, Bell, Shield, Palette, Database, Key } from "lucide-react";

interface SettingsClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: Date;
  };
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [name, setName] = useState(user.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      await updateProfile({ name });
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const settingsSections = [
    {
      title: "Profile",
      description: "Manage your account details",
      icon: User,
      content: (
        <form onSubmit={handleSaveProfile} className="space-y-4">
          {message && (
            <div
              className={`rounded-lg p-3 text-sm ${
                message.includes("success")
                  ? "bg-accent/10 text-accent"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {message}
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user.email} disabled />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      ),
    },
    {
      title: "Notifications",
      description: "Configure how you receive updates",
      icon: Bell,
      content: (
        <p className="text-sm text-muted-foreground">
          Notification preferences coming soon. You will be able to configure
          email notifications, in-app alerts, and webhook notifications.
        </p>
      ),
    },
    {
      title: "Privacy & Security",
      description: "Manage your security settings",
      icon: Shield,
      content: (
        <p className="text-sm text-muted-foreground">
          Security settings coming soon. This will include two-factor
          authentication, session management, and login history.
        </p>
      ),
    },
    {
      title: "Appearance",
      description: "Customize the look and feel",
      icon: Palette,
      content: (
        <p className="text-sm text-muted-foreground">
          Theme customization coming soon. You will be able to switch between
          light and dark modes, and customize accent colors.
        </p>
      ),
    },
    {
      title: "Data & Export",
      description: "Export your data or manage your account",
      icon: Database,
      content: (
        <p className="text-sm text-muted-foreground">
          Data export coming soon. You will be able to export all your metrics,
          workflows, and conversations as JSON or CSV.
        </p>
      ),
    },
    {
      title: "API Keys",
      description: "Manage your API keys for integrations",
      icon: Key,
      content: (
        <p className="text-sm text-muted-foreground">
          API key management coming soon. You will be able to generate API keys
          for external integrations and webhook endpoints.
        </p>
      ),
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
            <CardContent>{section.content}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
