import { REPORT_CARDS, ReportIcons } from "../utils/report-config";
import type { ReportType } from "../types/reports.types";

interface ReportCardGridProps {
  onGenerate: (type: ReportType) => void;
}

const ReportCardGrid = ({ onGenerate }: ReportCardGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {REPORT_CARDS.map(({ type, title, description, iconBg }) => {
      const Icon = ReportIcons[type];
      return (
        <button
          key={type}
          onClick={() => onGenerate(type)}
          className="group text-left bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-indigo-100 transition-all duration-200 flex flex-col gap-4"
        >
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-105 transition-transform duration-200`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
          </div>
        </button>
      );
    })}
  </div>
);

export default ReportCardGrid;
