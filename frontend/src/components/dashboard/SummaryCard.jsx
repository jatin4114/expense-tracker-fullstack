import "./SummaryCard.css";

// generic small card used for the 4 summary boxes at top of dashboard
function SummaryCard({ label, value, icon, accent }) {
  return (
    <div className="summary-card card">
      <div className={"summary-icon " + (accent || "")}>{icon}</div>
      <div>
        <p className="summary-label">{label}</p>
        <p className="summary-value">{value}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
