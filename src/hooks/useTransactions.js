import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

export default function useTransactions() {
  const { state } = useAppContext();
  const { transactions, filters } = state;

  const categories = useMemo(() => {
    return [...new Set(transactions.map((tx) => tx.category))].sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const searched = transactions.filter((tx) => {
      const q = filters.search.toLowerCase().trim();
      if (!q) return true;
      return (
        tx.category.toLowerCase().includes(q) ||
        tx.type.toLowerCase().includes(q) ||
        tx.note.toLowerCase().includes(q) ||
        tx.date.includes(q)
      );
    });

    const typed =
      filters.type === "all"
        ? searched
        : searched.filter((tx) => tx.type === filters.type);

    const categorized =
      filters.category === "all"
        ? typed
        : typed.filter((tx) => tx.category === filters.category);

    const sorted = [...categorized].sort((a, b) => {
      switch (filters.sortBy) {
        case "date-asc":
          return new Date(a.date) - new Date(b.date);
        case "amount-asc":
          return a.amount - b.amount;
        case "amount-desc":
          return b.amount - a.amount;
        case "date-desc":
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return sorted;
  }, [transactions, filters]);

  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = filteredTransactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  }, [filteredTransactions]);

  const monthlyData = useMemo(() => {
    const monthMap = {};

    transactions.forEach((tx) => {
      const month = new Date(tx.date).toLocaleString("en-US", { month: "short" });
      if (!monthMap[month]) {
        monthMap[month] = { income: 0, expenses: 0 };
      }
      if (tx.type === "income") monthMap[month].income += tx.amount;
      else monthMap[month].expenses += tx.amount;
    });

    return Object.entries(monthMap).map(([month, values]) => ({
      month,
      income: values.income,
      expenses: values.expenses,
      balance: values.income - values.expenses,
    }));
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter((tx) => tx.type === "expense")
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredTransactions]);

  const insights = useMemo(() => {
    const highestCategory = categoryBreakdown.sort((a, b) => b.value - a.value)[0];
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];

    const comparison =
      currentMonth && previousMonth
        ? currentMonth.expenses - previousMonth.expenses
        : 0;

    return {
      highestSpendingCategory: highestCategory?.name || "N/A",
      highestSpendingAmount: highestCategory?.value || 0,
      monthlyComparison: comparison,
      observation:
        comparison > 0
          ? "Spending increased compared to the previous month."
          : comparison < 0
          ? "Spending decreased compared to the previous month."
          : "Spending remained stable compared to the previous month.",
    };
  }, [categoryBreakdown, monthlyData]);

  return {
    transactions,
    filteredTransactions,
    categories,
    summary,
    monthlyData,
    categoryBreakdown,
    insights,
  };
}