// simple side-by-side comparison of weekday vs weekend spending
function WeekdayBreakdown({ data }) {
  if (!data) return null;

  const total = data.weekday_total + data.weekend_total;
  const weekdayPercent = total > 0 ? Math.round((data.weekday_total / total) * 100) : 0;
  const weekendPercent = 100 - weekdayPercent;

  return (
    <div>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "var(--color-text-light)" }}>
            Weekdays
          </p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>₹{data.weekday_total}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-light)" }}>
            {weekdayPercent}%
          </p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 4px 0", fontSize: 13, color: "var(--color-text-light)" }}>
            Weekends
          </p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>₹{data.weekend_total}</p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-light)" }}>
            {weekendPercent}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default WeekdayBreakdown;
