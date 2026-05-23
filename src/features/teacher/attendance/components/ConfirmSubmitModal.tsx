// teacher/attendance/components/ConfirmSubmitModal.tsx
import { format } from "date-fns";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AttStatus = "PRESENT" | "ABSENT" | "HALF_DAY";

interface Student { id: string; name: string; rollNo: string; waNumber: string; }

interface ConfirmSubmitModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  classLabel: string;
  date: string;
  records: Record<string, AttStatus>;
  students: Student[];
}

const ConfirmSubmitModal = ({
  open, onClose, onConfirm, isPending,
  classLabel, date, records, students,
}: ConfirmSubmitModalProps) => {
  if (!open) return null;

  const presentCount  = Object.values(records).filter((v) => v === "PRESENT").length;
  const absentCount   = Object.values(records).filter((v) => v === "ABSENT").length;
  const halfDayCount  = Object.values(records).filter((v) => v === "HALF_DAY").length;
  const absentStudents = students.filter((s) => records[s.id] === "ABSENT");
  const totalCount    = students.length;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Confirm Submission</h2>
              <p className="text-xs text-gray-400 mt-0.5">Review before marking attendance</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={16} className="text-current" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 space-y-4">
            {/* Class + Date */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Class</p>
                <p className="font-bold text-gray-900">{classLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Date</p>
                <p className="font-bold text-gray-900">{format(new Date(date), "dd MMM yyyy")}</p>
              </div>
            </div>

            {/* Count summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-emerald-50 rounded-xl px-3 py-3 text-center border border-emerald-100">
                <p className="text-xl font-extrabold text-emerald-600">{presentCount}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide mt-0.5">Present</p>
              </div>
              <div className="bg-red-50 rounded-xl px-3 py-3 text-center border border-red-100">
                <p className="text-xl font-extrabold text-red-500">{absentCount}</p>
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-wide mt-0.5">Absent</p>
              </div>
              <div className="bg-amber-50 rounded-xl px-3 py-3 text-center border border-amber-100">
                <p className="text-xl font-extrabold text-amber-500">{halfDayCount}</p>
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide mt-0.5">Half Day</p>
              </div>
            </div>

            {/* Absent students with WA numbers */}
            {absentStudents.length > 0 && (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Absent Students ({absentStudents.length}) — WA alerts will be sent
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {absentStudents.map((s) => (
                    <div key={s.id} className="flex items-center gap-2.5 bg-red-50 rounded-xl px-3 py-2.5 border border-red-100">
                      <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                        {s.rollNo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{s.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{s.waNumber}</p>
                      </div>
                      {/* WA alert indicator */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <MessageCircle size={14} className="text-[#25d366]" />
                        <span className="text-[9px] text-[#25d366] font-semibold">Alert</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
              <span>Total students: <span className="font-bold text-gray-700">{totalCount}</span></span>
              <span>Attendance: <span className="font-bold text-emerald-600">{totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%</span></span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-t border-gray-100 gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isPending}>
              {isPending ? "Submitting…" : "Confirm & Submit"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmSubmitModal;