// small list showing which expense titles come up most often
function TopTitlesList({ data }) {
  if (!data || data.length === 0) {
    return <p style={{ color: "var(--color-text-light)" }}>No data yet.</p>;
  }

  return (
    <div>
      {data.map((row, i) => (
        <div
          key={row.title}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < data.length - 1 ? "1px solid var(--color-border)" : "none",
          }}
        >
          <span>{row.title}</span>
          <span style={{ color: "var(--color-text-light)", fontSize: 13 }}>
            {row.count}x
          </span>
        </div>
      ))}
    </div>
  );
}

export default TopTitlesList;
