import { useEffect, useMemo, useState } from "react";
import { getExpenses } from "../api/expenses";
import { getBudget } from "../api/budget";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import SpendingChart from "../components/dashboard/SpendingChart";
import BudgetProgress from "../components/budget/BudgetProgress";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./Dashboard.css";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({ monthly_limit: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    setError(null);
    Promise.all([getExpenses(), getBudget()])
      .then(([expensesRes, budgetRes]) => {
        setExpenses(expensesRes);
        setBudget(budgetRes);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your dashboard. Is the backend running?");
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
    return <ErrorMessage message={error} onRetry={loadData} />;
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

      <div className="card" style={{ marginBottom: 16 }}>
        <h2 className="section-title">Budget Progress</h2>
        <BudgetProgress spent={monthSpending} limit={budget.monthly_limit} />
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
