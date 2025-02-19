"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaction, Budget, categories } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface BudgetOverviewProps {
  budgets: Budget[];
  transactions: Transaction[];
  onDeleteBudget: (categoryId: string) => void;
}

export function BudgetOverview({
  budgets,
  transactions,
  onDeleteBudget,
}: BudgetOverviewProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlySpending = useMemo(() => {
    return transactions
      .filter((t) => {
        const transactionMonth = t.date.getMonth();
        const transactionYear = t.date.getFullYear();
        return transactionMonth === currentMonth && transactionYear === currentYear;
      })
      .reduce((acc, t) => {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
        return acc;
      }, {} as { [key: string]: number });
  }, [transactions, currentMonth, currentYear]);

  if (budgets.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No budgets set. Add a budget to start tracking your spending limits.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Spent</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const spent = monthlySpending[budget.categoryId] || 0;
            const remaining = budget.amount - spent;
            const progress = Math.min((spent / budget.amount) * 100, 100);
            const isOverBudget = spent > budget.amount;

            return (
              <TableRow key={budget.categoryId}>
                <TableCell>
                  <Badge
                    style={{
                      backgroundColor: category?.color,
                      color: "white",
                    }}
                  >
                    {category?.name}
                  </Badge>
                </TableCell>
                <TableCell>${budget.amount.toFixed(2)}</TableCell>
                <TableCell>${spent.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={isOverBudget ? "text-destructive" : ""}>
                    ${remaining.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="w-[200px]">
                  <Progress
                    value={progress}
                    className={isOverBudget ? "bg-destructive" : ""}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteBudget(budget.categoryId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}