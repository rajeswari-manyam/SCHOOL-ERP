import * as React from "react";
import { cn } from "../../utils/cn";

/* =========================
   Helpers
========================= */
const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let d = 1; d <= totalDays; d++) {
    days.push(d);
  }

  return days;
};

/* =========================
   Calendar
========================= */
export interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ value, onChange }) => {
  const [current, setCurrent] = React.useState(value || new Date());

  const days = getDaysInMonth(current);

  const handlePrev = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() - 1));
  };

  const handleNext = () => {
    setCurrent(new Date(current.getFullYear(), current.getMonth() + 1));
  };

  const isSelected = (day: number) =>
    value &&
    day === value.getDate() &&
    current.getMonth() === value.getMonth() &&
    current.getFullYear() === value.getFullYear();

  return (
    <div className="w-72 rounded-md border p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrev}>◀</button>
        <span className="font-medium">
          {current.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </span>
        <button onClick={handleNext}>▶</button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            disabled={!day}
            onClick={() =>
              day &&
              onChange?.(
                new Date(current.getFullYear(), current.getMonth(), day),
              )
            }
            className={cn(
              "h-8 w-8 text-sm rounded-md flex items-center justify-center",
              day ? "hover:bg-gray-100" : "cursor-default",
              isSelected(day!) ? "bg-primary text-white" : "",
            )}
          >
            {day || ""}
          </button>
        ))}
      </div>
    </div>
  );
};
