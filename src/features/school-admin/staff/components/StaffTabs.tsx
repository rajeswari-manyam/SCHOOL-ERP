import type { TabKey } from "../types/staff.types";

interface Tab {
  key: TabKey;
  label: string;
  count?: number;
}

interface StaffTabsProps {
  activeTab: TabKey;
  tabs: Tab[];
  onChange: (tab: TabKey) => void;
}

export const StaffTabs = ({ activeTab, tabs, onChange }: StaffTabsProps) => (
  <div className="border-b border-gray-200">
    <div className="flex gap-6 sm:gap-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const isLeave = tab.key === "leave-requests";
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`pb-2.5 text-xs font-medium flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              isActive
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                isLeave
                  ? "bg-amber-100 text-amber-700"
                  : isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);
