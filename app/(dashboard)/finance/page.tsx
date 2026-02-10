import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PiggyBank,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FinancePage() {
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch finance-category metrics from DB
  const financeMetrics = userId
    ? await prisma.metric.findMany({
        where: { userId, category: "finance", isArchived: false },
        include: {
          entries: {
            orderBy: { date: "desc" },
            take: 2,
          },
        },
      })
    : [];

  const defaultMetrics = [
    {
      name: "Net Worth",
      value: "--",
      change: "",
      isPositive: true,
      icon: DollarSign,
    },
    {
      name: "Monthly Income",
      value: "--",
      change: "",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      name: "Monthly Expenses",
      value: "--",
      change: "",
      isPositive: true,
      icon: TrendingDown,
    },
    {
      name: "Savings Rate",
      value: "--",
      change: "",
      isPositive: true,
      icon: PiggyBank,
    },
  ];

  const displayMetrics = defaultMetrics.map((def) => {
    const dbMetric = financeMetrics.find(
      (m) => m.name.toLowerCase() === def.name.toLowerCase()
    );
    if (dbMetric && dbMetric.entries.length > 0) {
      const latest = dbMetric.entries[0];
      const previous = dbMetric.entries[1];
      const change = previous
        ? ((latest.value - previous.value) / previous.value) * 100
        : 0;
      return {
        ...def,
        value:
          dbMetric.type === "CURRENCY"
            ? `$${latest.value.toLocaleString()}`
            : String(latest.value),
        change: change !== 0 ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%` : "",
      };
    }
    return def;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Finance
          </h1>
          <p className="text-muted-foreground">
            Track your income, expenses, and financial goals.
          </p>
        </div>
        <Link href="/integrations">
          <Button variant="outline">Connect Bank</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {displayMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              {metric.change && (
                <p
                  className={`text-xs mt-1 ${metric.isPositive ? "text-accent" : "text-destructive"}`}
                >
                  {metric.change} from last period
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Tracking</CardTitle>
          <CardDescription>
            Connect your bank or manually track finances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your bank account via Plaid to automatically track
            transactions, or create finance metrics manually from the{" "}
            <Link href="/metrics" className="text-primary hover:underline">
              Metrics
            </Link>{" "}
            page.
          </p>
          <div className="flex gap-2">
            <Link href="/integrations">
              <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Connect Bank
              </Button>
            </Link>
            <Link href="/metrics">
              <Button variant="outline" size="sm">
                <Wallet className="mr-2 h-4 w-4" />
                Add Finance Metric
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
