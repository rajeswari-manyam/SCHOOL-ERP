import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const TREND_DATA = [
  { month: "Nov", value: 88 },
  { month: "Dec", value: 91 },
  { month: "Jan", value: 95 },
  { month: "Feb", value: 89 },
  { month: "Mar", value: 93 },
  { month: "Apr", value: 92 },
];

const CustomDot = ({ cx, cy }: any) => (
  <circle cx={cx} cy={cy} r={4} fill="#3525CD" stroke="white" strokeWidth={2} />
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-background px-3 py-1.5 text-sm shadow-sm">
      <span className="font-medium">{label}</span>
      <span className="ml-2 text-[#3525CD]">{payload[0].value}</span>
    </div>
  );
};

const TrendChart = () => (
  <ResponsiveContainer width="100%" height={140}>
    <LineChart data={TREND_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
      <CartesianGrid vertical={false} stroke="#E8EBF2" />
      <XAxis
        dataKey="month"
        tick={{ fontSize: 10, fill: "#6B7280" }}
        axisLine={false}
        tickLine={false}
      />
      <YAxis
        domain={[84, 98]}
        tick={{ fontSize: 10, fill: "#6B7280" }}
        axisLine={false}
        tickLine={false}
        tickCount={3}
      />
      <Tooltip content={<CustomTooltip />} />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#3525CD"
        strokeWidth={2}
        dot={<CustomDot />}
        activeDot={{ r: 5, fill: "#3525CD", stroke: "white", strokeWidth: 2 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default TrendChart;