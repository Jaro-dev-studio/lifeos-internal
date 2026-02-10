import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, CreditCard, PiggyBank, DollarSign } from "lucide-react";

export default async function FinancePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const financeMetrics = [
    { name: "Net Worth", value: "$45,230", change: "+5.2%", isPositive: true, icon: DollarSign },
    { name: "Monthly Income", value: "$6,500", change: "+$200", isPositive: true, icon: TrendingUp },
    { name: "Monthly Expenses", value: "$4,200", change: "-12%", isPositive: true, icon: TrendingDown },
    { name: "Savings Rate", value: "35%", change: "+3%", isPositive: true, icon: PiggyBank },
  ];

  const recentTransactions = [
    { name: "Grocery Store", amount: -85.42, category: "Food", date: "Today" },
    { name: "Salary Deposit", amount: 3250.00, category: "Income", date: "Yesterday" },
    { name: "Netflix", amount: -15.99, category: "Entertainment", date: "Feb 8" },
    { name: "Gas Station", amount: -42.50, category: "Transportation", date: "Feb 7" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Finance
        </h1>
        <p className="text-muted-foreground">
          Track your income, expenses, and financial goals.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {financeMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{metric.name}</p>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className={`text-xs mt-1 ${metric.isPositive ? "text-accent" : "text-destructive"}`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest financial activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {transaction.amount > 0 ? (
                      <TrendingUp className="h-5 w-5 text-accent" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.category} | {transaction.date}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${transaction.amount > 0 ? "text-accent" : ""}`}>
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
