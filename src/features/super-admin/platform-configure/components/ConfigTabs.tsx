import { cn } from "@/utils/cn";
import type { ConfigTab } from "../types/config.types";

const TABS: { value: ConfigTab; label: string }[] = [
  { value: "integrations",   label: "Integrations" },
  { value: "wa-templates",   label: "WA Templates" },
  { value: "feature-flags",  label: "Feature Flags" },
  { value: "n8n-workflows",  label: "n8n Workflows" },
];

interface ConfigTabsProps { activeTab: ConfigTab; onChange: (t: ConfigTab) => void; }

const ConfigTabs = ({ activeTab, onChange }: ConfigTabsProps) => (
  <div className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 gap-1">
    {TABS.map((t) => (
      <button key={t.value} onClick={() => onChange(t.value)}
        className={cn(
          "px-4 py-2 rounded-xl text-sm font-semibold transition-all",
          activeTab === t.value
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        )}>
        {t.label}
      </button>
    ))}
  </div>
);

export default ConfigTabs;
