import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { Transaction } from "../types/dashboard.types";
import typography from "@/styles/typography";
const modeBadge: Record<string, string> = {
  UPI: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Cash: "bg-green-50 text-green-700 border border-green-200",
  Cheque: "bg-amber-50 text-amber-700 border border-amber-200",
};

const statusBadge = (mode: string) =>
  modeBadge[mode] ?? "bg-slate-100 text-slate-600 border border-slate-200";

export const TransactionsTable = ({ data }: { data: Transaction[] }) => {
  return (
    <Table>
      <TableHeader>
    <TableRow className="bg-[#E0E7FF] hover:bg-[#E0E7FF]">
<TableHead className={`${typography.body.xs} font-semibold text-slate-500 uppercase tracking-wide px-5 py-3`}>
  Time
</TableHead>
          <TableHead className={`${typography.body.xs} font-semibold text-slate-400 uppercase tracking-wide`}>Student</TableHead>
          <TableHead className={`${typography.body.xs} font-semibold text-slate-400 uppercase tracking-wide`}>Class</TableHead>
          <TableHead className={`${typography.body.xs} font-semibold text-slate-400 uppercase tracking-wide`}>Fee Head</TableHead>
          <TableHead className={`${typography.body.xs} font-semibold text-slate-400 uppercase tracking-wide`}>Amount</TableHead>
          <TableHead className={`${typography.body.xs} font-semibold text-slate-400 uppercase tracking-wide`}>Mode</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((t) => (
          <TableRow key={t.id} className="border-b border-slate-100 transition-all  ">
<TableCell className={`${typography.body.xs} px-5 py-3 text-slate-800 font-mono`}>{t.time}</TableCell>
     <TableCell className={`${typography.body.small} py-3 font-semibold text-slate-800`}>
  {t.student}
</TableCell>
            <TableCell className={`${typography.body.xs} py-3 text-slate-800`}>{t.className}</TableCell>
            <TableCell className={`${typography.body.xs} py-3 text-slate-800`}>{t.feeHead}</TableCell>
            <TableCell className={`${typography.body.xs} py-3 font-semibold text-slate-900`}>
              {t.amount}
            </TableCell>
            <TableCell className="py-3">
              <span className={`${typography.body.xs} font-semibold px-2.5 py-1 rounded-full ${statusBadge(t.mode)}`}>
                {t.mode}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};