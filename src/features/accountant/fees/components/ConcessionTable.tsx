import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import { Virtuoso } from "react-virtuoso";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Users,
  Wallet,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { concessionsData } from "../data/fee.data";
import type { Concession } from "../types/fees.types";
import { StatCard } from "../../../../components/ui/statcard";
// ── CONFIG ─────────────────────────────────────────────
const PAGE_SIZE = 6;

// ── HELPERS ────────────────────────────────────────────
const typeBadgeClass = (typeColor: string) =>
  `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${typeColor}`;

const statusBadge = (status: string) =>
  status === "ACTIVE"
    ? "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700"
    : "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700";

// ── SHARED ROW (USED BY BOTH MOBILE + DESKTOP) ─────────
const ConcessionRow = ({
  row,
  mode,
  onEdit,
  onDelete,
}: {
  row: Concession;
  mode: "mobile" | "desktop";
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  return (
    <div
      className={
        mode === "mobile"
          ? "bg-white border border-slate-200 rounded-xl p-4 space-y-3"
          : "grid grid-cols-[2fr_0.7fr_1.3fr_1fr_1.5fr_1.2fr_1fr_0.7fr] items-center px-4 py-3.5 border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
      }
    >
      {/* Student */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
          {row.studentInitials}
        </div>
        <span className="font-medium text-slate-800 text-sm">
          {row.studentName}
        </span>
      </div>

      {/* Class */}
      <div className="text-sm text-slate-600">{row.class}</div>

      {/* Type */}
      <div>
        <span className={typeBadgeClass(row.typeColor)}>{row.type}</span>
      </div>

      {/* Amount */}
      <div className="text-sm">
        <span className="font-semibold text-slate-800">{row.amount}</span>
        {row.amountUnit && (
          <span className="text-slate-400 ml-1 text-xs">
            {row.amountUnit}
          </span>
        )}
      </div>

      {/* Reason */}
      <div className="text-sm text-slate-600">{row.reason}</div>

      {/* Approved By */}
      <div className="text-sm text-slate-600">{row.approvedBy}</div>

      {/* Status */}
      <div>
        <span className={statusBadge(row.status)}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {row.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={onEdit}>
          <Pencil className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600" />
        </button>
        <button onClick={onDelete}>
          <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────
export function Concessions({
  onAddConcession,
}: {
  onAddConcession: () => void;
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(concessionsData.length / PAGE_SIZE);

  const pagedData = concessionsData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // ── TABLE COLUMNS (optional if you still use it elsewhere)
  const columns = useMemo<ColumnDef<Concession>[]>(
    () => [
      {
        header: "Student",
        accessorKey: "studentName",
      },
      {
        header: "Class",
        accessorKey: "class",
      },
    ],
    []
  );

  const table = useReactTable({
    data: pagedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="space-y-4 pb-6">

     {/* ── STATS ── */}
<div className="mx-5 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

  <StatCard
    label="Total Concessions"
    value="12"
    suffixLabel="students"
    icon={<Users className="w-4 h-4 text-blue-600" />}
  />

  <StatCard
    label="Monthly Amount"
    value="₹8,500"
    icon={<Wallet className="w-4 h-4 text-orange-500" />}
  />

  <StatCard
    label="Annual Concession"
    value="₹1,02,000"
    icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
  />

</div>
      {/* ── ACTIONS ── */}
      <div className="px-5 flex justify-end gap-2">
        <Button variant="outline">Export Report</Button>
        <Button onClick={onAddConcession} className="bg-[#3525CD] text-white">
          + Add Concession
        </Button>
      </div>

{/* ── DESKTOP TABLE ── */}
<div className="hidden md:block px-5">
  <div className="rounded-xl overflow-hidden bg-white">

    {/* TABLE HEADER */}
    <div className="grid grid-cols-[2fr_0.7fr_1.3fr_1fr_1.5fr_1.2fr_1fr_0.7fr] text-xs font-semibold uppercase bg-slate-50 px-4 py-3 text-slate-500">
      <div>Student</div>
      <div>Class</div>
      <div>Type</div>
      <div>Amount</div>
      <div>Reason</div>
      <div>Approved By</div>
      <div>Status</div>
      <div>Actions</div>
    </div>

    {/* TABLE BODY */}
    <Virtuoso
      style={{ height: pagedData.length * 64 }}
      totalCount={pagedData.length}
      itemContent={(index) => (
        <ConcessionRow
          row={pagedData[index]}
          mode="desktop"
        />
      )}
    />

  </div>
</div>
      {/* ── MOBILE ── */}
      <div className="px-4 space-y-3 md:hidden">
        {pagedData.map((row) => (
          <ConcessionRow
            key={row.studentName}
            row={row}
            mode="mobile"
          />
        ))}
      </div>

     <Pagination
  page={page}
  total={concessionsData.length}
  pageSize={PAGE_SIZE}
  onChange={setPage}
  itemLabel="concessions"
  showPageNumbers={true}
/>
    

    </div>
  );
}