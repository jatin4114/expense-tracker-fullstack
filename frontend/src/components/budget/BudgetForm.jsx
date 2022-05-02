import { useState } from "react";
import "../common/Form.css";
import "./BudgetForm.css";

function BudgetForm({ currentLimit, onSave }) {
  const [value, setValue] = useState(currentLimit || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value || Number(value) < 0) {
      setError("Please enter a valid budget amount (0 or more)");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSave(Number(value));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
        <label>Monthly Budget (₹)</label>
        <input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 8000"
        />
        {error && <p className="form-error">{error}</p>}
      </div>
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? "Saving..." : "Save Budget"}
      </button>
    </form>
  );
}

export default BudgetForm;
