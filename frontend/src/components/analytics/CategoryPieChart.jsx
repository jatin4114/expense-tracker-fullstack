import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CATEGORY_COLORS } from "../../utils/categories";

// pie chart showing how much was spent in each category
function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return <p style={{ color: "var(--color-text-light)" }}>No data yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={(entry) => entry.category}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={CATEGORY_COLORS[entry.category] || "#999"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `₹${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default CategoryPieChart;
