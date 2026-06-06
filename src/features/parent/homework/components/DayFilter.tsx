import { useHomeworkStore } from "../store/HomeWork.store";

// Generate Mon–Fri of the current week dynamically
function getCurrentWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Get Monday of this week
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI"];

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      day: d.getDate(),
      month: d.getMonth(),         // 0-indexed
      year: d.getFullYear(),
      label: DAY_LABELS[i],
      date: d,                     // full Date object for comparison
    };
  });
}

// Check if a given day number matches the homework's submission date
// The store's `day` is just a getDate() number — we store full date in selectedDate
function isSameDay(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function DayFilter() {
  const { selectedDate, setSelectedDate } = useHomeworkStore();
  const weekDays = getCurrentWeekDays();

  // Default: today if not yet set
  const activeDate = selectedDate ?? new Date();

  return (
    <div className="flex gap-1.5">
      {weekDays.map(({ day, label, date }) => {
        const isActive = isSameDay(date, activeDate);
        const isToday = isSameDay(date, new Date());

        return (
          <button
            key={`${label}-${day}`}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs font-semibold transition-all min-w-[52px] ${
              isActive
                ? "bg-[#3525CD] text-white shadow-sm"
                : "bg-white border border-[#E8EBF2] text-gray-400 hover:border-[#3525CD] hover:text-[#3525CD]"
            }`}
          >
            <span className="text-[10px] font-medium mb-0.5 opacity-70">{label}</span>
            <span className="text-[15px] font-bold leading-none">{day}</span>
            {/* dot: filled for today, faint for others */}
            <span
              className={`w-1 h-1 rounded-full mt-1 ${
                isActive
                  ? "bg-white/60"
                  : isToday
                  ? "bg-[#3525CD]"
                  : "bg-[#3525CD]/20"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
