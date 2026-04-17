import { useState } from "react";
import { Upload } from "lucide-react";
import AuditLogsTabs from "./components/AuditLogsTabs";
import AuditLogsFilterBar from "./components/AuditLogsFilterBar";
import AuditLogsTable from "./components/AuditLogsTable";
import AuditLogDetailDrawer from "./components/AuditLogDetailDrawer";
import Pagination from "../components/Pagination";
import { useAuditLogs, useExportLogs } from "./hooks/useAuditLogs";
import type { AuditLogsFilters, AuditLog, AuditTab } from "./types/audit-logs.types";
import { Button } from "@/components/ui/button";
const DEFAULT_FILTERS: AuditLogsFilters = {
  search: "",
  action: "ALL",
  actor: "",
  page: 1,
  pageSize: 10,
};

const AuditLogsPage = () => {
  const [activeTab, setActiveTab]   = useState<AuditTab>("api-logs");
  const [filters, setFilters]       = useState<AuditLogsFilters>(DEFAULT_FILTERS);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data, isLoading } = useAuditLogs(filters);
  const { handleExport }    = useExportLogs();

  const patchFilters = (patch: Partial<AuditLogsFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col gap-0 min-h-full -m-4 md:-m-6">

      

      {/* Page content */}
      <div className="flex flex-col gap-6 p-4 md:p-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Audit Logs</h1>
            <p className="text-sm text-gray-500 mt-1">Complete record of all admin actions</p>
          </div>
          <Button
            onClick={() => handleExport(filters)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm self-start sm:self-auto flex-shrink-0"
          >
            <Upload size={15} />
            Export Logs
          </Button>
        </div>

        {/* Filter bar */}
        <AuditLogsFilterBar
          filters={filters}
          onChange={patchFilters}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <AuditLogsTable
            logs={data?.data ?? []}
            isLoading={isLoading}
            onView={setSelectedLog}
          />
          {data && (
            <Pagination
              page={filters.page}
              total={data.total}
              pageSize={filters.pageSize}
              onChange={(p) => patchFilters({ page: p })}
            />
          )}
        </div>
      </div>

      {/* Detail drawer */}
      <AuditLogDetailDrawer
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};

export default AuditLogsPage;
