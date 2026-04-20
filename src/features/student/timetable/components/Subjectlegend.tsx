import type { SubjectLegendItem } from "../types/Classtimetable.types";

interface SubjectLegendProps {
  subjects: SubjectLegendItem[];
}

const SubjectLegend = ({ subjects }: SubjectLegendProps) => (
  <div className="flex flex-wrap items-center gap-4 px-2 py-1">
    {subjects.map((s) => (
      <div key={s.name} className="flex items-center gap-1.5">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${s.dotColor}`} />
        <span className="text-xs font-medium text-gray-600">{s.name}</span>
      </div>
    ))}
  </div>
);

export default SubjectLegend;