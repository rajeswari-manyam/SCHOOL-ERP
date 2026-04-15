import { useState, useEffect } from "react";
import type { AddExamPayload } from "../types/timetable.types";

interface AddExamModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: AddExamPayload) => void;
  isSaving: boolean;
  classId: string;
  className: string;
}

const AddExamModal = ({
  open, onClose, onSave, isSaving, classId, className,
}: AddExamModalProps) => {
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("12:00");
  const [venue, setVenue] = useState(`Room ${className}`);
  const [notifyParents, setNotifyParents] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setSubject(""); setDate(""); setStartTime("09:00");
      setEndTime("12:00"); setVenue(`Room ${className}`);
      setNotifyParents(true); setErrors({});
    }
  }, [open, className]);

  if (!open) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!subject.trim()) e.subject = "Subject is required.";
    if (!date) e.date = "Date is required.";
    if (!startTime) e.startTime = "Start time is required.";
    if (!endTime) e.endTime = "End time is required.";
    if (startTime && endTime && startTime >= endTime)
      e.endTime = "End time must be after start time.";
    if (!venue.trim()) e.venue = "Venue is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const dateObj = new Date(date);
    const day = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const fmt = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return `${h12}${m ? `:${String(m).padStart(2,"0")}` : ""} ${period}`;
    };
    onSave({
      subject,
      classId,
      date: day,
      startTime: fmt(startTime),
      endTime: fmt(endTime),
      venue,
      notifyParents,
    });
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5 block">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full bg-gray-50 border rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
      err ? "border-red-300 bg-red-50" : "border-gray-200"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Exam</h2>
            <p className="text-sm text-gray-500 mt-0.5">Class {className} — Exam Schedule</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 mt-0.5">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="4" x2="14" y2="14" /><line x1="14" y1="4" x2="4" y2="14" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          <Field label="Subject" error={errors.subject}>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className={inputCls(errors.subject)}
            />
          </Field>

          <Field label="Date" error={errors.date}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls(errors.date)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time" error={errors.startTime}>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputCls(errors.startTime)}
              />
            </Field>
            <Field label="End Time" error={errors.endTime}>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputCls(errors.endTime)}
              />
            </Field>
          </div>

          <Field label="Venue" error={errors.venue}>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Room 10A"
              className={inputCls(errors.venue)}
            />
          </Field>

          {/* Notify Parents toggle */}
          <label className="flex items-center justify-between cursor-pointer select-none bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notify Parents</p>
              <p className="text-xs text-gray-400 mt-0.5">Send WhatsApp message to class parents</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifyParents((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifyParents ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  notifyParents ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 min-w-[110px] flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 11-6.219-8.56" strokeLinecap="round" />
                  </svg>
                  Saving…
                </>
              ) : "Add Exam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExamModal;