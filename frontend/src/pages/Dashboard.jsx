import { useMemo } from "react";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import SpendingChart from "../components/dashboard/SpendingChart";
import { sampleExpenses, sampleBudget } from "../utils/sampleData";
import "./Dashboard.css";

function Dashboard() {
  // TODO phase 3/4: replace sample data with a real api call
  const expenses = sampleExpenses;
  const budget = sampleBudget;

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
