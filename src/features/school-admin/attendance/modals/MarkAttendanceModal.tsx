// attendance/modals/MarkAttendanceModal.tsx
// Image 2 — "Mark Attendance — Web Form" modal

import { useState } from "react";
import { format } from "date-fns";
import { useClassStudents, useSubmitWebForm, MOCK_WEB_STUDENTS } from "../hooks/useAttendance";
import type { WebFormStudent } from "../types/attendance.types";

interface MarkAttendanceModalProps {
  open: boolean;
  onClose: () => void;
  defaultClass?: string;
  defaultSection?: string;
  defaultDate?: string;
}

const CLASSES   = ["Class 6A","Class 6B","Class 7A","Class 7B","Class 8A","Class 8B","Class 9A","Class 9B","Class 10A","Class 10B"];
const SECTIONS  = ["A","B","C"];

const iCls = "w-full h-11 px-4 rounded-2xl border border-gray-200 text-sm text-gray-800 bg-[#f3f4f8] focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer appearance-none";

const MarkAttendanceModal = ({ open, onClose, defaultClass = "Class 8A", defaultSection = "A", defaultDate }: MarkAttendanceModalProps) => {
  const today = defaultDate ?? format(new Date(), "dd MMM yyyy");

  const [selectedClass,   setSelectedClass]   = useState(defaultClass);
  const [selectedSection, setSelectedSection] = useState(defaultSection);
  const [records, setRecords] = useState<Record<string, boolean>>(
    () => Object.fromEntries(MOCK_WEB_STUDENTS.map((s) => [s.id, s.present]))
  );

  const { mutate, isPending } = useSubmitWebForm();

  if (!open) return null;

  const toggle    = (id: string) => setRecords((p) => ({ ...p, [id]: !p[id] }));
  const presentCt = Object.values(records).filter(Boolean).length;
  const absentCt  = Object.values(records).filter((v) => !v).length;

  const handleSubmit = () => {
    mutate({
      classId: selectedClass.toLowerCase().replace(" ", "-"),
      section: selectedSection,
      date: new Date().toISOString().slice(0, 10),
      records: MOCK_WEB_STUDENTS.map((s) => ({ studentId: s.id, present: records[s.id] ?? true })),
    }, { onSuccess: onClose });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-7 pt-7 pb-5 flex-shrink-0">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Mark Attendance — Web Form</h2>
              <p className="text-sm text-gray-400 mt-0.5">Backup method when WhatsApp is unavailable</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-xl hover:bg-gray-100 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Class / Section / Date row */}
          <div className="grid grid-cols-3 gap-4 px-7 pb-5 flex-shrink-0">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Class</label>
              <div className="relative">
                <select className={iCls} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                  {CLASSES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Section</label>
              <div className="relative">
                <select className={iCls} value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}>
                  {SECTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">Date</label>
              <div className={`${iCls} flex items-center text-gray-500`} style={{ cursor: "default" }}>{today}</div>
            </div>
          </div>

          {/* Student Attendance header */}
          <div className="px-7 pb-2 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Student Attendance</p>
                <p className="text-xs text-gray-400 mt-0.5">All marked Present by default — uncheck to mark Absent</p>
              </div>
              <p className="text-sm font-bold text-gray-800 whitespace-nowrap">
                Marking {presentCt} present, {absentCt} absent
              </p>
            </div>
          </div>

          {/* Student list */}
          <div className="flex-1 overflow-y-auto min-h-0 mx-7 mb-4 rounded-2xl border border-gray-100 divide-y divide-gray-50">
            {MOCK_WEB_STUDENTS.map((s) => {
              const isPresent = records[s.id] ?? true;
              return (
                <label
                  key={s.id}
                  className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors select-none ${!isPresent ? "bg-red-50" : "hover:bg-gray-50/50"}`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${isPresent ? "bg-indigo-600 border-indigo-600" : "bg-white border-gray-300"}`}
                    onClick={() => toggle(s.id)}
                  >
                    {isPresent && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <input type="checkbox" className="sr-only" checked={isPresent} onChange={() => toggle(s.id)} />
                  <span className="text-sm text-gray-400 font-semibold w-6">{s.rollNo}</span>
                  <span className="flex-1 text-sm font-semibold text-gray-900">{s.name}</span>
                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full tracking-wide ${isPresent ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {isPresent ? "PRESENT" : "ABSENT"}
                  </span>
                </label>
              );
            })}
          </div>

          {/* WA alert notice */}
          <div className="mx-7 mb-5 flex-shrink-0">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-sm text-amber-700 font-medium">
                Parent WhatsApp alerts will be sent automatically for all absent students.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between px-7 py-5 border-t border-gray-100">
            <button onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-700 text-white text-sm font-bold hover:bg-indigo-800 disabled:opacity-60 transition-colors shadow-sm"
            >
              {isPending && (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {isPending ? "Submitting…" : "Submit Attendance"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkAttendanceModal;
