import type { HomeworkItem } from "../types/dashboard.types";

interface Props {
  data: HomeworkItem[];
}

const iconMap: Record<HomeworkItem["colorType"], { icon: string; bg: string; text: string }> = {
  blue: { icon: "📄", bg: "bg-blue-100", text: "text-blue-700" },
  green: { icon: "📐", bg: "bg-green-100", text: "text-green-700" },
  amber: { icon: "🔬", bg: "bg-amber-100", text: "text-amber-700" },
};

export const HomeworkList = ({ data }: Props) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">Homework Due This Week</h3>
      </div>

      <div className="space-y-0">
        {data.map((hw, idx) => {
          const style = iconMap[hw.colorType];
          return (
            <div
              key={hw.id}
              className={`flex items-center gap-3 py-3 ${
                idx < data.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${style.bg}`}
              >
                {style.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {hw.subject}: {hw.title}
                </p>
                <p className="text-[11px] text-gray-400">{hw.dueDate}</p>
              </div>
              <button className="flex items-center gap-1 text-[11px] text-blue-600 border border-blue-200 rounded-md px-2.5 py-1 hover:bg-blue-50 transition-colors whitespace-nowrap">
                ⬇ Download Brief
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
