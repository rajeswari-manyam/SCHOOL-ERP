import type { FeeHead, TransportSlab, ClassFeeStructure } from "../types/fees.types";
import type { ConcessionRecord } from "@/services/fee.api";
import { formatCurrency } from "../utils/Fee.utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface FeeStructureTabProps {
  feeHeads: FeeHead[];
  transportSlabs: TransportSlab[];
  classFeeStructure: ClassFeeStructure[];
  concessions?: ConcessionRecord[];
  selectedClass: string;
  onClassChange: (cls: string) => void;
}

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];

const FEE_HEAD_COLORS: Record<string, string> = {
  "Tuition Fee": "bg-indigo-500",
  "Exam Fee": "bg-green-500",
  "Library & Digital": "bg-purple-500",
  default: "bg-gray-400",
};

// ─── Section card shell ───────────────────────────────────────────────────────
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 dark:border-slate-700",
        "bg-white dark:bg-slate-900 p-4 sm:p-5",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-100">
        {title}
      </h3>
      {sub && (
        <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-500">{sub}</p>
      )}
    </div>
  );
}

// ─── Shared table header cell ─────────────────────────────────────────────────
function TH({ children }: { children: React.ReactNode }) {
  return (
    <TableHead className="py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 whitespace-nowrap">
      {children}
    </TableHead>
  );
}

