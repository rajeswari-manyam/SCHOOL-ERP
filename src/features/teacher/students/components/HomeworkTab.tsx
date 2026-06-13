import { useQuery } from "@tanstack/react-query";
import type { Student } from "../types/my-students.types";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { getHomeworkByClass } from "@/services/homework.api";

const HW_STATUS: Record<string, { label: string; classes: string }> = {
  SUBMITTED: { label: "Submitted", classes: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PENDING:   { label: "Pending",   classes: "bg-amber-50  text-amber-700  border border-amber-200" },
  LATE:      { label: "Late",      classes: "bg-red-50    text-red-600    border border-red-200" },
};

type HomeworkRecord = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submittedDate?: string;
  status: "SUBMITTED" | "PENDING" | "LATE";
};

const extractHomeworkArray = (raw: unknown): Record<string, unknown>[] => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const key of ['data', 'homeworks', 'homework', 'list', 'records', 'items']) {
      const val = obj[key];
      if (Array.isArray(val)) return val;
    }
    if (obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])) {
      const inner = obj['data'] as Record<string, unknown>;
      for (const key of ['homeworks', 'homework', 'list', 'records', 'items']) {
        const val = inner[key];
        if (Array.isArray(val)) return val;
      }
    }
  }
  return [];
};

const normalizeStatus = (item: Record<string, unknown>): "SUBMITTED" | "PENDING" | "LATE" => {
  const s = String(item['status'] ?? item['submission_status'] ?? '').toLowerCase();
  if (s === 'submitted' || s === 'completed') return "SUBMITTED";
  if (s === 'late' || s === 'overdue') return "LATE";
  return "PENDING";
};

const mapHomeworkRecord = (item: Record<string, unknown>): HomeworkRecord => ({
  id: String(item['id'] ?? item['_id'] ?? ''),
  title: String(item['title'] ?? item['homework_title'] ?? 'Untitled Homework'),
  subject: String(item['subject_name'] ?? item['subjectName'] ?? item['subject'] ?? 'General'),
  dueDate: String(item['submission_date'] ?? item['due_date'] ?? item['dueDate'] ?? '—'),
  submittedDate: item['submitted_at'] ? String(item['submitted_at']) : undefined,
  status: normalizeStatus(item),
});

const HomeworkTab = ({ student }: { student: Student }) => {
  const classId = student.classId;
  const sectionId = student.sectionId;

  const { data: raw, isLoading, isError, error } = useQuery({
    queryKey: ["teacher", "student-homework", classId ?? "", sectionId ?? ""],
    queryFn: () => getHomeworkByClass({ class_id: classId ?? "", section_id: sectionId ?? "" }),
    enabled: Boolean(classId),
    staleTime: 30_000,
    retry: 1,
  });

  const rawItems = extractHomeworkArray(raw);
  const records: HomeworkRecord[] = rawItems.map(mapHomeworkRecord);

  const submitted = records.filter((h) => h.status === "SUBMITTED").length;
  const pending = records.filter((h) => h.status === "PENDING" || h.status === "LATE").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-2 p-3 bg-emerald-50 rounded-xl">
          <Check size={14} className="text-emerald-600" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-extrabold text-emerald-700">{submitted}</p>
            <p className="text-[10px] text-emerald-500">Submitted</p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
          <AlertCircle size={14} className="text-amber-500" strokeWidth={2.5} />
          <div>
            <p className="text-sm font-extrabold text-amber-600">{pending}</p>
            <p className="text-[10px] text-amber-500">Pending</p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 py-6 text-sm text-gray-500">
            <Loader2 size={14} className="animate-spin" />
            Loading homework...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-4 text-sm text-red-600">
            {(error as Error)?.message ?? "Failed to load homework for this student."}
          </div>
        ) : records.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No homework records</p>
        ) : (
          records.map((hw) => {
            const cfg = HW_STATUS[hw.status] ?? HW_STATUS.PENDING;
            return (
              <div key={hw.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{hw.title}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{hw.subject} · Due {hw.dueDate}</p>
                  {hw.submittedDate && (
                    <p className="text-[10px] text-gray-300 mt-0.5">Submitted on {hw.submittedDate}</p>
                  )}
                </div>
                <span className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full ${cfg.classes}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HomeworkTab;