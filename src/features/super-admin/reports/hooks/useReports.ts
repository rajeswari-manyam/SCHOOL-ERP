import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportsApi } from "../api/reports.api";
import type { GenerateReportPayload } from "../types/reports.types";

export const REPORTS_KEYS = {
  all: ["super-admin", "reports"] as const,
  list: (page: number) => [...REPORTS_KEYS.all, "list", page] as const,
};

export const useReports = (page: number, pageSize = 4) =>
  useQuery({
    queryKey: REPORTS_KEYS.list(page),
    queryFn: () => reportsApi.getReports(page, pageSize),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

export const useGenerateReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateReportPayload) => reportsApi.generateReport(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: REPORTS_KEYS.all }),
  });
};

export const useDownloadReport = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const download = async (id: string, name: string, format: string) => {
    setLoadingId(id);
    try {
      const blob = await reportsApi.downloadReport(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.${format.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingId(null);
    }
  };

  return { download, loadingId };
};
