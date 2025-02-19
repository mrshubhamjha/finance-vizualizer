"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, categories } from "@/lib/types";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const summary = useMemo(() => {
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });

    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];

    const topCategoryName = topCategory
      ? categories.find(c => c.id === topCategory[0])?.name
      : "None";

    const recentTransaction = transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    return {
      total,
      topCategory: topCategoryName,
      topCategoryAmount: topCategory ? topCategory[1] : 0,
      recentAmount: recentTransaction?.amount || 0,
      recentDate: recentTransaction?.date || null,
    };
  }, [transactions]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Expenses
          </p>
          <h3 className="text-2xl font-bold">
            ${summary.total.toFixed(2)}
          </h3>
        </div>
      </Card>

      <Card className="p-6 flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Top Category
          </p>
          <h3 className="text-2xl font-bold">
            {summary.topCategory}
          </h3>
          <p className="text-sm text-muted-foreground">
            ${summary.topCategoryAmount.toFixed(2)}
          </p>
        </div>
      </Card>

      <Card className="p-6 flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10">
          <Clock className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Latest Transaction
          </p>
          <h3 className="text-2xl font-bold">
            ${summary.recentAmount.toFixed(2)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {summary.recentDate?.toLocaleDateString() || "No transactions"}
          </p>
        </div>
      </Card>
    </div>
  );
}