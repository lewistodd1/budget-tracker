import React from "react";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const COLORS = ["#818CF8", "#F87171", "#34D399", "#FBBF24", "#A78BFA", "#60A5FA", "#F472B6"];

export default function ChartView({ expenses }) {
  if (!expenses.length) {
    return (
      <p style={{ color: "#94a3b8", fontSize: "0.9rem", textAlign: "center" }}>
        No data yet — add some expenses to see charts.
      </p>
    );
  }

  // --- Pie chart data: spending by category ---
  const categories = {};
  expenses.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + e.amount;
  });
  const pieData = Object.entries(categories).map(([name, value]) => ({ name, value }));

  // --- Line chart data: total spent per day ---
    // --- Line chart data: total spent per day (properly grouped) ---
    const dailyTotalsMap = new Map();

    expenses.forEach(exp => {
    // Use ISO date (YYYY-MM-DD) for consistent sorting
    const dateKey = new Date(exp.date).toISOString().split("T")[0];
        dailyTotalsMap.set(dateKey, (dailyTotalsMap.get(dateKey) || 0) + exp.amount);
        });

    const lineData = Array.from(dailyTotalsMap.entries())
        .map(([date, total]) => ({
            date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
            total
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));


  return (
    <div style={{ display: "grid", gap: "2rem" }}>
      {/* Pie Chart */}
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        padding: "1rem"
      }}>
        <h3 style={{ color: "#e2e8f0", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Spending by Category
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        padding: "1rem"
      }}>
        <h3 style={{ color: "#e2e8f0", fontSize: "0.9rem", marginBottom: "1rem" }}>
          Spending Over Time
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData}>
            <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#818CF8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
