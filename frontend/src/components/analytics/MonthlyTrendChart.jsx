import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// line chart showing spending trend month over month
function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return <p style={{ color: "var(--color-text-light)" }}>No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip formatter={(value) => `₹${value}`} />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default MonthlyTrendChart;
