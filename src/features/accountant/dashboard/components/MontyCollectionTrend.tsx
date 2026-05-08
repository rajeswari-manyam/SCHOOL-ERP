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
import type { MonthlyTrendItem } from "../types/dashboard.types";

const data: MonthlyTrendItem[] = [
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
        <Card className="border border-slate-200 shadow-none rounded-xl hover:border-[#3525CD]">

        
           <CardHeader className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"> 

                <div>
                    <CardTitle className="text-sm font-semibold text-slate-800">
                        Monthly Collection Trend
                    </CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Financial performance over last 6 months
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-indigo-600 inline-block" />
                        Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-4 border-t-2 border-dashed border-slate-400 inline-block" />
                        Target (3.52L)
                    </span>
                </div>
            </CardHeader>

     
            <CardContent className="px-3 sm:px-5 py-3 sm:py-4">
             <div className="w-full h-[220px] sm:h-[260px] md:h-[300px]">   
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={data} barSize={16} margin={{ left: 0, right: 10 }}>  

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
                              width={50}  
                            />
<Tooltip
  contentStyle={{
    borderRadius: "8px",
    fontSize: "12px",
    padding: "8px",
  }}
  formatter={(val: any, name: any) => {
    const value = Number(val ?? 0);
    return [
      `₹${value.toLocaleString("en-IN")}`,
      name === "actual" ? "Actual" : "Target",
    ];
  }}
/>                         <Bar dataKey="actual" fill="#4F46E5" radius={[4, 4, 0, 0]} />

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
                </div>
            </CardContent>
        </Card>
    );
};