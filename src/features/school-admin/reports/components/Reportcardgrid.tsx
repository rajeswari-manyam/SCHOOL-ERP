import { REPORT_CARDS, ReportIcons } from "../utils/report-config";
import type { ReportType } from "../types/reports.types";

interface Props {
  onGenerate: (type: ReportType) => void;
}

const ReportCardGrid = ({ onGenerate }: Props) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {REPORT_CARDS.map((card) => {
      const Icon = ReportIcons[card.type];
      return (
        <div
          key={card.type}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-all"
        >
          {/* Icon + optional badge */}
          <div className="flex items-start justify-between gap-2">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg}`}>
              <Icon size={20} />
            </div>
            {card.badge && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide px-2 py-1 rounded-md border shrink-0 ${card.badge.color}`}>
                {card.badge.dot && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                )}
                {card.badge.text}
              </span>
            )}
          </div>

          {/* Title + description */}
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
          </div>

          {/* Period pills */}
          <div className="flex flex-wrap gap-1.5">
            {card.periods.map((p) => (
              <span key={p} className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {p}
              </span>
            ))}
          </div>

          {/* Format checkboxes */}
          <div className="flex items-center gap-5">
            {(["PDF", "CSV"] as const).map((fmt) => {
              const checked = card.formats.includes(fmt);
              return (
                <label key={fmt} className="flex items-center gap-1.5 cursor-default select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-default"
                  />
                  <span className={`text-xs font-semibold ${checked ? "text-gray-700" : "text-gray-400"}`}>
                    {fmt}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Generate button */}
          <button
            onClick={() => onGenerate(card.type)}
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            Generate Report
          </button>
        </div>
      );
    })}
  </div>
);

export default ReportCardGrid;