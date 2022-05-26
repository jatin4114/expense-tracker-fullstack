import { useEffect, useState } from "react";
import {
  getSummary,
  getCategoryBreakdown,
  getMonthlyBreakdown,
  getTopTitles,
  getWeekdayBreakdown,
} from "../api/analytics";
import SummaryCard from "../components/dashboard/SummaryCard";
import CategoryPieChart from "../components/analytics/CategoryPieChart";
import MonthlyTrendChart from "../components/analytics/MonthlyTrendChart";
import TopTitlesList from "../components/analytics/TopTitlesList";
import WeekdayBreakdown from "../components/analytics/WeekdayBreakdown";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import "./Analytics.css";

function Analytics() {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topTitles, setTopTitles] = useState([]);
  const [weekdayData, setWeekdayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  function loadAnalytics() {
    setLoading(true);
    setError(null);
    // fire all requests at once instead of one after another
    Promise.all([
      getSummary(),
      getCategoryBreakdown(),
      getMonthlyBreakdown(),
      getTopTitles(),
      getWeekdayBreakdown(),
    ])
      .then(([summaryRes, categoryRes, monthlyRes, topTitlesRes, weekdayRes]) => {
        setSummary(summaryRes);
        setCategoryData(categoryRes);
        setMonthlyData(monthlyRes);
        setTopTitles(topTitlesRes);
        setWeekdayData(weekdayRes);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load analytics. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }

  if (loading) return <LoadingSpinner text="Crunching your numbers..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadAnalytics} />;

  if (summary && summary.total_expenses === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No data to analyze yet"
        message="Add some expenses first, then come back here to see your spending insights."
      />
    );
  }

  return (
    <div>
      <div className="analytics-header no-print">
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨 Print Report
        </button>
      </div>

      <div className="summary-grid">
        <SummaryCard label="Total Spending" value={`₹${summary.total_spending}`} icon="💰" />
        <SummaryCard
          label="Avg Daily Spending"
          value={`₹${summary.average_daily_spending}`}
          icon="📈"
          accent="orange"
        />
        <SummaryCard
          label="Highest Expense"
          value={`₹${summary.highest_expense}`}
          icon="🔥"
          accent="red"
        />
        <SummaryCard label="Total Expenses" value={summary.total_expenses} icon="🧾" />
      </div>

      <div className="analytics-grid">
        <div className="card">
          <h2 className="section-title">Spending by Category</h2>
          <CategoryPieChart data={categoryData} />
        </div>

        <div className="card">
          <h2 className="section-title">Monthly Trend</h2>
          <MonthlyTrendChart data={monthlyData} />
        </div>
      </div>

      <div className="analytics-grid">
        <div className="card">
          <h2 className="section-title">Most Frequent Expenses</h2>
          <TopTitlesList data={topTitles} />
        </div>

        <div className="card">
          <h2 className="section-title">Weekday vs Weekend</h2>
          <WeekdayBreakdown data={weekdayData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
