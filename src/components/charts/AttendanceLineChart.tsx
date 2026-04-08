import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface AttendanceLineChartProps {
  data: Array<{ date: string; attendance: number }>;
}

export const AttendanceLineChart = ({ data }: AttendanceLineChartProps) => (
  <div className="bg-white rounded shadow p-4">
    <h3 className="font-semibold mb-2">Attendance Trend</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="#2563eb"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
