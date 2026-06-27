import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Bus, Wallet, BarChart3, Plus, GraduationCap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { StatCard } from "../../../../components/ui/statcard";
import type { TransportFeesProps } from "../types/fees.types";
import { SlabModal } from "./SlabModal";
import { formatINR } from "../../../../utils/formatters";
import { getAllTransportFees, deleteTransportFee } from "@/services/fee.api";
import type { TransportFeeRecord } from "@/services/fee.api";
import { toast } from "sonner";

const PAGE_SIZE = 8;

const TH = "text-xs font-bold uppercase text-gray-400 tracking-wider px-4 py-3 text-left whitespace-nowrap";
const TD = "px-4 py-3 text-sm";

const distanceLabel = (r: TransportFeeRecord) =>
  r.to_km ? `${r.from_km}–${r.to_km} km` : `${r.from_km}+ km`;

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-rose-500",
  "bg-emerald-500", "bg-amber-500", "bg-indigo-500",
];
const avatarColor = (name?: string) =>
  AVATAR_COLORS[(name?.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
      <GraduationCap className="w-7 h-7 text-indigo-400" />
    </div>
    <p className="text-slate-700 font-semibold text-sm mb-1">No transport fees configured</p>
    <p className="text-slate-400 text-xs">Add a transport fee assignment to get started.</p>
  </div>
);

// ── Row ────────────────────────────────────────────────────────────────────────
interface RowProps {
  row: TransportFeeRecord;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}

const TransportRow = ({ row, onEdit, onDelete, deleting }: RowProps) => (
  <>
    {/* Desktop */}
    <tr className="hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-0 group">
      <td className={TD}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${avatarColor(row.studentName)} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
            {getInitials(row.studentName)}
          </div>
          <div>
            <p className="font-medium text-slate-800 text-sm leading-tight">{row.studentName ?? "—"}</p>
            <p className="text-xs text-slate-400">{row.className} {row.sectionName ? `· ${row.sectionName}` : ""}</p>
          </div>
        </div>
      </td>
      <td className={TD}>
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
          {row.slab_name}
        </span>
      </td>
      <td className={`${TD} text-slate-500`}>{distanceLabel(row)}</td>
      <td className={`${TD} font-semibold text-slate-800`}>{formatINR(row.monthly_fee)}</td>
      <td className={`${TD} text-indigo-700 font-semibold`}>{formatINR(row.annual_fee)}</td>
      <td className={TD}>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} title="Edit" className="p-1 rounded hover:bg-blue-100 transition-colors">
            <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
          </button>
          <button onClick={onDelete} disabled={deleting} title="Delete" className="p-1 rounded hover:bg-red-100 transition-colors">
            {deleting
              ? <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
              : <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />}
          </button>
        </div>
      </td>
    </tr>

    {/* Mobile Card (hidden on md+) */}
    <tr className="md:hidden">
      <td colSpan={6} className="px-4 py-2">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-full ${avatarColor(row.studentName)} text-white flex items-center justify-center text-xs font-bold`}>
                {getInitials(row.studentName)}
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{row.studentName ?? "—"}</p>
                <p className="text-xs text-slate-400">{row.className} {row.sectionName}</p>
              </div>
            </div>
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
              {row.slab_name}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-slate-400 mb-0.5">Distance</p>
              <p className="font-medium text-slate-700">{distanceLabel(row)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-slate-400 mb-0.5">Monthly</p>
              <p className="font-semibold text-slate-800">{formatINR(row.monthly_fee)}</p>
            </div>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-slate-400 mb-0.5">Annual</p>
              <p className="font-semibold text-indigo-700">{formatINR(row.annual_fee)}</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1 border-t border-slate-100">
            <button onClick={onEdit} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button onClick={onDelete} disabled={deleting} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      </td>
    </tr>
  </>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export function TransportFees({
  triggerAddSlab,
  onAddSlabHandled,
  triggerEditSlabs: _triggerEditSlabs,
  onEditSlabsHandled: _onEditSlabsHandled,
}: TransportFeesProps) {
  const [records,        setRecords]        = useState<TransportFeeRecord[]>([]);
  const [page,           setPage]           = useState(1);
  const [showAddModal,   setShowAddModal]   = useState(false);
  const [editingRecord,  setEditingRecord]  = useState<TransportFeeRecord | null>(null);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);

  const refresh = useCallback(() => {
    getAllTransportFees()
      .then((res) => { if (res.status) setRecords(res.data ?? []); })
      .catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteTransportFee(id);
      toast.success("Transport fee deleted");
      refresh();
    } catch {
      toast.error("Failed to delete transport fee");
    } finally {
      setDeletingId(null);
    }
  }, [refresh]);

  // Let parent's "+ Add Slab" button open our modal
  useEffect(() => {
    if (triggerAddSlab) {
      setShowAddModal(true);
      onAddSlabHandled();
    }
  }, [triggerAddSlab, onAddSlabHandled]);

  const totalMonthly  = records.reduce((s, r) => s + (r.monthly_fee ?? 0), 0);
  const uniqueSlabs   = new Set(records.map((r) => r.slab_name)).size;
  const totalPages    = Math.ceil(records.length / PAGE_SIZE);
  const pagedData     = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 pb-8">

      {/* Stats */}
      <div className="mx-5 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Assignments"
          value={String(records.length)}
          suffixLabel="students"
          icon={<Bus className="w-4 h-4 text-indigo-600" />}
        />
        <StatCard
          label="Monthly Revenue"
          value={formatINR(totalMonthly)}
          icon={<Wallet className="w-4 h-4 text-orange-500" />}
        />
        <StatCard
          label="Slabs Configured"
          value={String(uniqueSlabs)}
          icon={<BarChart3 className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* Actions */}
      <div className="px-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing <span className="font-semibold text-slate-700">{records.length}</span> assignments
        </p>
        <Button
          onClick={() => setShowAddModal(true)}
          size="sm"
          className="bg-[#3525CD] hover:bg-[#2d1fb5] text-white gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Add Transport Fee
        </Button>
      </div>

      {/* Table */}
      <div className="px-5">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          {records.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className={TH}>Student</th>
                    <th className={TH}>Slab</th>
                    <th className={TH}>Distance</th>
                    <th className={TH}>Monthly</th>
                    <th className={TH}>Annual</th>
                    <th className={TH}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((row) => (
                    <TransportRow
                      key={row.id}
                      row={row}
                      onEdit={() => setEditingRecord(row)}
                      onDelete={() => handleDelete(row.id)}
                      deleting={deletingId === row.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagedData.length > 0 && (
            <div className="flex px-5 py-2.5 bg-slate-50 border-t border-slate-100 items-center justify-between">
              <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
              <span className="text-xs text-slate-400">
                {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, records.length)} of {records.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {records.length > PAGE_SIZE && (
        <Pagination
          page={page}
          total={records.length}
          pageSize={PAGE_SIZE}
          onChange={setPage}
          itemLabel="assignments"
          showPageNumbers={true}
        />
      )}

      {/* Add Modal */}
      {showAddModal && (
        <SlabModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); refresh(); }}
        />
      )}

      {/* Edit Modal */}
      {editingRecord && (
        <SlabModal
          editData={editingRecord}
          onClose={() => setEditingRecord(null)}
          onSuccess={() => { setEditingRecord(null); refresh(); }}
        />
      )}
    </div>
  );
}
