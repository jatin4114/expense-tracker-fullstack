import { useEffect, useMemo, useState } from "react";
import {
  getBudget,
  updateBudget,
  getCategoryBudgets,
  setCategoryBudget,
  deleteCategoryBudget,
} from "../api/budget";
import { getExpenses } from "../api/expenses";
import BudgetProgress from "../components/budget/BudgetProgress";
import BudgetForm from "../components/budget/BudgetForm";
import CategoryBudgetList from "../components/budget/CategoryBudgetList";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import { useToast } from "../context/ToastContext";
import "./Budget.css";

function Budget() {
  const { showToast } = useToast();
  const [budget, setBudget] = useState(null);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    setError(null);
    Promise.all([getBudget(), getExpenses(), getCategoryBudgets()])
      .then(([budgetRes, expensesRes, categoryBudgetsRes]) => {
        setBudget(budgetRes);
        setExpenses(expensesRes);
        setCategoryBudgets(categoryBudgetsRes);
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

  async function handleSetCategoryBudget(category, limit) {
    await setCategoryBudget(category, limit);
    const refreshed = await getCategoryBudgets();
    setCategoryBudgets(refreshed);
    showToast(`${category} budget set`, "success");
  }

  async function handleDeleteCategoryBudget(category) {
    await deleteCategoryBudget(category);
    setCategoryBudgets((prev) => prev.filter((b) => b.category !== category));
    showToast(`${category} budget removed`, "info");
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

      <div className="card">
        <h2 className="section-title">Category Budgets</h2>
        <CategoryBudgetList
          categoryBudgets={categoryBudgets}
          onSet={handleSetCategoryBudget}
          onDelete={handleDeleteCategoryBudget}
        />
      </div>
    </div>
  );
}

export default Budget;
