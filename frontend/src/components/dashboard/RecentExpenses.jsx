import { CATEGORY_COLORS } from "../../utils/categories";
import EmptyState from "../common/EmptyState";
import "./RecentExpenses.css";

// shows the last few expenses on the dashboard (not the full list)
function RecentExpenses({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="No expenses yet"
        message="Add your first expense to see it here."
      />
    );
  }

  // just take the 5 most recent ones
  const recent = expenses.slice(0, 5);

  return (
    <div className="recent-list">
      {recent.map((exp) => (
        <div key={exp.id} className="recent-item">
          <div
            className="recent-dot"
            style={{ background: CATEGORY_COLORS[exp.category] || "#999" }}
          ></div>
          <div className="recent-info">
            <p className="recent-title">{exp.title}</p>
            <p className="recent-meta">
              {exp.category} • {exp.date}
            </p>
          </div>
          <p className="recent-amount">₹{exp.amount}</p>
        </div>
      ))}
    </div>
  );
}

export default RecentExpenses;
