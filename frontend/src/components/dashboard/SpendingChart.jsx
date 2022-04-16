import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CATEGORY_COLORS } from "../../utils/categories";

// small bar chart showing spending grouped by category
// takes raw expenses array and groups them itself (keeps it simple)
function SpendingChart({ expenses }) {
  // build data like [{ category: "Food", total: 570 }, ...]
  const totals = {};
  for (const exp of expenses) {
    totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
  }
  const chartData = Object.keys(totals).map((cat) => ({
    category: cat,
    total: totals[cat],
  }));

  if (chartData.length === 0) {
    return <p style={{ color: "var(--color-text-light)" }}>No data to show yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="category" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip formatter={(value) => `₹${value}`} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={CATEGORY_COLORS[entry.category] || "#999"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default SpendingChart;
