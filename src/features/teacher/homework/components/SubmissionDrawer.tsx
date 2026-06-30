import { useEffect, useState } from "react";
import { X, CheckCircle2, Clock, User, Calendar, BookOpen, FileText, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubmissionsByHomeworkId, createHomeworkSubmission } from "@/services/homework.api";
import type { StudentSubmission } from "@/services/homework.api";
import type { HomeworkItem } from "../types/homework.types";
import toast from "react-hot-toast";

// ── Status resolution ─────────────────────────────────────────────────────────

const resolveStatus = (
  s: StudentSubmission,
  dueDateStr: string
): "submitted" | "late" | "pending" => {
  if (s.status === "not submitted") return "pending";
  if (s.submittedAt) {
    const due = new Date(dueDateStr);
    due.setHours(23, 59, 59, 999);
    if (new Date(s.submittedAt) > due) return "late";
  }
  return "submitted";
};

// ── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: "submitted" | "late" | "pending" }) => {
  if (status === "submitted")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 size={10} /> Submitted
      </span>
    );
  if (status === "late")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock size={10} /> Late
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
      <Clock size={10} /> Pending
    </span>
  );
};

// ── Drawer ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  hw: HomeworkItem;
}

const SubmissionDrawer = ({ open, onClose, hw }: Props) => {
  const [activeTab, setActiveTab] = useState<"all" | "submitted" | "pending">("all");
  const [markingId, setMarkingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // ── Fetch real submissions ────────────────────────────────────────────────
  const {
    data: apiData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["submissions", hw.id],
    queryFn: () => getSubmissionsByHomeworkId(hw.id),
    enabled: open && !!hw.id,
    staleTime: 1000 * 60 * 2,
  });

  // ── Mark submitted mutation ───────────────────────────────────────────────
  const { mutate: markSubmitted } = useMutation({
    mutationFn: (studentId: string) =>
      createHomeworkSubmission({
        homework_id:     hw.id,
        student_id:      studentId,
        submission_date: new Date().toISOString().split("T")[0],
        remarks:         "Marked as submitted by teacher",
      }),
    onMutate: (studentId) => setMarkingId(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions", hw.id] });
      toast.success("Marked as submitted");
    },
    onError: () => toast.error("Failed to mark submission"),
    onSettled: () => setMarkingId(null),
  });

  const rawStudents = apiData?.data ?? [];

  const students = rawStudents.map((s) => ({
    ...s,
    displayStatus: resolveStatus(s, hw.dueDate),
  }));

  const filtered = students.filter((s) => {
    if (activeTab === "submitted") return s.displayStatus === "submitted" || s.displayStatus === "late";
    if (activeTab === "pending")   return s.displayStatus === "pending";
    return true;
  });

  const submittedCount = students.filter((s) => s.displayStatus !== "pending").length;
  const pendingCount   = students.filter((s) => s.displayStatus === "pending").length;
  const total          = students.length;
  const pct            = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Drawer header ── */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 flex-shrink-0">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-1">
              {hw.title}
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <BookOpen size={11} /> {hw.subject}
              </span>
              <span className="text-slate-300 text-[10px]">•</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <User size={11} /> {hw.className}{hw.section ? ` – ${hw.section}` : ""}
              </span>
              <span className="text-slate-300 text-[10px]">•</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Calendar size={11} /> Due {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Summary bar ── */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[12px] font-semibold text-slate-600">
              {isLoading ? "Loading…" : `${submittedCount} of ${total} submitted`}
            </span>
            {!isLoading && (
              <span
                className={`text-[12px] font-bold ${
                  pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-500" : "text-red-500"
                }`}
              >
                {pct}%
              </span>
            )}
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="px-5 py-2 border-b border-slate-100 flex gap-1 flex-shrink-0">
          {(["all", "submitted", "pending"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors capitalize ${
                activeTab === t
                  ? "bg-indigo-600 text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {t === "all"
                ? `All (${total})`
                : t === "submitted"
                ? `Submitted (${submittedCount})`
                : `Pending (${pendingCount})`}
            </button>
          ))}
        </div>

        {/* ── Student list ── */}
        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <Loader2 size={28} className="animate-spin" />
              <p className="text-[13px]">Loading submissions…</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-red-400 gap-2">
              <p className="text-[13px]">Failed to load submissions. Please try again.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <CheckCircle2 size={32} strokeWidth={1.5} />
              <p className="text-[13px]">No students in this category</p>
            </div>
          ) : (
            filtered.map((s) => (
              <div
                key={s.student_id}
                className="flex items-start gap-3 py-2.5 px-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[12px] font-bold text-indigo-600 flex-shrink-0 mt-0.5">
                  {s.student_name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 truncate">
                    {s.student_name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Roll No. {s.roll_number}
                    {s.submittedAt && (
                      <> · {new Date(s.submittedAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}</>
                    )}
                  </p>
                  {s.remarks && (
                    <p className="text-[11px] text-slate-500 mt-0.5 italic truncate">
                      "{s.remarks}"
                    </p>
                  )}
                  {s.file_url && (
                    <a
                      href={s.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[11px] text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                      <FileText size={10} /> View attachment
                    </a>
                  )}
                </div>

                {/* Status + Mark button for pending */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <StatusBadge status={s.displayStatus} />
                  {s.displayStatus === "pending" && (
                    <button
                      onClick={() => markSubmitted(s.student_id)}
                      disabled={markingId === s.student_id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors disabled:opacity-50"
                    >
                      {markingId === s.student_id ? (
                        <Loader2 size={9} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={9} />
                      )}
                      Mark Submitted
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full h-9 rounded-xl text-[13px] font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SubmissionDrawer;
