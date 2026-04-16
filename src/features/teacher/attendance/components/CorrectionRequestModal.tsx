// teacher/attendance/components/CorrectionRequestModal.tsx
import { useState } from "react";
import { useSubmitCorrectionRequest } from "../hooks/useAttendance";
import type { AttendanceMark } from "../types/attendance.types";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CorrectionRequestModalProps {
  open: boolean;
  onClose: () => void;
  prefill?: {
    date: string;
    studentId: string;
    studentName: string;
    rollNo: string;
    currentMark: AttendanceMark;
  };
}

const MARK_LABELS: Record<AttendanceMark, string> = { P: "Present", A: "Absent", H: "Half Day" };
const MARK_COLORS: Record<AttendanceMark, string> = {
  P: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A: "bg-red-100 text-red-600 border-red-200",
  H: "bg-amber-100 text-amber-600 border-amber-200",
};

const CorrectionRequestModal = ({ open, onClose, prefill }: CorrectionRequestModalProps) => {
  const { mutate, isPending } = useSubmitCorrectionRequest();

  const [date,          setDate]          = useState(prefill?.date ?? new Date().toISOString().slice(0, 10));
  const [studentId,     setStudentId]     = useState(prefill?.studentId ?? "");
  const [studentName,   setStudentName]   = useState(prefill?.studentName ?? "");
  const [currentMark,   setCurrentMark]   = useState<AttendanceMark>(prefill?.currentMark ?? "A");
  const [requestedMark, setRequestedMark] = useState<AttendanceMark>("P");
  const [reason,        setReason]        = useState("");
  const [error,         setError]         = useState("");

  if (!open) return null;

  const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

  const handleSubmit = () => {
    if (!prefill && !studentId.trim()) {
      setError("Student ID is required.");
      return;
    }

    if (!reason.trim() || reason.trim().length < 5) {
      setError("Please provide a reason (min 5 characters).\n");
      return;
    }

    setError("");
    mutate(
      { date, classId: "class-1", studentId, currentMark, requestedMark, reason },
      { onSuccess: onClose },
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Correction Request</h2>
              <p className="text-sm text-gray-400 mt-0.5">Requires Super Admin approval</p>
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-gray-600" onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 px-6 py-5 space-y-4">
            <FormField label="Date *">
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().slice(0, 10)}
            />
          </FormField>

            {/* Student name (manual entry if not prefilled) */}
            {!prefill ? (
              <>
                <FormField label="Student ID *">
                  <Input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Enter student ID"
                  />
                </FormField>
                <FormField label="Student Name *">
                  <Input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Anjali Reddy"
                  />
                </FormField>
              </>
            ) : (
              <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                  {prefill.rollNo}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prefill.studentName}</p>
                  <p className="text-xs text-gray-400">Roll No. {prefill.rollNo}</p>
                </div>
              </div>
            )}

            {/* Current → Requested marks */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Current Mark</label>
                <div className="flex gap-1.5">
                  {(["P", "A", "H"] as AttendanceMark[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setCurrentMark(m)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        currentMark === m
                          ? MARK_COLORS[m]
                          : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-center">{MARK_LABELS[currentMark]}</p>
              </div>

              <div>
                <label className={labelClass}>Requested Mark</label>
                <div className="flex gap-1.5">
                  {(["P", "A", "H"] as AttendanceMark[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setRequestedMark(m)}
                      disabled={m === currentMark}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        requestedMark === m && m !== currentMark
                          ? MARK_COLORS[m]
                          : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-center">{MARK_LABELS[requestedMark]}</p>
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="flex items-center justify-center gap-3 -mt-1">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${MARK_COLORS[currentMark]}`}>
                {MARK_LABELS[currentMark]}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${MARK_COLORS[requestedMark]}`}>
                {MARK_LABELS[requestedMark]}
              </span>
            </div>

            <FormField label="Reason for Correction *" error={error || undefined}>
              <Textarea
                value={reason}
                onChange={(e) => { setReason(e.target.value); setError(""); }}
                rows={3}
                placeholder="Briefly explain why the attendance needs to be corrected…"
              />
            </FormField>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-bold">Note:</span> Correction requests are reviewed by the Super Admin. The attendance record will be updated only after approval.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || requestedMark === currentMark}>
              {isPending ? "Submitting…" : "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CorrectionRequestModal;