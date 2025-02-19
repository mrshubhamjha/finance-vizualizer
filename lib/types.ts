export type Category = {
  id: string;
  name: string;
  color: string;
};

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  categoryId: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
}

export const categories: Category[] = [
  { id: "groceries", name: "Groceries", color: "hsl(var(--chart-1))" },
  { id: "utilities", name: "Utilities", color: "hsl(var(--chart-2))" },
  { id: "entertainment", name: "Entertainment", color: "hsl(var(--chart-3))" },
  { id: "transport", name: "Transport", color: "hsl(var(--chart-4))" },
  { id: "other", name: "Other", color: "hsl(var(--chart-5))" },
];
