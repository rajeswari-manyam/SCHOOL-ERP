import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Student } from "../types/student.types";
import { StatusBadge, FeeBadge } from "./StudentBadge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";

const PAGE_SIZE = 5;

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

const Avatar = ({ s, onPreview }: { s: Student; onPreview?: (s: Student) => void }) => {
  const first = s.firstName?.[0] ?? "?";
  const last  = s.lastName?.[0]  ?? "";
  const initials = (first + last).toUpperCase();
  const color = AVATAR_COLORS[parseInt(s.id, 16) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];

  if (s.photo) {
    return (
      <button
        type="button"
        title="View photo"
        onClick={(e) => { e.stopPropagation(); onPreview?.(s); }}
        className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden ring-1 ring-black/5 hover:ring-2 hover:ring-indigo-400 transition"
      >
        <img src={s.photo} alt={`${s.firstName ?? ""} ${s.lastName ?? ""}`.trim()} className="w-full h-full object-cover" />
      </button>
    );
  }

  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
};

const TH = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap ${className}`}>
    {children}
  </th>
);

interface StudentTableProps {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
}

const StudentTable = ({ students, onEdit, onDelete }: StudentTableProps) => {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [previewStudent, setPreviewStudent] = useState<Student | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));

  // Reset to page 1 when the students list changes (e.g. filter applied)
  useEffect(() => { setPage(1); }, [students]);

  const start   = (page - 1) * PAGE_SIZE;
  const pageRows = students.slice(start, start + PAGE_SIZE);

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <p className="text-gray-400 text-sm">No students found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-100" style={{ background: '#EFF4FF' }}>
              <TH>Photo</TH>
              <TH>Admission No.</TH>
              <TH>Student Name</TH>
              <TH>Class</TH>
              <TH>Section</TH>
              <TH>Status</TH>
              <TH>Fee Status</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageRows.map((s) => (
              <tr
                key={s.id}
                className="hover:bg-[#EFF4FF] transition-colors cursor-pointer"
                onClick={() => navigate(`/schooladmin/students/${s.id}`)}
              >
                <td className="px-4 py-3"><Avatar s={s} onPreview={setPreviewStudent} /></td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-gray-500 tabular-nums">
                    {s.admissionNo ?? (s as any).admissionNumber ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {s.firstName ?? "—"} {s.lastName ?? ""}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.class   || "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{s.section || "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3"><FeeBadge status={s.feeStatus} /></td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-3">
                    <button title="View" onClick={() => navigate(`/schooladmin/students/${s.id}`)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button title="Edit" onClick={() => onEdit?.(s)}
                      className="text-gray-400 hover:text-gray-700 transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {onDelete && (
                      <button title="Delete" onClick={() => setDeleteTarget(s)}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Showing <span className="font-semibold text-gray-700">{start + 1}–{Math.min(start + PAGE_SIZE, students.length)}</span> of <span className="font-semibold text-gray-700">{students.length}</span> students
        </p>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
            const isActive = n === page;
            // Always show first, last, current, and neighbours; collapse the rest
            const show =
              n === 1 || n === totalPages || Math.abs(n - page) <= 1;
            const showEllipsisBefore = n === page - 2 && page > 3;
            const showEllipsisAfter  = n === page + 2 && page < totalPages - 2;
            if (!show) return null;
            return (
              <span key={n} className="flex items-center">
                {showEllipsisBefore && (
                  <span className="px-1 text-xs text-gray-400">…</span>
                )}
                <button
                  onClick={() => setPage(n)}
                  className={`min-w-[30px] h-7 px-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
                {showEllipsisAfter && (
                  <span className="px-1 text-xs text-gray-400">…</span>
                )}
              </span>
            );
          })}

          {/* Next */}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) onDelete?.(deleteTarget.id);
          setDeleteTarget(null);
        }}
        title="Delete Student?"
        description={`This will deactivate ${deleteTarget?.firstName ?? ""} ${deleteTarget?.lastName ?? ""} (${deleteTarget?.admissionNo ?? ""}). This action can be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {previewStudent?.photo && (
        <ImagePreviewModal
          src={previewStudent.photo}
          alt={`${previewStudent.firstName ?? ""} ${previewStudent.lastName ?? ""}`.trim()}
          title={`${previewStudent.firstName ?? ""} ${previewStudent.lastName ?? ""}`.trim()}
          subtitle={previewStudent.admissionNo}
          onClose={() => setPreviewStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentTable;
