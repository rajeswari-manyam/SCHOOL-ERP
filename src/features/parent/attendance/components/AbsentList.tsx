import TrendChart from "./TrendChart";

interface AbsentDay {
  day: number;
  label: string;
  time: string;
}

const ABSENT_BY_MONTH: Record<string, AbsentDay[]> = {
  "2025-04": [
    { day: 5, label: "April 5, 2025 (Saturday)", time: "9:12 AM" },
    { day: 6, label: "April 6, 2025 (Sunday)", time: "8:52 AM" },
  ],
  "2025-03": [
    { day: 3, label: "March 3, 2025 (Monday)", time: "8:47 AM" },
    { day: 17, label: "March 17, 2025 (Monday)", time: "9:05 AM" },
  ],
  "2025-05": [
    { day: 8, label: "May 8, 2025 (Thursday)", time: "8:55 AM" },
  ],
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  currentDate: Date;
  onSelect: (data: AbsentDay) => void;
}

function getMonthKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function AbsentList({ currentDate, onSelect }: Props) {
  const key = getMonthKey(currentDate);
  const absentDays = ABSENT_BY_MONTH[key] ?? [];
  const monthLabel = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div className="space-y-4">
      {/* Absent Days Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3525CD] hover:shadow-md transition">
        <p className="text-[13px] font-semibold text-gray-800 mb-3">
          Absent Days — {monthLabel}
        </p>

        {absentDays.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-10 h-10 rounded-full bg-[#006C49] flex items-center justify-center mb-2">
              ✓
            </div>
            <p className="text-[13px] font-medium text-[#006C49]">
              No absences
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Full attendance this month!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {absentDays.map((item) => (
              <div
                key={item.day}
                onClick={() => onSelect(item)}
                className="bg-red-50 border border-red-100 rounded-lg p-3 cursor-pointer hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white font-bold text-[13px]">
                    {item.day}
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold text-gray-800">
                      {item.label}
                    </p>

                    <p className="text-[11px] text-[#006C49] font-medium mt-1">
                      Alert sent at {item.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trend Chart Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#3525CD] hover:shadow-md transition">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[15px] font-bold text-gray-900">
            Attendance Trend
          </p>
          <span className="text-[11px] text-gray-400 uppercase">
            Last 6 Months
          </span>
        </div>

        <TrendChart />
      </div>
    </div>
  );
}