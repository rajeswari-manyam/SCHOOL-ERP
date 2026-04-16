// teacher/attendance/components/ConfirmSubmitModal.tsx
import { format } from "date-fns";
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
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
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#25d366">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
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