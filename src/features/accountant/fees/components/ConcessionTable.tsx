import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil, Trash2, Users, Wallet,
  BarChart3, GraduationCap, Loader2, IndianRupee,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { StatCard } from "../../../../components/ui/statcard";
import { getAvatarBgColor } from "../utils/fee.utils";
import {
  CONCESSIONS_PAGE_SIZE,
  CONCESSION_TABLE_COLS,
  CONCESSION_TABLE_HEADERS,
} from "../constants/fee.constants";
import { getAllConcessions, deleteConcession } from "@/services/fee.api";
import type { ConcessionRecord } from "@/services/fee.api";
import { toast } from "sonner";

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const formatDate = (d?: string) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return d; }
};

const formatDiscount = (row: ConcessionRecord) => {
  if (row.discountType === "PERCENTAGE") return `${row.discountValue ?? 0}%`;
  if (row.discountAmount != null) return `₹${row.discountAmount.toLocaleString()}`;
  if (row.discountValue != null) return `₹${row.discountValue.toLocaleString()}`;
  return "—";
};

// ── Row Component ──────────────────────────────────────────────────────────────

interface CardProps {
  row: ConcessionRecord;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

const ConcessionCard = ({ row, onEdit, onDelete, deleting }: CardProps) => {
  const initials = getInitials(row.studentName ?? "");

  return (
    <>
      {/* Desktop Row */}
      <div className={`hidden md:grid ${CONCESSION_TABLE_COLS} items-center px-5 py-3.5 border-b border-slate-100 hover:bg-blue-50/40 transition-colors group`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-8 h-8 rounded-full ${getAvatarBgColor(row.studentName ?? "")} text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm`}>
            {initials}
          </div>
          <span className="font-medium text-slate-800 text-sm truncate">{row.studentName}</span>
        </div>
        <div className="text-sm text-slate-500 font-medium truncate">{row.feeHeadName}</div>
        <div>
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 whitespace-nowrap">
            {row.concessionType}
          </span>
        </div>
        {/* Discount — percentage + rupee amount stacked */}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-slate-800">{formatDiscount(row)}</span>
          {row.discountAmount != null && (
            <span className="text-xs font-medium text-red-500">
              - ₹{row.discountAmount.toLocaleString("en-IN")}
            </span>
          )}
        </div>
        {/* Total Amount (original fee before discount) */}
        <div className="text-sm font-semibold text-slate-800">
          {row.totalAmount != null ? `₹${row.totalAmount.toLocaleString("en-IN")}` : "—"}
        </div>
        {/* Payable / final amount */}
        <div className="text-sm font-bold text-[#3525CD]">
          {row.finalAmount != null ? `₹${row.finalAmount.toLocaleString("en-IN")}` : "—"}
        </div>
        <div className="text-sm text-slate-500 truncate pr-2">{row.reason}</div>
        <div className="text-xs text-slate-400 whitespace-nowrap">
          {formatDate(row.effectiveFrom)} – {formatDate(row.effectiveUntil)}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 rounded hover:bg-blue-100 transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 transition-colors" />
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="p-1 rounded hover:bg-red-100 transition-colors"
            title="Delete"
          >
            {deleting
              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
              : <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500 transition-colors" />}
          </button>
        </div>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full ${getAvatarBgColor(row.studentName ?? "")} text-white flex items-center justify-center text-xs font-bold shadow-sm`}>
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{row.studentName}</p>
              <p className="text-xs text-slate-400">{row.feeHeadName}</p>
            </div>
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {row.concessionType}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-slate-400 mb-0.5">Discount</p>
            <p className="font-semibold text-slate-800">{formatDiscount(row)}</p>
            {row.discountAmount != null && (
              <p className="font-medium text-red-500 mt-0.5">- ₹{row.discountAmount.toLocaleString("en-IN")}</p>
            )}
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-slate-400 mb-0.5">Total Amount</p>
            <p className="font-semibold text-slate-800">
              {row.totalAmount != null ? `₹${row.totalAmount.toLocaleString("en-IN")}` : "—"}
            </p>
          </div>
          <div className="bg-[#EEF2FF] rounded-lg px-3 py-2">
            <p className="text-slate-400 mb-0.5">Payable</p>
            <p className="font-bold text-[#3525CD]">
              {row.finalAmount != null ? `₹${row.finalAmount.toLocaleString("en-IN")}` : "—"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-slate-400 mb-0.5">From</p>
            <p className="text-slate-600 font-medium">{formatDate(row.effectiveFrom)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2 col-span-2">
            <p className="text-slate-400 mb-0.5">Reason</p>
            <p className="text-slate-600 font-medium">{row.reason}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-1 border-t border-slate-100">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </>
  );
};

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

interface ConcessionsProps {
  triggerAdd?: boolean;
  onAddHandled?: () => void;
}

export function Concessions({ triggerAdd, onAddHandled }: ConcessionsProps = {}) {
  const navigate = useNavigate();
  const [concessions, setConcessions]       = useState<ConcessionRecord[]>([]);
  const [page, setPage]                     = useState(1);
  const [deletingId, setDeletingId]         = useState<string | null>(null);

  const refresh = useCallback(() => {
    getAllConcessions()
      .then((res) => { if (res.status) setConcessions(res.data ?? []); })
      .catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (triggerAdd) {
      navigate("/accountant/fees/concession/add");
      onAddHandled?.();
    }
  }, [triggerAdd, onAddHandled, navigate]);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteConcession(id);
      toast.success("Concession deleted");
      refresh();
    } catch {
      toast.error("Failed to delete concession");
    } finally {
      setDeletingId(null);
    }
  }, [refresh]);

