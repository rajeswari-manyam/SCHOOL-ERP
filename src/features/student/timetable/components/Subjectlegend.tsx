import type { SubjectLegendItem } from "../types/Classtimetable.types";

interface SubjectLegendProps {
  subjects: SubjectLegendItem[];
}

const SubjectLegend = ({ subjects }: SubjectLegendProps) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-4 px-2 py-2 sm:py-1">

    {subjects.map((s) => (
      <div
        key={s.name}
        className="
          flex items-center gap-1.5
          px-2 py-1 rounded-full
          border border-transparent
          transition-all duration-200
          hover:border-indigo-200
          hover:bg-indigo-50/30
          hover:shadow-sm
          hover:-translate-y-0.5
          active:scale-[0.98]
          min-w-[fit-content]
          touch-manipulation
        "
      >
        {/* Color Dot */}
        <span
          className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dotColor}`}
        />

        {/* Label */}
        <span className="text-xs sm:text-sm font-medium text-gray-600 whitespace-nowrap">
          {s.name}
        </span>
      </div>
    ))}

  </div>
);

export default SubjectLegend;