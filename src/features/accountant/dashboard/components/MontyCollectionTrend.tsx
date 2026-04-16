import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {

    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,

    ResponsiveContainer,
    Line,
    ComposedChart,
} from "recharts";

const data = [
    { month: "NOV", actual: 180000, target: 352000 },
    { month: "DEC", actual: 210000, target: 352000 },
    { month: "JAN", actual: 240000, target: 352000 },
    { month: "FEB", actual: 195000, target: 352000 },
    { month: "MAR", actual: 320000, target: 352000 },
    { month: "APR", actual: 352000, target: 352000 },
];

const formatY = (val: number) =>
    val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${val / 1000}k`;

export const MonthlyCollectionTrend = () => {
    return (
        <Card className="border border-slate-200 shadow-none rounded-xl hover:border-[#3525CD] hover:border-1">
            <CardHeader className="px-5 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-sm font-semibold text-slate-800">
                        Monthly Collection Trend
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Financial performance over last 6 months
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" />
                        Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-4 border-t-2 border-dashed border-slate-400 inline-block bg-[#F87171]" />
                        Target (3.52L)
                    </span>
                </div>
            </CardHeader>
            <CardContent className="px-5 py-4">
                <ResponsiveContainer width="100%" height={200}>
                    <ComposedChart data={data} barSize={32}>
                        <CartesianGrid vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={formatY}
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            axisLine={false}
                            tickLine={false}
                            width={48}
                        />
                        <Tooltip
                            formatter={(val: number) => [`₹${val.toLocaleString("en-IN")}`, ""]}
                            contentStyle={{
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                fontSize: 12,
                            }}
                        />
                        <Bar dataKey="actual" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#F87171"
                            strokeWidth={1.5}
                            strokeDasharray="5 4"
                            dot={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};