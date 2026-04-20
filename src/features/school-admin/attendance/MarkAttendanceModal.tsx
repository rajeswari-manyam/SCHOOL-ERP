import { useState } from "react";
import { useAttendanceMutations } from "./hooks/useAttendance.ts";
import { MarkAttendanceForm } from "./components/MarkAttendanceForm";

export default function MarkAttendanceModal() {
  const [isOpen, setIsOpen] = useState(true);
  const { markAttendance }  = useAttendanceMutations();

  if (!isOpen) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors active:scale-95"
        >
          Open Mark Attendance
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/80 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Mark Attendance — Web Form
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Backup method when WhatsApp is unavailable
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>
        <MarkAttendanceForm
          onSubmit={(values) =>
            markAttendance.mutate(values, {
              onSuccess: () => setIsOpen(false),
            })
          }
          isSubmitting={markAttendance.isPending}
        />
      </div>
    </div>
  );
}