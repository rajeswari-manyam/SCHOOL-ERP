// teacher/attendance/components/TodayTab.tsx
import { Check, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TodayAttendance } from "../types/attendance.types";

interface TodayTabProps {
  today: TodayAttendance;
  isHoliday?: boolean;
  holidayName?: string;
  classId?: string;
  sectionId?: string;
  academicYearId?: string;
  onOpenCorrectionModal: (prefill?: { date: string; studentId: string; studentName: string; rollNo: string; currentMark: "P" | "A" | "H" }) => void;
}

// ── Marked State ──────────────────────────────────────────────────────────────
const MarkedState = ({ today, onOpenCorrectionModal }: { today: TodayAttendance; onOpenCorrectionModal: TodayTabProps["onOpenCorrectionModal"] }) => {
  const pct = Math.round(((today.presentCount ?? 0) / today.totalStudents) * 100);

  return (
    <div className="flex flex-col gap-5">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Present",  value: today.presentCount  ?? 0, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          { label: "Absent",   value: today.absentCount   ?? 0, color: "text-red-500",     bg: "bg-red-50 border-red-100" },
          { label: "Half Day", value: today.halfDayCount  ?? 0, color: "text-amber-500",   bg: "bg-amber-50 border-amber-100" },
          { label: "Total",    value: today.totalStudents,      color: "text-indigo-600",  bg: "bg-indigo-50 border-indigo-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border px-4 py-3 text-center ${s.bg}`}>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] font-semibold text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-2.5">
        <span>Marked at <span className="font-bold text-gray-700">{today.markedAt}</span></span>
        <span className="w-px h-3 bg-gray-200" />
        <span>
          Method:{" "}
          <span className={`font-bold ${today.method === "whatsapp" ? "text-[#25d366]" : "text-indigo-600"}`}>
            {today.method === "whatsapp" ? "WhatsApp" : "Web Form"}
          </span>
        </span>
        <span className="w-px h-3 bg-gray-200" />
        <span>Attendance: <span className="font-bold text-gray-700">{pct}%</span></span>
      </div>

      {/* Absent students list */}
      {(today.absentStudents?.length ?? 0) > 0 && (
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            Absent Students ({today.absentStudents.length})
          </p>
          <div className="space-y-2">
            {today.absentStudents.map(({ student, alertSent, alertSentAt }) => (
              <div key={student.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {student.rollNo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{student.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">{student.waNumber}</p>
                </div>

                {alertSent ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold flex-shrink-0">
                    <CheckCircle size={12} className="text-current" />
                    WA Sent {alertSentAt && <span className="text-gray-400 font-normal">{alertSentAt}</span>}
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-amber-500 flex-shrink-0">
                    WA Pending
                  </span>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenCorrectionModal({ date: today.date, studentId: student.id, studentName: student.name, rollNo: student.rollNo, currentMark: "A" })}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0 ml-1"
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {today.absentStudents?.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <Check size={14} className="text-[#10b981]" />
          <p className="text-sm font-semibold text-emerald-700">Full attendance today — no absences!</p>
        </div>
      )}
    </div>
  );
};

// ── TodayTab ──────────────────────────────────────────────────────────────────
const TodayTab = ({ today, isHoliday, holidayName, onOpenCorrectionModal }: TodayTabProps) => {

  if (isHoliday) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-10 text-center">
        <span className="text-3xl">🎉</span>
        <p className="text-lg font-bold text-gray-700">{holidayName ?? "Holiday"}</p>
        <p className="text-sm text-gray-500">Today is a holiday — no attendance to mark.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {today.isMarked && (
        <MarkedState today={today} onOpenCorrectionModal={onOpenCorrectionModal} />
      )}
    </div>
  );
};

export default TodayTab;