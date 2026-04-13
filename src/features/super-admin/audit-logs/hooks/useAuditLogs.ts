import { useQuery } from "@tanstack/react-query";
import { auditLogsApi } from "../api/audit-logs.api";
import type { AuditLogsFilters } from "../types/audit-logs.types";

export const AUDIT_KEYS = {
  all:    ["super-admin", "audit-logs"] as const,
  list:   (f: Partial<AuditLogsFilters>) => [...AUDIT_KEYS.all, "list", f] as const,
  detail: (id: string) => [...AUDIT_KEYS.all, "detail", id] as const,
};

export const useAuditLogs = (filters: Partial<AuditLogsFilters>) =>
  useQuery({
    queryKey: AUDIT_KEYS.list(filters),
    queryFn:  () => auditLogsApi.getLogs(filters),
    staleTime: 1000 * 30,
    placeholderData: (prev) => prev,
  });

export const useAuditLog = (id: string) =>
  useQuery({
    queryKey: AUDIT_KEYS.detail(id),
    queryFn:  () => auditLogsApi.getLog(id),
    enabled: !!id,
  });

export const useExportLogs = () => {
  const handleExport = async (filters: Partial<AuditLogsFilters>) => {
    const blob = await auditLogsApi.exportLogs(filters);
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return { handleExport };
};
