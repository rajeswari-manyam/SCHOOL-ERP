import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pencil, Trash2, Users, Wallet,
  BarChart3, Download, Plus, GraduationCap,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { concessionsData } from "../data/fee.data";
import type {  ConcessionCardProps } from "../types/fees.types";
import { StatCard } from "../../../../components/ui/statcard";
import {
  getAvatarBgColor,
  typeBadgeClass,
  statusBadgeClass,
  statusDotClass,
} from "../utils/fee.utils";
import {
  CONCESSIONS_PAGE_SIZE,
  CONCESSION_TABLE_COLS,
  CONCESSION_TABLE_HEADERS,
} from "../constants/fee.constants";



const ConcessionCard = ({ row, onEdit, onDelete }: ConcessionCardProps) => (
  <>
    {/* ── DESKTOP ROW ── */}
    <div className={`hidden md:grid ${CONCESSION_TABLE_COLS} items-center px-5 py-3.5 border-b border-slate-100 hover:bg-blue-50/40 transition-colors group`}>
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-full ${getAvatarBgColor(row.studentName)} text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}>
          {row.studentInitials}
        </div>
        <span className="font-medium text-slate-800 text-sm truncate">{row.studentName}</span>
      </div>
      <div className="text-sm text-slate-500 font-medium">{row.class}</div>
      <div>
        <span className={typeBadgeClass(row.typeColor)}>{row.type}</span>
      </div>
      <div className="text-sm">
        <span className="font-semibold text-slate-800">{row.amount}</span>
        {row.amountUnit && <span className="text-slate-400 ml-1 text-xs">{row.amountUnit}</span>}
      </div>
      <div className="text-sm text-slate-500 truncate pr-2">{row.reason}</div>
      <div className="text-sm text-slate-500 truncate">{row.approvedBy}</div>
      <div>
        <span className={statusBadgeClass(row.status)}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass(row.status)}`} />
          {row.status}
        </span>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1 rounded hover:bg-blue-100 transition-colors" title="Edit">
          <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors" />
        </button>
        <button onClick={onDelete} className="p-1 rounded hover:bg-red-100 transition-colors" title="Delete">
          <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>

    {/* ── MOBILE CARD ── */}
    <div className="md:hidden bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full ${getAvatarBgColor(row.studentName)} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
            {row.studentInitials}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">{row.studentName}</p>
            <p className="text-xs text-slate-400">Class {row.class}</p>
          </div>
        </div>
        <span className={statusBadgeClass(row.status)}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDotClass(row.status)}`} />
          {row.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-slate-400 mb-0.5">Type</p>
          <span className={typeBadgeClass(row.typeColor)}>{row.type}</span>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-slate-400 mb-0.5">Amount</p>
          <p className="font-semibold text-slate-800">
            {row.amount}
            {row.amountUnit && <span className="text-slate-400 ml-1 font-normal">{row.amountUnit}</span>}
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-slate-400 mb-0.5">Reason</p>
          <p className="text-slate-600 font-medium">{row.reason}</p>
        </div>
        <div className="bg-slate-50 rounded-lg px-3 py-2">
          <p className="text-slate-400 mb-0.5">Approved By</p>
          <p className="text-slate-600 font-medium">{row.approvedBy}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-1 border-t border-slate-100">
        <button onClick={onEdit} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
          <Pencil className="w-3 h-3" /> Edit
        </button>
        <button onClick={onDelete} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  </>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
      <GraduationCap className="w-7 h-7 text-blue-400" />
    </div>
    <p className="text-slate-700 font-semibold text-sm mb-1">No concessions found</p>
    <p className="text-slate-400 text-xs">Add a concession to get started.</p>
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────

export function Concessions({ onAddConcession }: { onAddConcession: () => void }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(concessionsData.length / CONCESSIONS_PAGE_SIZE);

  const pagedData = concessionsData.slice(
    (page - 1) * CONCESSIONS_PAGE_SIZE,
    page * CONCESSIONS_PAGE_SIZE
  );

  return (
    <div className="space-y-5 pb-8">
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
      <div className="px-5 flex items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{concessionsData.length}</span> concessions
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-slate-600 border-slate-200">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button
            onClick={onAddConcession}
            size="sm"
            className="bg-[#3525CD] hover:bg-[#2d1fb5] text-white gap-1.5 shadow-sm shadow-blue-200"
          >
            <Plus className="w-3.5 h-3.5" /> Add Concession
          </Button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="px-5">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">

          {/* Desktop Header */}
          <div className={`hidden md:grid ${CONCESSION_TABLE_COLS} px-5 py-3 bg-slate-50 border-b border-slate-200`}>
            {CONCESSION_TABLE_HEADERS.map((col) => (
              <div key={col} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          {pagedData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="px-4 md:px-0 space-y-3 md:space-y-0 py-4 md:py-0">
              {pagedData.map((row) => (
                <ConcessionCard key={row.studentName} row={row} />
              ))}
            </div>
          )}

          {/* Desktop Footer */}
          {pagedData.length > 0 && (
            <div className="hidden md:flex px-5 py-2.5 bg-slate-50 border-t border-slate-100 items-center justify-between">
              <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
              <span className="text-xs text-slate-400">
                {(page - 1) * CONCESSIONS_PAGE_SIZE + 1}–
                {Math.min(page * CONCESSIONS_PAGE_SIZE, concessionsData.length)} of {concessionsData.length} entries
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── PAGINATION ── */}
      {concessionsData.length > CONCESSIONS_PAGE_SIZE && (
        <Pagination
          page={page}
          total={concessionsData.length}
          pageSize={CONCESSIONS_PAGE_SIZE}
          onChange={setPage}
          itemLabel="concessions"
          showPageNumbers={true}
        />
      )}
    </div>
  );
}