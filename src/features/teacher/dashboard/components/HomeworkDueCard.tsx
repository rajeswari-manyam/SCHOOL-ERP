import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { RefreshCw, AlertCircle, BookOpen } from "lucide-react";
import { useAllHomeworkList } from "../hooks/useTeacherDashboard";

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

const Skeleton = () => (
  <div className="flex flex-col gap-4 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-1.5 bg-gray-100 rounded-full w-full" />
      </div>
    ))}
  </div>
);

interface HomeworkDueCardProps {
  teacherId: string;
}

const HomeworkDueCard = ({ teacherId }: HomeworkDueCardProps) => {
  const { data: items = [], isLoading, isError, refetch } = useAllHomeworkList(teacherId);
  const errorMessage = isError ? "Failed to load homework" : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-gray-900">
          Homework Due
          {items.length > 0 && <span className="text-gray-400 font-normal ml-1">({items.length})</span>}
        </h3>
        {errorMessage && (
          <button
            onClick={() => refetch()}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        )}
      </div>

      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <AlertCircle size={28} className="text-red-400" />
          <p className="text-sm text-gray-500">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold mt-1"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <BookOpen size={28} className="text-gray-300" />
          <p className="text-sm text-gray-400">No pending homework 🎉</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((hw) => {
            const due = dueLabel(hw.dueDate);
            return (
              <div key={hw.id} className="flex flex-col gap-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{hw.title}</p>
                    <p className="text-[10px] text-gray-400">{hw.subject} · {hw.class}</p>
                  </div>
                  <span className={`text-[10px] font-bold flex-shrink-0 ${due.color}`}>{due.text}</span>
                </div>
                <ProgressBar value={hw.submittedCount} max={hw.totalCount} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HomeworkDueCard;