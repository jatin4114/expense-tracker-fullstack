import { CATEGORY_COLORS } from "../../utils/categories";
import EmptyState from "../common/EmptyState";
import "./ExpenseList.css";

// list of expenses, with an edit button on each row
function ExpenseList({ expenses, onEdit }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="No expenses found"
        message="Try adding one using the button above."
      />
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((exp) => (
        <div key={exp.id} className="expense-row">
          <span
            className="expense-cat-badge"
            style={{
              background: (CATEGORY_COLORS[exp.category] || "#999") + "22",
              color: CATEGORY_COLORS[exp.category] || "#999",
            }}
          >
            {exp.category}
          </span>
          <div className="expense-row-main">
            <p className="expense-row-title">{exp.title}</p>
            {exp.description && <p className="expense-row-desc">{exp.description}</p>}
          </div>
          <p className="expense-row-date">{exp.date}</p>
          <p className="expense-row-method">{exp.payment_method}</p>
          <p className="expense-row-amount">₹{exp.amount}</p>
          <div className="expense-row-actions">
            <button className="icon-btn" title="Edit" onClick={() => onEdit(exp)}>
              ✏️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;
