import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "../utils/format";
import typography from "@/styles/typography";
type ModeRow = {
  mode: string;
  dot: string;
  volume: number;
  growth: number;
};

const modeData: ModeRow[] = [
  { mode: "UPI / Online", dot: "bg-indigo-500", volume: 15440000, growth: 12.4 },
  { mode: "Cash",         dot: "bg-green-500",  volume: 6669000,  growth: -4.2 },
  { mode: "Cheque",       dot: "bg-amber-400",  volume: 1287000,  growth: 0.8  },
];

export const PaymentModeBreakdown = () => {
  return (
    <Card className="border border-slate-200 shadow-none rounded-xl hover:border-[#3525CD] hover:border-1">
      <CardHeader className="px-5 py-4 border-b border-slate-100">
        <CardTitle className={typography.body.small}>
          Payment Mode Breakdown — April
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide py-2.5">
                Payment Mode
              </th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide py-2.5">
                Total Volume
              </th>
              <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide py-2.5">
                Growth vs Mar
              </th>
            </tr>
          </thead>
          <tbody>
            {modeData.map((row) => (
              <tr key={row.mode} className="border-b border-slate-50 last:border-0">
                <td className="py-3">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${row.dot}`} />
                    <span className="text-slate-600">{row.mode}</span>
                  </span>
                </td>
                <td className="py-3 text-right font-semibold text-slate-800">
                  {formatCurrency(row.volume)}
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`text-xs font-semibold ${
                      row.growth >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {row.growth >= 0 ? "+" : ""}
                    {row.growth}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};