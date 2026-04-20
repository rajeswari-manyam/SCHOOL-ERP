import { useState } from "react";
import type { Transaction } from "../types/fees.types";
import { formatCurrency, modeStyle } from "../utils/fee.utils";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table"; // adjust path
import { Checkbox } from "@/components/ui/checkbox";
import typography from "@/styles/typography";
type Props = { data: Transaction[] };

export const AllTransactionsTable = ({ data }: Props) => {
    const [selected, setSelected] = useState<string[]>([]);

    const allSelected = data.length > 0 && selected.length === data.length;
    const toggleAll = () => setSelected(allSelected ? [] : data.map((t) => t.id));
    const toggleOne = (id: string) =>
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const cash = data.filter((t) => t.mode === "CASH").reduce((s, t) => s + t.amount, 0);
    const upi = data.filter((t) => t.mode === "UPI").reduce((s, t) => s + t.amount, 0);
    const cheque = data.filter((t) => t.mode === "CHEQUE").reduce((s, t) => s + t.amount, 0);
    const total = data.reduce((s, t) => s + t.amount, 0);

    return (
        <div className="px-5 pb-5">
            {/* ── Summary strip ── */}
            {/* ── Summary strip ── */}
            <div className="flex items-center justify-between mb-3">
                {/* Left: payments + collected */}
                <div className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-[#3525CD] inline-block" />
                    <span className="font-semibold text-slate-700">{data.length} payments</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-bold text-[#3525CD]">{formatCurrency(total)} collected</span>
                </div>

                {/* Right: Cash / UPI / Cheque */}
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Cash: <span className="font-semibold text-slate-700">{formatCurrency(cash)}</span></span>
                    <span>UPI: <span className="font-semibold text-slate-700">{formatCurrency(upi)}</span></span>
                    <span>Cheque: <span className="font-semibold text-slate-700">{formatCurrency(cheque)}</span></span>
                </div>
            </div>
            {/* ── Table ── */}
            {/* ── Mobile View (Cards) ── */}
            <div className="sm:hidden space-y-3">
                {data.map((t) => {
                    const sentToParent = (t as any).sentToParent ?? "WA Sent";

                    return (
                        <div
                            key={t.id}
                            className="border border-slate-200 rounded-xl p-3 shadow-sm bg-white"
                        >
                            {/* Top Row */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-mono text-xs font-semibold text-[#3525CD]">
                                    {t.receiptNo ?? t.id}
                                </span>
                                <span className="font-bold">
                                    {formatCurrency(t.amount)}
                                </span>
                            </div>

                            <div className="font-semibold text-sm">{t.student}</div>
                            <div className="text-xs text-slate-500">
                                {(t as any).class ?? (t as any).studentClass ?? "—"}
                            </div>

                          <div className="mt-2">
  <div className="text-xs text-slate-400">Fee Head</div>
  <div className="text-sm font-medium text-slate-700">
    {t.feeHead ?? "Tuition Apr"}
  </div>
</div>

<div className="flex justify-between mt-2 text-xs text-slate-500">
  <span>{t.date}</span>
</div>

                            <div className="flex justify-between items-center mt-3">
                                <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${modeStyle(
                                        t.mode
                                    )}`}
                                >
                                    {t.mode}
                                </span>

                                {sentToParent === "WA Sent" ? (
                                    <span className="text-green-600 text-xs font-medium">
                                        ✓ WA Sent
                                    </span>
                                ) : (
                                    <button className="text-indigo-500 text-xs">
                                        Send
                                    </button>
                                )}
                            </div>

                            <button className="mt-3 w-full text-xs font-medium text-[#3525CD] border-t pt-2">
                                View / Download
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* ── Desktop Table ── */}
            <div className="hidden sm:block rounded-xl border border-slate-200 overflow-hidden">
                <Table>
                    {/* Header */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 bg-[#E5EEFF]">
                                <Checkbox checked={allSelected} onChange={toggleAll} />
                            </TableHead>

                            {[
                                "Receipt No.",
                                "Date & Time",
                                "Student",
                                "Class",
                                "Fee Head",
                                "Amount",
                                "Mode",
                                "Sent to Parent",
                                "Actions",
                            ].map((h) => (
                                <TableHead key={h}>{h}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    {/* Body */}
                    <TableBody>
                        {data.map((t) => {
                            const isSelected = selected.includes(t.id);
                            const sentToParent = (t as any).sentToParent ?? "WA Sent";

                            return (
                                <TableRow
                                    key={t.id}
                                    className={isSelected ? "bg-indigo-50" : ""}
                                >
                                    {/* Checkbox */}
                                    <TableCell>
                                        <Checkbox
                                            checked={isSelected}
                                            onChange={() => toggleOne(t.id)}
                                        />
                                    </TableCell>

                                    {/* Receipt */}
                                    <TableCell className="font-mono text-xs font-semibold text-[#3525CD]">
                                        {t.receiptNo ?? t.id}
                                    </TableCell>

                                    {/* Date */}
                                    <TableCell className={`${typography.body.xs} text-slate-500`}>
                                        {t.date}
                                    </TableCell>

                                    {/* Student */}
                                    <TableCell className="font-semibold">
                                        {t.student}
                                    </TableCell>

                                    {/* Class */}
                                    <TableCell className={`${typography.body.xs} text-slate-600 font-medium`}>
                                        {(t as any).class ?? (t as any).studentClass ?? "—"}
                                    </TableCell>

                                    {/* Fee Head */}
                                    <TableCell className={`${typography.body.xs} text-slate-500`}>
                                        {t.feeHead ?? "Tuition Apr"}
                                    </TableCell>

                                    {/* Amount */}
                                    <TableCell className="font-bold">
                                        {formatCurrency(t.amount)}
                                    </TableCell>

                                    {/* Mode */}
                                    <TableCell>
                                        <span
                                            className={`${typography.body.xs} font-bold px-2 py-0.5 rounded uppercase ${modeStyle(
                                                t.mode
                                            )}`}
                                        >
                                            {t.mode}
                                        </span>
                                    </TableCell>

                                    {/* Sent */}
                                    <TableCell>
                                        {sentToParent === "WA Sent" ? (
                                            <span className={`text-green-600 ${typography.body.xs} font-medium`}>
                                                ✓ WA Sent
                                            </span>
                                        ) : (
                                            <button className={`text-indigo-500 ${typography.body.xs} hover:underline`}>
                                                Send
                                            </button>
                                        )}
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell>
                                        <button className={`text-[#3525CD] ${typography.body.xs} font-medium hover:underline`}>
                                            View/Download
                                        </button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                {/* Footer */}
                <div className={`px-4 py-2.5 flex justify-between ${typography.body.xs} text-slate-400 border-t border-slate-100 bg-slate-50`}>
                    <span>
                        Showing 1–{data.length} of {data.length} receipts
                    </span>
                    <span className={`font-semibold ${typography.body.xs} text-slate-600`}>
                        {formatCurrency(total)} total
                    </span>
                </div>
            </div>
        </div>
    );
};