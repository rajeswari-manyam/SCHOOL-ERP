import { format, parseISO, isToday, isTomorrow, differenceInDays } from "date-fns";

interface DueBadgeProps {
  dateStr: string;
  isPast: boolean;
}

const DueBadge = ({ dateStr, isPast }: DueBadgeProps) => {
  if (isPast) return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-[11px] font-bold">
      Closed
    </span>
  );
  const d = parseISO(dateStr);
  if (isToday(d))    return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-bold border border-red-200">Due Today</span>;
  if (isTomorrow(d)) return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold border border-amber-200">Due Tomorrow</span>;
  const diff = differenceInDays(d, new Date());
  if (diff <= 3)     return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 text-[11px] font-bold border border-orange-200">Due in {diff}d</span>;
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold border border-indigo-200">Due {format(d, "d MMM")}</span>;
};

export default DueBadge;
