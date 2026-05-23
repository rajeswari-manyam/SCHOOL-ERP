import { format, parseISO, isToday, isTomorrow } from "date-fns";
import type { HomeworkItem } from "../types/teacher-dashboard.types";

const dueLabel = (dateStr: string) => {
  const d = parseISO(dateStr);
  if (isToday(d))    return { text: "Due Today",    color: "text-red-500" };
  if (isTomorrow(d)) return { text: "Due Tomorrow", color: "text-amber-500" };
  return { text: `Due ${format(d, "d MMM")}`, color: "text-gray-400" };
};

const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-gray-400 min-w-[36px] text-right">{value}/{max}</span>
    </div>
  );
};

const HomeworkDueCard = ({ items }: { items: HomeworkItem[] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h3 className="text-sm font-extrabold text-gray-900 mb-4">Homework Due This Week</h3>
    {items.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-4">No homework due this week 🎉</p>
    ) : (
      <div className="flex flex-col gap-4">
        {items.map((hw) => {
          const due = dueLabel(hw.dueDate);
          return (
            <div key={hw.id} className="flex flex-col gap-0.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">{hw.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{hw.subject} · {hw.class}</p>
                </div>
                <span className={`text-[11px] font-bold flex-shrink-0 ${due.color}`}>{due.text}</span>
              </div>
              <ProgressBar value={hw.submittedCount} max={hw.totalCount} />
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default HomeworkDueCard;
