import { useHomeworkStore } from "../store/HomeWork.store";
import { DAYS } from "../data/HomeWork.data";

export function DayFilter() {
  const { day, setDay } = useHomeworkStore();

  return (
    <div className="flex gap-1.5">
      {DAYS.map(({ day: d, label }) => (
        <button
          key={d}
          onClick={() => setDay(d)}
          className={`flex flex-col items-center px-4 py-2 rounded-xl text-xs font-semibold transition-all min-w-[52px] ${
            day === d
              ? "bg-[#3525CD] text-white shadow-sm"
              : "bg-white border border-[#E8EBF2] text-gray-400 hover:border-[#3525CD] hover:text-[#3525CD]"
          }`}
        >
          <span className="text-[10px] font-medium mb-0.5 opacity-70">{label}</span>
          <span className="text-[15px] font-bold leading-none">{d}</span>
          {/* dot indicator for days with homework */}
          <span
            className={`w-1 h-1 rounded-full mt-1 ${
              day === d ? "bg-white/60" : "bg-[#3525CD]/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}