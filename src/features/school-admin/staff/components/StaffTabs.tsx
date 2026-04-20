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

export const StaffTabs = ({ activeTab, tabs, onChange }: StaffTabsProps) => {
  return (
    <div className="flex space-x-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              isActive
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-800 hover:bg-white/50"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};