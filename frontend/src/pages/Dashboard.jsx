import { useEffect, useMemo, useState } from "react";
import { getExpenses } from "../api/expenses";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import SpendingChart from "../components/dashboard/SpendingChart";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { sampleBudget } from "../utils/sampleData";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO phase 8: replace sampleBudget with the real budget from the api
  const budget = sampleBudget;

  useEffect(() => {
    loadExpenses();
  }, []);

  function loadExpenses() {
    setLoading(true);
    setError(null);
    getExpenses()
      .then((data) => setExpenses(data))
      .catch((err) => {
        console.error(err);
        setError("Could not load your expenses. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }

  // figuring out this month's expenses vs everything
  const thisMonthExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter((exp) => {
      const d = new Date(exp.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    });
  }, [expenses]);

  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthSpending = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = budget.monthly_limit - monthSpending;

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadExpenses} />;
  }

  return (
    <div>
      <div className="summary-grid">
        <SummaryCard
          label="Total Spending"
          value={`₹${totalSpending}`}
          icon="💰"
        />
        <SummaryCard
          label="This Month"
          value={`₹${monthSpending}`}
          icon="📅"
          accent="orange"
        />
        <SummaryCard
          label="Remaining Budget"
          value={`₹${remainingBudget}`}
          icon="🎯"
          accent={remainingBudget < 0 ? "red" : "green"}
        />
        <SummaryCard
          label="Total Expenses"
          value={expenses.length}
          icon="🧾"
        />
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2 className="section-title">Spending Overview</h2>
          <SpendingChart expenses={expenses} />
        </div>

        <div className="card">
          <h2 className="section-title">Recent Expenses</h2>
          <RecentExpenses expenses={expenses} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
