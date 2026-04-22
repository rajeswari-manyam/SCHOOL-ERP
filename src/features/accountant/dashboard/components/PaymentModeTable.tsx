import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import type { PaymentModeSummary, PaymentMode } from "../types/dashboard.types";

const modeColors: Record<PaymentMode, { fill: string; dot: string }> = {
  UPI:    { fill: "#6366f1", dot: "bg-indigo-500" },
  CASH:   { fill: "#22c55e", dot: "bg-green-500" },
  CHEQUE: { fill: "#f59e0b", dot: "bg-amber-400" },
  ONLINE: { fill: "#3b82f6", dot: "bg-blue-500" },
};

type PaymentModeRow = PaymentModeSummary & { pct: string };

const columnHelper = createColumnHelper<PaymentModeRow>();

export const PaymentModeTable = ({ data }: { data: PaymentModeSummary[] }) => {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  const rows: PaymentModeRow[] = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        pct: total ? ((item.amount / total) * 100).toFixed(1) : "0",
      })),
    [data, total]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("mode", {
        header: "Mode",
        cell: (info) => {
          const mode = info.getValue();
          const colors = modeColors[mode] ?? { dot: "bg-slate-400" };
          return (
            <span className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`} />
              <span className="text-xs text-slate-600 truncate">{mode}</span>
            </span>
          );
        },
      }),
      columnHelper.accessor("pct", {
        header: "Share",
        cell: (info) => (
          <span className="text-xs text-slate-400 tabular-nums">
            {info.getValue()}%
          </span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <span className="text-xs font-bold text-slate-900 tabular-nums">
            ₹{info.getValue().toLocaleString("en-IN")}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const chartData = data.map((item) => ({
    name: item.mode,
    value: item.amount,
  }));

  return (
   <div className="flex flex-col items-center gap-4 w-full p-4">

   
    <div className="relative w-28 h-28 flex-shrink-0">  
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={55}
              paddingAngle={3}
            >
              {chartData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={modeColors[entry.name]?.fill ?? "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                `₹${Number(value ?? 0).toLocaleString("en-IN")}`
              }
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Total
          </span>
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

  
      <div className="flex-1 w-full min-w-0">
       <table className="w-full table-fixed">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-slate-100">
                {hg.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={`
                      text-[10px] font-semibold uppercase tracking-wide
                      text-slate-400 pb-2
                      ${i === 0 ? "text-left" : "text-right"}
                    `}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-50 last:border-0">
                {row.getVisibleCells().map((cell, i) => (
                  <td
                    key={cell.id}
                    className={`py-2 ${i === 0 ? "text-left" : "text-right"}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};