  const totalDiscount  = concessions.reduce((sum, c) => sum + (c.discountAmount ?? 0), 0);
  const totalFeeAmount = concessions.reduce((sum, c) => sum + (c.totalAmount ?? 0), 0);
  const uniqueTypes    = new Set(concessions.map((c) => c.concessionType)).size;
  const totalPages  = Math.ceil(concessions.length / CONCESSIONS_PAGE_SIZE);
  const pagedData   = concessions.slice(
    (page - 1) * CONCESSIONS_PAGE_SIZE,
    page * CONCESSIONS_PAGE_SIZE,
  );

  return (
    <div className="space-y-5 pb-8">

      {/* Stats */}
      <div className="mx-5 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Concessions"
          value={String(concessions.length)}
          suffixLabel="students"
          icon={<Users className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          label="Total Fee Amount"
          value={`₹${totalFeeAmount.toLocaleString()}`}
          icon={<IndianRupee className="w-4 h-4 text-indigo-600" />}
        />
        <StatCard
          label="Total Discount"
          value={`₹${totalDiscount.toLocaleString()}`}
          icon={<Wallet className="w-4 h-4 text-orange-500" />}
        />
        <StatCard
          label="Concession Types"
          value={String(uniqueTypes)}
          icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* Table */}
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

          {pagedData.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="px-4 md:px-0 space-y-3 md:space-y-0 py-4 md:py-0">
              {pagedData.map((row) => (
                <ConcessionCard
                  key={row.id}
                  row={row}
                  onEdit={() => navigate(`/accountant/fees/concession/edit/${row.id}`, { state: { editData: row } })}
                  onDelete={() => handleDelete(row.id)}
                  deleting={deletingId === row.id}
                />
              ))}
            </div>
          )}

          {pagedData.length > 0 && (
            <div className="hidden md:flex px-5 py-2.5 bg-slate-50 border-t border-slate-100 items-center justify-between">
              <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
              <span className="text-xs text-slate-400">
                {(page - 1) * CONCESSIONS_PAGE_SIZE + 1}–
                {Math.min(page * CONCESSIONS_PAGE_SIZE, concessions.length)} of {concessions.length} entries
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {concessions.length > CONCESSIONS_PAGE_SIZE && (
        <Pagination
          page={page}
          total={concessions.length}
          pageSize={CONCESSIONS_PAGE_SIZE}
          onChange={setPage}
          itemLabel="concessions"
          showPageNumbers={true}
        />
      )}
    </div>
  );
}
