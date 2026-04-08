import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#f59e42", "#ef4444", "#a21caf"];

interface DonutChartProps {
  data: Array<{ name: string; value: number }>;
}

export const DonutChart = ({ data }: DonutChartProps) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="font-semibold mb-2">Category Breakdown</h3>
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
