"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { Transaction } from "@/lib/types";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const { theme } = useTheme();
  
  const monthlyData = useMemo(() => {
    const months: { [key: string]: number } = {};
    
    transactions.forEach((transaction) => {
      const monthYear = transaction.date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
      months[monthYear] = (months[monthYear] || 0) + transaction.amount;
    });

    return Object.entries(months)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        return (
          new Date(`${aMonth} 20${aYear}`).getTime() -
          new Date(`${bMonth} 20${bYear}`).getTime()
        );
      });
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Add transactions to see your monthly expenses chart
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
          />
          <XAxis 
            dataKey="month" 
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'}
          />
          <YAxis 
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
            contentStyle={{
              backgroundColor: theme === 'dark' ? 'hsl(var(--background))' : 'white',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
            labelStyle={{
              color: theme === 'dark' ? 'white' : 'black',
            }}
          />
          <Bar dataKey="amount" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}