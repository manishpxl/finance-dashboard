import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import useTransactions from "../hooks/useTransactions";
import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
import TransactionTable from "../components/TransactionTable";
import Chart from "../components/Chart";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Dashboard() {
  const { state, dispatch } = useAppContext();
  const {
    filteredTransactions,
    summary,
    monthlyData,
    categoryBreakdown,
    insights,
  } = useTransactions();

  const lineChartData = useMemo(
    () => ({
      labels: monthlyData.map((item) => item.month),
      datasets: [
        {
          label: "Balance",
          data: monthlyData.map((item) => item.balance),
          borderColor: "#0f766e",
          backgroundColor: "rgba(15,118,110,0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    }),
    [monthlyData]
  );

  const doughnutChartData = useMemo(
    () => ({
      labels: categoryBreakdown.map((item) => item.name),
      datasets: [
        {
          label: "Spending Breakdown",
          data: categoryBreakdown.map((item) => item.value),
          backgroundColor: [
            "#0f766e",
            "#2563eb",
            "#e11d48",
            "#f59e0b",
            "#7c3aed",
            "#14b8a6",
          ],
          borderWidth: 0,
        },
      ],
    }),
    [categoryBreakdown]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = {
      id: state.editingTransaction?.id || Date.now(),
      date: formData.get("date"),
      amount: Number(formData.get("amount")),
      category: formData.get("category"),
      type: formData.get("type"),
      note: formData.get("note"),
    };

    if (state.editingTransaction) {
      dispatch({ type: "UPDATE_TRANSACTION", payload });
    } else {
      dispatch({ type: "ADD_TRANSACTION", payload });
    }

    e.target.reset();
  };

  return (
    <div className="dashboard">
      <Navbar />

      <section className="summary-grid">
        <SummaryCard title="Total Balance" value={formatCurrency(summary.balance)} />
        <SummaryCard title="Income" value={formatCurrency(summary.income)} tone="success" />
        <SummaryCard title="Expenses" value={formatCurrency(summary.expenses)} tone="danger" />
      </section>

      <section className="charts-grid">
        <Chart type="line" data={lineChartData} title="Balance Trend" />
        <Chart type="doughnut" data={doughnutChartData} title="Spending Breakdown" />
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Transactions</h2>
            <p>Search, filter, and sort financial activity.</p>
          </div>
        </div>
        <FilterBar />
        <TransactionTable transactions={filteredTransactions} />
      </section>

      <section className="insights-grid">
        <div className="panel">
          <h2>Insights</h2>
          <div className="insight-list">
            <div className="insight-card">
              <span>Highest spending category</span>
              <strong>{insights.highestSpendingCategory}</strong>
              <p>{formatCurrency(insights.highestSpendingAmount)}</p>
            </div>
            <div className="insight-card">
              <span>Monthly comparison</span>
              <strong>{formatCurrency(Math.abs(insights.monthlyComparison))}</strong>
              <p>{insights.observation}</p>
            </div>
          </div>
        </div>

        <div className="panel">
          <h2>Role Based Actions</h2>
          {state.role === "viewer" ? (
            <div className="empty-state compact">
              <h3>Viewer mode</h3>
              <p>You can view metrics and transactions, but cannot modify them.</p>
            </div>
          ) : (
            <form className="transaction-form" onSubmit={handleSubmit}>
              <input
                type="date"
                name="date"
                defaultValue={state.editingTransaction?.date || ""}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                defaultValue={state.editingTransaction?.amount || ""}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                defaultValue={state.editingTransaction?.category || ""}
                required
              />
              <select
                name="type"
                defaultValue={state.editingTransaction?.type || "expense"}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="text"
                name="note"
                placeholder="Note"
                defaultValue={state.editingTransaction?.note || ""}
                required
              />
              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {state.editingTransaction ? "Update Transaction" : "Add Transaction"}
                </button>
                {state.editingTransaction && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={() =>
                      dispatch({ type: "CLEAR_EDITING_TRANSACTION" })
                    }
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}