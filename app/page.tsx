"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { SummaryCards } from "@/components/SummaryCards";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetOverview } from "@/components/BudgetOverview";
import { SpendingInsights } from "@/components/SpendingInsights";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Transaction, Budget } from "@/lib/types";
import { DollarSign } from "lucide-react";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now().toString() }]);
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const addBudget = (budget: Budget) => {
    setBudgets([...budgets, budget]);
  };

  const deleteBudget = (categoryId: string) => {
    setBudgets(budgets.filter((b) => b.categoryId !== categoryId));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Personal Finance Visualizer</h1>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <SummaryCards transactions={transactions} />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
              <TransactionForm onSubmit={addTransaction} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
              <BudgetForm onSubmit={addBudget} existingBudgets={budgets} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
              <MonthlyExpensesChart transactions={transactions} />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Expenses by Category</h2>
              <CategoryPieChart transactions={transactions} />
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
            <BudgetOverview
              budgets={budgets}
              transactions={transactions}
              onDeleteBudget={deleteBudget}
            />
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
            <SpendingInsights
              transactions={transactions}
              budgets={budgets}
            />
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList
            transactions={transactions}
            onEdit={editTransaction}
            onDelete={deleteTransaction}
          />
        </Card>
      </div>
    </div>
  );
}