// ─── FeeStructureTab ──────────────────────────────────────────────────────────
export function FeeStructureTab({
  feeHeads,
  transportSlabs,
  classFeeStructure,
  concessions = [],
  selectedClass,
  onClassChange,
}: FeeStructureTabProps) {
  const totalAnnual = classFeeStructure.reduce((s, f) => s + f.annualTotal, 0);

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── Fee Heads + Transport Slabs ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

        {/* Fee Heads */}
        <Card>
          <SectionHead
            title="Fee Heads"
            sub="Define and manage primary fee categories for the academic year."
          />
          <div className="overflow-x-auto -mx-1 px-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TH>Fee Head</TH>
                  <TH>Code</TH>
                  <TH>Mandatory</TH>
                  <TH>Taxable</TH>
                  <TH>GST%</TH>
                  <TH>Status</TH>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeHeads.map((fh) => (
                  <TableRow
                    key={fh.id}
                    className="border-b border-gray-50 dark:border-slate-800"
                  >
                    <TableCell className="py-2.5 font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">
                      {fh.name}
                    </TableCell>
                    <TableCell className="py-2.5 text-xs text-gray-500 dark:text-slate-400">
                      {fh.code}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span
                        aria-label={fh.mandatory ? "Mandatory" : "Not mandatory"}
                        className={[
                          "inline-block h-3 w-3 rounded-full",
                          fh.mandatory ? "bg-indigo-500" : "bg-gray-200 dark:bg-slate-600",
                        ].join(" ")}
                      />
                    </TableCell>
                    <TableCell className="py-2.5 text-gray-600 dark:text-slate-300">
                      {fh.taxable ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="py-2.5 text-gray-600 dark:text-slate-300">
                      {fh.gstPercent}%
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          fh.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400",
                        ].join(" ")}
                      >
                        {fh.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Transport Fee Slabs */}
        <Card>
          <SectionHead
            title="Transport Fee Slabs"
            sub="Tiered pricing based on bus route distance."
          />
          <div className="overflow-x-auto -mx-1 px-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TH>Slab</TH>
                  <TH>Range</TH>
                  <TH>Monthly</TH>
                  <TH>Students</TH>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transportSlabs.map((slab) => (
                  <TableRow
                    key={slab.slab}
                    className="border-b border-gray-50 dark:border-slate-800"
                  >
                    <TableCell className="py-2.5 font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {slab.slab}
                    </TableCell>
                    <TableCell className="py-2.5 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                      {slab.range}
                    </TableCell>
                    <TableCell className="py-2.5 font-semibold text-gray-800 dark:text-slate-100 tabular-nums">
                      {formatCurrency(slab.monthly)}
                    </TableCell>
                    <TableCell className="py-2.5 text-gray-600 dark:text-slate-300 tabular-nums">
                      {slab.students}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button
            variant="link"
            className="mt-3 h-auto p-0 text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
          >
            Update Slabs
          </Button>
        </Card>
      </div>

      {/* ── Class-wise Fee Structure ───────────────────────────────────── */}
      <Card>
        {/* Card header: title + class tabs */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <SectionHead
            title="Class-wise Fee Structure"
            sub="Configure individual amounts for different academic levels."
          />

          {/* Class selector — scrollable on mobile */}
          <div
            role="group"
            aria-label="Select class"
            className="flex gap-1 overflow-x-auto pb-0.5 sm:pb-0 sm:flex-wrap sm:justify-end scrollbar-none"
          >
            {CLASSES.map((cls) => {
              const active = selectedClass === cls;
              return (
                <Button
                  key={cls}
                  type="button"
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => onClassChange(cls)}
                  aria-pressed={active}
                  className={[
                    "shrink-0 text-xs font-semibold px-3 h-8",
                    "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                    active
                      ? "bg-indigo-600 text-white border-transparent"
                      : "border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:border-indigo-300",
                  ].join(" ")}
                >
                  {cls}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Table — horizontally scrollable on small screens */}
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-700">
                {["Fee Head", "Billing Cycle", "Due Date", "Amount (₹)", "Annual Total (₹)", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="py-2 pr-4 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {classFeeStructure.map((row) => (
                <tr
                  key={row.feeHeadId}
                  className="border-b border-gray-50 dark:border-slate-800"
                >
                  {/* Fee head name + color bar */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={[
                          "h-8 w-1 shrink-0 rounded-full",
                          FEE_HEAD_COLORS[row.feeHeadName] ?? FEE_HEAD_COLORS.default,
                        ].join(" ")}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-slate-100 whitespace-nowrap">
                          {row.feeHeadName}
                        </p>
                        {row.subtitle && (
                          <p className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                            {row.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                    {row.billingCycle}
                  </td>
                  <td className="py-3 pr-4 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                    {row.dueDate}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-800 dark:text-slate-100 tabular-nums">
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-800 dark:text-slate-100 tabular-nums">
                    {formatCurrency(row.annualTotal)}
                  </td>
                  <td className="py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Edit ${row.feeHeadName}`}
                      className="h-8 w-8 p-0 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400"
                    >
                      ✏️
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total row */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 dark:border-slate-700 pt-3">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
            Total annual fee{" "}
            <span className="text-gray-400 dark:text-slate-500 font-normal">
              ({selectedClass})
            </span>
          </span>
          <span className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {formatCurrency(totalAnnual)}
          </span>
        </div>
      </Card>

      {/* ── Concessions ───────────────────────────────────────────────── */}
      <Card>
        <SectionHead
          title="Concessions"
          sub="Fee concessions applied to students for the current academic year."
        />
        <div className="overflow-x-auto -mx-1 px-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TH>Student</TH>
                <TH>Fee Head</TH>
                <TH>Type</TH>
                <TH>Discount</TH>
                <TH>Total Amount (₹)</TH>
                <TH>Payable (₹)</TH>
                <TH>Period</TH>
              </TableRow>
            </TableHeader>
            <TableBody>
              {concessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-xs text-gray-400">
                    No concessions found.
                  </TableCell>
                </TableRow>
              ) : (
                concessions.map((c) => {
                  const discountLabel =
                    c.discountType === "PERCENTAGE"
                      ? `${c.discountValue}%`
                      : `₹${(c.discountValue ?? 0).toLocaleString("en-IN")}`;
                  return (
                    <TableRow key={c.id} className="border-b border-gray-50 dark:border-slate-800">
                      <TableCell className="py-2.5 font-medium text-gray-800 dark:text-slate-100 whitespace-nowrap">
                        {c.studentName ?? "—"}
                      </TableCell>
                      <TableCell className="py-2.5 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                        {c.feeHeadName ?? "—"}
                      </TableCell>
                      <TableCell className="py-2.5 text-gray-600 dark:text-slate-300 whitespace-nowrap">
                        {c.discountType ?? "—"}
                      </TableCell>
                      <TableCell className="py-2.5 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {discountLabel}
                          </span>
                          {c.discountAmount != null && (
                            <span className="text-xs font-medium text-red-500">
                              - ₹{c.discountAmount.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2.5 font-semibold text-gray-800 dark:text-slate-100 tabular-nums whitespace-nowrap">
                        {c.totalAmount != null ? `₹${c.totalAmount.toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                      <TableCell className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                        {c.finalAmount != null ? `₹${c.finalAmount.toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                      <TableCell className="py-2.5 text-gray-500 dark:text-slate-400 whitespace-nowrap text-xs">
                        {c.effectiveFrom ?? "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}