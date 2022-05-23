import { useState } from "react";
import { CATEGORIES } from "../../utils/categories";
import BudgetProgress from "./BudgetProgress";
import "./CategoryBudgetList.css";

// lets a user set an optional budget limit per category, on top of
// the one overall monthly budget
function CategoryBudgetList({ categoryBudgets, onSet, onDelete }) {
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const usedCategories = categoryBudgets.map((b) => b.category);
  const availableCategories = CATEGORIES.filter((c) => !usedCategories.includes(c));

  async function handleAdd(e) {
    e.preventDefault();
    if (!newCategory || !newLimit || Number(newLimit) < 0) return;
    setSaving(true);
    try {
      await onSet(newCategory, Number(newLimit));
      setNewCategory("");
      setNewLimit("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {categoryBudgets.length === 0 && (
        <p style={{ color: "var(--color-text-light)", marginTop: 0 }}>
          No category budgets set yet.
        </p>
      )}

      {categoryBudgets.map((b) => (
        <div key={b.category} className="category-budget-row">
          <div className="category-budget-header">
            <span className="category-budget-name">{b.category}</span>
            <button className="icon-btn" title="Remove" onClick={() => onDelete(b.category)}>
              ✕
            </button>
          </div>
          <BudgetProgress spent={b.spent} limit={b.monthly_limit} />
        </div>
      ))}

      {availableCategories.length > 0 && (
        <form onSubmit={handleAdd} className="category-budget-add">
          <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            <option value="">Add a category budget...</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Limit (₹)"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            Add
          </button>
        </form>
      )}
    </div>
  );
}

export default CategoryBudgetList;
