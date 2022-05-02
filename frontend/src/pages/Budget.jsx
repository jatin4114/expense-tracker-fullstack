import { useEffect, useMemo, useState } from "react";
import { getBudget, updateBudget } from "../api/budget";
import { getExpenses } from "../api/expenses";
import BudgetProgress from "../components/budget/BudgetProgress";
import BudgetForm from "../components/budget/BudgetForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./Budget.css";

function Budget() {
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    setError(null);
    Promise.all([getBudget(), getExpenses()])
      .then(([budgetRes, expensesRes]) => {
        setBudget(budgetRes);
        setExpenses(expensesRes);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load budget info. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }

  const monthSpending = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  async function handleSaveBudget(newLimit) {
    const updated = await updateBudget(newLimit);
    setBudget(updated);
  }

  if (loading) return <LoadingSpinner text="Loading budget..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="budget-page">
      <div className="card">
        <h2 className="section-title">This Month's Progress</h2>
        <BudgetProgress spent={monthSpending} limit={budget.monthly_limit} />
      </div>

      <div className="card">
        <h2 className="section-title">Set Monthly Budget</h2>
        <BudgetForm currentLimit={budget.monthly_limit} onSave={handleSaveBudget} />
      </div>
    </div>
  );
}

export default Budget;
