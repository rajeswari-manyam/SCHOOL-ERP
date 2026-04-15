import { useState, useEffect } from "react";
import type { DayOfWeek, TimetableConflict, TeacherOption, SubjectOption } from "../types/timetable.types";
import { timetableApi } from "../api/timetable.api";

interface EditPeriodModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: {
    subject: string;
    teacherId: string;
    room: string;
    applyToAllWeeks: boolean;
  }) => void;
  isSaving: boolean;
  classId: string;
  className: string;
  day: DayOfWeek;
  periodNumber: number;
  periodLabel: string;    // "Period 1 (8:30–9:15 AM)"
  timeSlot: string;       // "8:30 AM – 9:15 AM"
  defaultSubject: string;
  defaultTeacherName: string;
  defaultRoom: string;
  teachers: TeacherOption[];
  subjects: SubjectOption[];
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
  THU: "Thursday", FRI: "Friday", SAT: "Saturday",
};

const EditPeriodModal = ({
  open, onClose, onSave, isSaving,
  classId, className, day, periodNumber, periodLabel, timeSlot,
  defaultSubject, defaultTeacherName, defaultRoom,
  teachers, subjects,
}: EditPeriodModalProps) => {
  const [subject, setSubject] = useState(defaultSubject);
  const [teacherId, setTeacherId] = useState("");
  const [room, setRoom] = useState(defaultRoom);
  const [applyToAllWeeks, setApplyToAllWeeks] = useState(false);
  const [conflicts, setConflicts] = useState<TimetableConflict[]>([]);
  const [checkingConflicts, setCheckingConflicts] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSubject(defaultSubject);
      setTeacherId(
        teachers.find((t) => t.name === defaultTeacherName)?.id ?? ""
      );
      setRoom(defaultRoom);
      setApplyToAllWeeks(false);
      setConflicts([]);
    }
  }, [open, defaultSubject, defaultTeacherName, defaultRoom, teachers]);

  // Check conflicts whenever teacher changes
  useEffect(() => {
    if (!teacherId || !classId) return;
    let cancelled = false;
    const check = async () => {
      setCheckingConflicts(true);
      try {
        const result = await timetableApi.checkConflicts({
          classId,
          periodNumber,
          day,
          subject,
          teacherId,
          room,
        });
        if (!cancelled) setConflicts(result);
      } catch {
        // silently ignore conflict check errors — not blocking
        if (!cancelled) setConflicts([]);
      } finally {
        if (!cancelled) setCheckingConflicts(false);
      }
    };
    const timer = setTimeout(check, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [teacherId, subject, classId, periodNumber, day, room]);

  if (!open) return null;

  const handleSave = () => {
    onSave({ subject, teacherId, room, applyToAllWeeks });
  };

  const teacherConflicts = conflicts.filter((c) => c.type === "TEACHER_OVERLAP");
  const roomConflicts = conflicts.filter((c) => c.type === "ROOM_OVERLAP");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Period</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Class {className} — {DAY_LABELS[day]}, {periodLabel}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 mt-0.5"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" /><line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Subject */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">
              Subject
            </label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
              >
                {subjects.length === 0 && (
                  <option value={subject}>{subject}</option>
                )}
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="4 6 8 10 12 6" />
              </svg>
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">
              Teacher
            </label>
            <div className="relative">
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-10"
              >
                <option value="">Select teacher…</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="4 6 8 10 12 6" />
              </svg>
            </div>
          </div>

          {/* Period Number + Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">
                Period Number
              </label>
              <input
                type="text"
                value={periodNumber}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">
                Time Slot
              </label>
              <input
                type="text"
                value={timeSlot}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Room / Venue */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">
              Room / Venue
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 10A (default class room)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Conflict warnings */}
          {checkingConflicts && (
            <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
              <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
              </svg>
              Checking for conflicts…
            </div>
          )}

          {!checkingConflicts && teacherConflicts.length > 0 && teacherConflicts.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
            >
              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-sm font-semibold text-amber-800">{c.message}</p>
            </div>
          ))}

          {!checkingConflicts && roomConflicts.length > 0 && roomConflicts.map((c, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
            >
              <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm font-semibold text-red-700">{c.message}</p>
            </div>
          ))}

          {/* Apply to all weeks */}
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative">
              <input
                type="checkbox"
                checked={applyToAllWeeks}
                onChange={(e) => setApplyToAllWeeks(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                  applyToAllWeeks
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-gray-300 bg-white group-hover:border-indigo-400"
                }`}
              >
                {applyToAllWeeks && (
                  <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="1 5 4 8 9 2" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700">Apply same change to all weeks</span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !teacherId}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[110px] flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                  </svg>
                  Saving…
                </>
              ) : "Save Period"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPeriodModal;