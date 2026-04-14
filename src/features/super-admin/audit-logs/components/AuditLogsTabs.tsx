import { cn } from "@/utils/cn";
import type { AuditTab } from "../types/audit-logs.types";
import { Button } from "@/components/ui/button";

interface AuditLogsTabsProps {
  activeTab: AuditTab;
  onChange: (tab: AuditTab) => void;
}

const TABS: { value: AuditTab; label: string }[] = [
  { value: "overview",   label: "Overview" },
  { value: "security",   label: "Security" },
  { value: "api-logs",   label: "API Logs" },
];

const AuditLogsTabs = ({ activeTab, onChange }: AuditLogsTabsProps) => (
  <div className="flex items-center gap-1">
    <span className="text-sm font-semibold text-gray-700 mr-2">Audit Logs</span>
    <span className="text-gray-300 mr-2">/</span>
    {TABS.map((tab) => (
      <Button
        key={tab.value}
        onClick={() => onChange(tab.value)}
        className={cn(
          "px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors",
          activeTab === tab.value
            ? "text-indigo-600 bg-indigo-50"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        )}
      >
        {tab.label}
      </Button>
    ))}
  </div>
);

export default AuditLogsTabs;
