import React from "react";
import type { DayTab } from "../types/Homework.types";

interface Props {
  days: DayTab[];
  selectedDate: string;
  onSelect: (dateIso: string) => void;
}

const WeekDayNav: React.FC<Props> = ({ days, selectedDate, onSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1">
      {days.map((day) => {
        const isSelected = day.dateIso === selectedDate;
        return (
          <button
            key={day.dateIso}
            onClick={() => onSelect(day.dateIso)}
            className={`relative flex flex-col items-center justify-center rounded-full px-4 py-2 min-w-[72px] text-sm font-medium transition-all ${
              isSelected
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span>{day.label}</span>
            {day.hasDue && (
              <span
                className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  isSelected ? "bg-white" : "bg-indigo-500"
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default WeekDayNav;