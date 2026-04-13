import { cn } from "@/utils/cn";
import type { MarketingTab } from "../types/marketing.types";

const TABS: { value: MarketingTab; label: string }[] = [
  { value: "team-overview", label: "Team Overview" },
  { value: "attendance",    label: "Attendance" },
  { value: "targets",       label: "Targets & Performance" },
  { value: "payouts",       label: "Payouts" },
];

interface MarketingTabsProps { activeTab: MarketingTab; onChange: (t: MarketingTab) => void; }

const MarketingTabs = ({ activeTab, onChange }: MarketingTabsProps) => (
  <div className="flex items-center gap-0 border-b border-gray-200">
    {TABS.map((t) => (
      <button key={t.value} onClick={() => onChange(t.value)}
        className={cn(
          "px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors",
          activeTab === t.value
            ? "border-indigo-600 text-indigo-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        )}>
        {t.label}
      </button>
    ))}
  </div>
);

export default MarketingTabs;
