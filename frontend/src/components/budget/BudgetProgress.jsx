import "./BudgetProgress.css";

// progress bar showing how much of the monthly budget has been spent
// turns orange at 80% and red once its over 100%
function BudgetProgress({ spent, limit }) {
  if (!limit || limit <= 0) {
    return (
      <p style={{ color: "var(--color-text-light)" }}>
        No budget set yet. Set one below to track your spending.
      </p>
    );
  }

  const percent = Math.min((spent / limit) * 100, 100);
  const isOver = spent > limit;
  const isWarning = !isOver && spent >= limit * 0.8;

  let barClass = "budget-bar-fill";
  if (isOver) barClass += " over";
  else if (isWarning) barClass += " warning";

  return (
    <div>
      <div className="budget-bar-track">
        <div className={barClass} style={{ width: `${percent}%` }}></div>
      </div>

      <div className="budget-numbers">
        <span>₹{spent} spent</span>
        <span>₹{limit} budget</span>
      </div>

      {isOver && (
        <div className="budget-alert alert-danger">
          🚨 You've exceeded your monthly budget by ₹{(spent - limit).toFixed(2)}!
        </div>
      )}
      {isWarning && (
        <div className="budget-alert alert-warning">
          ⚠️ You've used {percent.toFixed(0)}% of your budget. Careful with spending!
        </div>
      )}
    </div>
  );
}

export default BudgetProgress;
