import { useState } from "react";
import type { StaffMember } from "../types/staff.types";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const PAGE_SIZE = 5;

/* ── Avatar ── */
const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-pink-100 text-pink-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

const Avatar = ({ initials, id }: { initials: string; id: string }) => {
  const colorIdx = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[colorIdx]}`}>
      {initials}
    </div>
  );
};

/* ── Status badge ── */
const StatusBadge = ({ status }: { status: string }) => {
  if (status === "ACTIVE")
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />Active</span>;
  if (status === "ON_LEAVE")
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />On Leave</span>;
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />Inactive</span>;
};

/* ── Subject pill ── */
const Pill = ({ label }: { label: string }) => (
  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[11px] font-medium whitespace-nowrap">{label}</span>
);

/* ── Table header cell ── */
const TH = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap ${className}`}>
    {children}
  </th>
);

interface Props {
  staff: StaffMember[];
  total: number;
  onEdit?: (staff: StaffMember) => void;
  onView?: (staff: StaffMember) => void;
  onDelete?: (id: string) => void;
}

export const StaffTable = ({ staff, total, onEdit, onView, onDelete }: Props) => {
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(staff.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageRows = staff.slice(start, start + PAGE_SIZE);

  if (staff.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-400 text-sm">No staff members found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <TH>Name &amp; Contact</TH>
              <TH>Emp. No.</TH>
              <TH>Role</TH>
              <TH>Classes / Subjects</TH>
              <TH>Status</TH>
              <TH>Leave Bal.</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageRows.map((s) => {
              const roleLabel = [s.role, s.classes?.[0]].filter(Boolean).join(" — ");
              return (
                <tr key={s.id} className="bg-slate-50/50 hover:bg-indigo-50/40 transition-colors">

                  {/* Name & Contact */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar initials={s.initials ?? s.name?.slice(0, 2).toUpperCase() ?? "NA"} id={s.id} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{s.name ?? "—"}</p>
                        <p className="text-xs text-gray-400">
                          {s.phone ? `+91 ${s.phone.replace(/^\+91\s*/, "")}` : "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Emp. No. */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-mono text-gray-700">{s.employeeId || "—"}</span>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-gray-700 whitespace-nowrap">{roleLabel || "—"}</span>
                    {s.departmentName && (
                      <p className="text-[10px] text-indigo-500 font-semibold mt-0.5 whitespace-nowrap">{s.departmentName}</p>
                    )}
                  </td>

                  {/* Classes / Subjects */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {s.classes?.slice(0, 2).map((cls) => (
                        <span key={cls} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-semibold whitespace-nowrap">{cls}</span>
                      ))}
                      {s.subjects?.slice(0, 2).map((sub) => (
                        <Pill key={sub} label={sub} />
                      ))}
                      {!s.classes?.length && !s.subjects?.length && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={s.status} />
                  </td>

                  {/* Leave Balance */}
                  <td className="px-4 py-3.5">
                    <span className={`text-sm font-semibold ${s.leaveBalance != null && s.leaveBalance <= 3 ? "text-amber-600" : "text-gray-800"}`}>
                      {s.leaveBalance != null ? `${s.leaveBalance} days` : "—"}
                    </span>
                    {s.leavesTaken != null && (
                      <p className="text-[10px] text-gray-400 mt-0.5">{s.leavesTaken} used</p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => onView?.(s)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                        View
                      </button>
                      <button onClick={() => onEdit?.(s)}
                        className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">
                        Edit
                      </button>
                      {onDelete && (
                        <button onClick={() => setDeleteTarget(s)} title="Delete"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/40">
        <p className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-700">{start + 1}–{Math.min(start + PAGE_SIZE, staff.length)}</span> of{" "}
          <span className="font-semibold text-gray-700">{total}</span> staff members
        </p>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => p - 1)} disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <button
            onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) onDelete?.(deleteTarget.id); setDeleteTarget(null); }}
        title="Delete Staff Member?"
        description={`This will deactivate ${deleteTarget?.name ?? ""} (${deleteTarget?.employeeId ?? deleteTarget?.role ?? ""}). This action can be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};
