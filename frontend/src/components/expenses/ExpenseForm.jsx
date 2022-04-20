import { useState } from "react";
import { CATEGORIES } from "../../utils/categories";
import { PAYMENT_METHODS } from "../../utils/paymentMethods";
import "../common/Form.css";

// today's date in yyyy-mm-dd, used as default for the date field
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// used for both "add expense" and "edit expense" - if initialData is
// passed in, the form starts filled with that expense's values
function ExpenseForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [amount, setAmount] = useState(initialData?.amount || "");
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [date, setDate] = useState(initialData?.date || todayStr());
  const [description, setDescription] = useState(initialData?.description || "");
  const [paymentMethod, setPaymentMethod] = useState(
    initialData?.payment_method || PAYMENT_METHODS[0]
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [topError, setTopError] = useState("");

  function validate() {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Amount must be more than 0";
    if (!date) newErrors.date = "Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTopError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        amount: Number(amount),
        category,
        date,
        description: description.trim(),
        payment_method: paymentMethod,
      });
    } catch (err) {
      console.error(err);
      setTopError("Could not save the expense. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {topError && <div className="form-top-error">{topError}</div>}

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Lunch with friends"
        />
        {errors.title && <p className="form-error">{errors.title}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Payment Method</label>
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm} value={pm}>
                {pm}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Description (optional)</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any extra notes..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel || "Save Expense"}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;
