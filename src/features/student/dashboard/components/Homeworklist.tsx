import type { HomeworkItem } from "../types/dashboard.types";
import { BookOpen, Calculator, FlaskConical, Download } from "lucide-react";

interface Props {
  data: HomeworkItem[];
}

const BRAND = "#3525CD";
const CARD_BG = "#EEF0FF";
const ICON_BG = "#DDE0FF";

const subjectIconMap: Record<HomeworkItem["colorType"], React.ReactNode> = {
  blue: <BookOpen size={20} color={BRAND} strokeWidth={2} />,
  green: <Calculator size={20} color={BRAND} strokeWidth={2} />,
  amber: <FlaskConical size={20} color={BRAND} strokeWidth={2} />,
};

export const HomeworkList = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 transition-all duration-200 md:hover:border-[#3525CD] md:hover:shadow-md">
      
      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
        Homework Due This Week
      </h3>

      {/* List */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {data.map((hw) => (
          <div
            key={hw.id}
            className="
              flex flex-col sm:flex-row sm:items-center
              gap-3 sm:gap-4
              rounded-xl p-3 sm:px-4 sm:py-4
              transition-all duration-200
              md:hover:shadow-sm md:hover:-translate-y-[2px]
              cursor-pointer
            "
            style={{ backgroundColor: CARD_BG }}
          >
            {/* Icon */}
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: ICON_BG }}
            >
              {subjectIconMap[hw.colorType]}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-snug truncate">
                {hw.subject}: {hw.title}
              </p>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                Due: {hw.dueDate}
              </p>
            </div>

            {/* Button */}
            <button
              className="
                flex items-center justify-center gap-1.5
                text-xs font-semibold
                rounded-lg sm:rounded-xl
                px-3 py-2 sm:px-4 sm:py-2.5
                w-full sm:w-auto
                whitespace-nowrap
                transition-all duration-200
                md:hover:bg-[#3525CD] md:hover:text-white
              "
              style={{
                color: BRAND,
                backgroundColor: "white",
                border: `1.5px solid ${BRAND}`,
              }}
            >
              <Download size={14} strokeWidth={2.5} />
              Download Brief
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};