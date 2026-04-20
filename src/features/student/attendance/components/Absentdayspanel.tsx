import type { AbsentDayDetail } from "../types/Attendance.types";

interface AbsentDaysPanelProps {
  absentDays: AbsentDayDetail[];
  month: string;
  year: number;
  motivationalMessage: string;
}

const WHATSAPP_GREEN = "#25D366";

const AbsentDaysPanel = ({
  absentDays,
  month,
  year,
  motivationalMessage,
}: AbsentDaysPanelProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h2 className="text-sm font-bold text-gray-900">
        Absent Days — {month} {year}
      </h2>

      {absentDays.length === 0 ? (
        <p className="text-sm text-gray-500">No absences this month 🎉</p>
      ) : (
        <div className="flex flex-col gap-3">
          {absentDays.map((day, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border p-4 flex flex-col gap-1"
            >
              <p className="text-sm font-semibold text-gray-900">{day.date}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                {/* WhatsApp icon placeholder */}
                <span
                  className="w-4 h-4 rounded flex items-center justify-center text-white text-[9px] font-bold"
                  style={{ backgroundColor: WHATSAPP_GREEN }}
                >
                  W
                </span>
                Alert sent {day.alertSentAt} via {day.alertChannel}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Motivational card */}
      <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between gap-3 mt-auto">
        <p className="text-sm font-semibold text-indigo-700">{motivationalMessage}</p>
        <div className="text-indigo-400 text-2xl shrink-0">🎓</div>
      </div>
    </div>
  );
};

export default AbsentDaysPanel;