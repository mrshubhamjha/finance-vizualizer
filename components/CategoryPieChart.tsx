"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "next-themes";
import { Transaction, categories } from "@/lib/types";

interface CategoryPieChartProps {
  transactions: Transaction[];
}

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const { theme } = useTheme();
  
  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    transactions.forEach((transaction) => {
      categoryTotals[transaction.categoryId] = (categoryTotals[transaction.categoryId] || 0) + transaction.amount;
    });

    return categories.map((category) => ({
      name: category.name,
      value: categoryTotals[category.id] || 0,
      color: category.color,
    })).filter(item => item.value > 0);
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        Add transactions to see category breakdown
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={true}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
          <Legend 
            formatter={(value) => (
              <span style={{ color: theme === 'dark' ? 'white' : 'black' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}