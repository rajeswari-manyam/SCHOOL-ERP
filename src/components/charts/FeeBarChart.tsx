import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface FeeBarChartProps {
  data: Array<{ month: string; fees: number }>;
}

export const FeeBarChart = ({ data }: FeeBarChartProps) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="font-semibold mb-2">Fee Collection</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="fees" fill="#22c55e" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
