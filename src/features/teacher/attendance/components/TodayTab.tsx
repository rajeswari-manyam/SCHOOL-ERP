// teacher/attendance/components/TodayTab.tsx
import { useState } from "react";
import { format } from "date-fns";
import {
  useAttendanceStudents,
  useMarkAttendanceViaWeb,
  useRetryWaAlert,
  MOCK_STUDENTS,
} from "../hooks/useAttendance";
import type { TodayAttendance } from "../types/attendance.types";
import ConfirmSubmitModal from "./ConfirmSubmitModal";

type AttStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

interface TodayTabProps {
  today: TodayAttendance;
  onOpenCorrectionModal: (prefill?: { date: string; studentId: string; studentName: string; rollNo: string; currentMark: "P" | "A" | "H" }) => void;
}

const statusBtn = (active: boolean, color: string) =>
  `px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${active ? `${color} text-white shadow-sm` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`;

// ── Not Marked State ─────────────────────────────────────────────────────────
const NotMarkedState = ({ today, onOpenWebForm }: { today: TodayAttendance; onOpenWebForm: () => void }) => {
  const hour = new Date().getHours();
  const minuteOfDay = new Date().getHours() * 60 + new Date().getMinutes();
  const deadlineMinute = 10 * 60; // 10:00 AM
  const pct = Math.min(100, Math.round((minuteOfDay / deadlineMinute) * 100));
  const isLate = hour >= 9;
  const isVeryLate = hour >= 10;

  // Progress step timeline
  const STEPS = [
    { time: "8:00", label: "School starts",    done: hour >= 8  },
    { time: "9:00", label: "Remind 9AM",       done: hour >= 9  },
    { time: "9:30", label: "Warning",          done: hour >= 9 && minuteOfDay >= 9 * 60 + 30 },
    { time: "10:00",label: "Deadline",         done: isVeryLate },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Two action buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          className="flex flex-col items-center gap-3 px-4 py-6 rounded-2xl border-2 border-[#25d366] bg-[#25d366]/5 hover:bg-[#25d366]/10 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-[#25d366] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Mark via WhatsApp</p>
            <p className="text-xs text-gray-500 mt-0.5">Send message to ERP number</p>
          </div>
        </button>

        <button
          onClick={onOpenWebForm}
          className="flex flex-col items-center gap-3 px-4 py-6 rounded-2xl border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">Mark via Web Form</p>
            <p className="text-xs text-gray-500 mt-0.5">Use the checklist below</p>
          </div>
        </button>
      </div>

      {/* Timeline to 10AM deadline */}
      <div className="bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-700">Deadline Progress</p>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isVeryLate ? "bg-red-100 text-red-600" : isLate ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
            {isVeryLate ? "Deadline Passed" : isLate ? "⚠ Mark Now" : "On Time"}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all ${isVeryLate ? "bg-red-400" : isLate ? "bg-amber-400" : "bg-emerald-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex items-start justify-between">
          {STEPS.map((step) => (
            <div key={step.time} className="flex flex-col items-center gap-1">
              <div className={`w-2.5 h-2.5 rounded-full ${step.done ? "bg-indigo-500" : "bg-gray-300"}`} />
              <p className="text-[9px] font-bold text-gray-500">{step.time}</p>
              <p className="text-[9px] text-gray-400 text-center leading-tight max-w-[50px]">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Marked State ──────────────────────────────────────────────────────────────
const MarkedState = ({ today, onOpenCorrectionModal }: { today: TodayAttendance; onOpenCorrectionModal: TodayTabProps["onOpenCorrectionModal"] }) => {
  const { mutate: retryAlert, isPending: retrying } = useRetryWaAlert();
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
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
                    </svg>
                    WA Sent {alertSentAt && <span className="text-gray-400 font-normal">{alertSentAt}</span>}
                  </div>
                ) : (
                  <button
                    onClick={() => retryAlert(student.id)}
                    disabled={retrying}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                    Retry
                  </button>
                )}

                <button
                  onClick={() => onOpenCorrectionModal({ date: today.date, studentId: student.id, studentName: student.name, rollNo: student.rollNo, currentMark: "A" })}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0 ml-1"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {today.absentStudents?.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <p className="text-sm font-semibold text-emerald-700">Full attendance today — no absences!</p>
        </div>
      )}
    </div>
  );
};

// ── Web Form (collapsible) ────────────────────────────────────────────────────
const WebForm = ({
  classLabel, date, onSubmitted,
}: { classLabel: string; date: string; onSubmitted: () => void }) => {
  const { data: studentData } = useAttendanceStudents();
  const students = studentData ?? MOCK_STUDENTS;
  const { mutate, isPending } = useMarkAttendanceViaWeb();

  const [records, setRecords] = useState<Record<string, AttStatus>>(
    () => Object.fromEntries(students.map((s) => [s.id, "PRESENT" as AttStatus])),
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const setStatus = (id: string, status: AttStatus) =>
    setRecords((p) => ({ ...p, [id]: status }));

  const presentCount = Object.values(records).filter((v) => v === "PRESENT").length;
  const absentCount  = Object.values(records).filter((v) => v === "ABSENT").length;
  const halfCount    = Object.values(records).filter((v) => v === "HALF_DAY").length;

  const statusBtn2 = (active: boolean, color: string) =>
    `w-7 h-7 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${active ? `${color} text-white shadow-sm` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`;

  const handleConfirmedSubmit = () => {
    mutate({
      classId: "class-1",
      date,
      records: students.map((s) => ({ studentId: s.id, status: records[s.id] })),
    }, {
      onSuccess: () => { setConfirmOpen(false); onSubmitted(); },
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50">
          <div>
            <p className="text-sm font-bold text-gray-800">Web Attendance Form</p>
            <p className="text-xs text-gray-400 mt-0.5">{classLabel} · {format(new Date(date), "dd MMM yyyy")}</p>
          </div>
          <button
            onClick={() => setRecords(Object.fromEntries(students.map((s) => [s.id, "PRESENT"])))}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Mark All Present
          </button>
        </div>

        {/* Student checklist */}
        <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
          {students.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {s.rollNo}
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-900">{s.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setStatus(s.id, "PRESENT")}  className={statusBtn2(records[s.id] === "PRESENT",  "bg-emerald-500")} title="Present">P</button>
                <button onClick={() => setStatus(s.id, "ABSENT")}   className={statusBtn2(records[s.id] === "ABSENT",   "bg-red-500")}     title="Absent">A</button>
                <button onClick={() => setStatus(s.id, "HALF_DAY")} className={statusBtn2(records[s.id] === "HALF_DAY", "bg-amber-400")}   title="Half Day">H</button>
              </div>
            </div>
          ))}
        </div>

        {/* Sticky summary bar */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-3 flex items-center gap-4">
          <span className="text-xs font-semibold text-emerald-600">✓ {presentCount}P</span>
          <span className="text-xs font-semibold text-red-500">✗ {absentCount}A</span>
          <span className="text-xs font-semibold text-amber-500">~ {halfCount}H</span>
          <button
            onClick={() => setConfirmOpen(true)}
            className="ml-auto flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Review & Submit
          </button>
        </div>
      </div>

      <ConfirmSubmitModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmedSubmit}
        isPending={isPending}
        classLabel={classLabel}
        date={date}
        records={records}
        students={students}
      />
    </>
  );
};

// ── TodayTab ──────────────────────────────────────────────────────────────────
const TodayTab = ({ today, onOpenCorrectionModal }: TodayTabProps) => {
  const [showWebForm, setShowWebForm] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {today.isMarked ? (
        <MarkedState today={today} onOpenCorrectionModal={onOpenCorrectionModal} />
      ) : (
        <NotMarkedState today={today} onOpenWebForm={() => setShowWebForm((v) => !v)} />
      )}

      {/* Collapsible web form */}
      {(!today.isMarked) && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <button
              onClick={() => setShowWebForm((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <svg
                className={`transition-transform ${showWebForm ? "rotate-180" : ""}`}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              {showWebForm ? "Hide Web Form" : "Open Web Form"}
            </button>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {showWebForm && (
            <WebForm
              classLabel={today.classLabel}
              date={today.date}
              onSubmitted={() => setShowWebForm(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TodayTab;