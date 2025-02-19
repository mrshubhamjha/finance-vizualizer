"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Transaction, Budget, categories } from "@/lib/types";
import { TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Monthly spending by category
    const monthlySpending = transactions
      .filter((t) => {
        const transactionMonth = t.date.getMonth();
        const transactionYear = t.date.getFullYear();
        return transactionMonth === currentMonth && transactionYear === currentYear;
      })
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });

    // Categories over budget
    const overBudgetCategories = budgets
      .filter((budget) => {
        const spent = monthlySpending[budget.categoryId] || 0;
        return spent > budget.amount;
      })
      .map((budget) => {
        const category = categories.find((c) => c.id === budget.categoryId);
        const spent = monthlySpending[budget.categoryId] || 0;
        return {
          name: category?.name,
          overspent: spent - budget.amount,
        };
      });

    // Categories close to budget (>80%)
    const nearBudgetCategories = budgets
      .filter((budget) => {
        const spent = monthlySpending[budget.categoryId] || 0;
        const percentage = (spent / budget.amount) * 100;
        return percentage >= 80 && percentage <= 100;
      })
      .map((budget) => {
        const category = categories.find((c) => c.id === budget.categoryId);
        const spent = monthlySpending[budget.categoryId] || 0;
        return {
          name: category?.name,
          remaining: budget.amount - spent,
        };
      });

    // Categories under budget (<50% used)
    const underBudgetCategories = budgets
      .filter((budget) => {
        const spent = monthlySpending[budget.categoryId] || 0;
        const percentage = (spent / budget.amount) * 100;
        return percentage < 50;
      })
      .map((budget) => {
        const category = categories.find((c) => c.id === budget.categoryId);
        return category?.name;
      });

    return {
      overBudget: overBudgetCategories,
      nearBudget: nearBudgetCategories,
      underBudget: underBudgetCategories,
    };
  }, [transactions, budgets]);

  return (
    <div className="space-y-4">
      {insights.overBudget.length > 0 && (
        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive">Over Budget Alert</h4>
              <ul className="mt-1 text-sm text-muted-foreground">
                {insights.overBudget.map((category) => (
                  <li key={category.name}>
                    {category.name}: Over by ${category.overspent.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {insights.nearBudget.length > 0 && (
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-start space-x-3">
            <TrendingDown className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-500">Approaching Budget</h4>
              <ul className="mt-1 text-sm text-muted-foreground">
                {insights.nearBudget.map((category) => (
                  <li key={category.name}>
                    {category.name}: ${category.remaining.toFixed(2)} remaining
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {insights.underBudget.length > 0 && (
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-green-500">Well Under Budget</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Great job! These categories are well under budget: {insights.underBudget.join(", ")}
              </p>
            </div>
          </div>
        </Card>
      )}

      {insights.overBudget.length === 0 &&
        insights.nearBudget.length === 0 &&
        insights.underBudget.length === 0 && (
        <Card className="p-4">
          <p className="text-center text-muted-foreground">
            Set up budgets to see spending insights
          </p>
        </Card>
      )}
    </div>
  );
}