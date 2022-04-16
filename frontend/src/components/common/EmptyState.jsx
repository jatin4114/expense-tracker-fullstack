import "./EmptyState.css";

// shows up when there is no data to display (eg no expenses yet)
function EmptyState({ icon, title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || "📭"}</div>
      <h3>{title || "Nothing here yet"}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
