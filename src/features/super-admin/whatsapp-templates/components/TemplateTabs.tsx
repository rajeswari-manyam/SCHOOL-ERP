import { cn } from "@/utils/cn";
import type { TemplateTab } from "../types/templates.types";

interface TemplateTabsProps {
  activeTab: TemplateTab;
  onChange: (tab: TemplateTab) => void;
}

const TABS: { value: TemplateTab; label: string }[] = [
  { value: "all",       label: "All Templates" },
  { value: "pending",   label: "Pending Approval" },
  { value: "rejected",  label: "Rejected" },
  { value: "by-school", label: "By School" },
];

const TemplateTabs = ({ activeTab, onChange }: TemplateTabsProps) => (
  <div className="flex items-center gap-0 border-b border-gray-200">
    {TABS.map((tab) => (
      <button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={cn(
          "px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors -mb-px",
          activeTab === tab.value
            ? "border-indigo-600 text-indigo-600"
            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default TemplateTabs;
