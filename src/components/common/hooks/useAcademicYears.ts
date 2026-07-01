import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useUIStore } from "@/store/uiStore";
import { getAllAcademicYears, selectAcademicYear, type AcademicYearRecord } from "@/services/academicYear.api";

export type AcademicYearInfo = AcademicYearRecord;

export const useAcademicYears = () => {
  const setStoredAcademicYearId   = useUIStore((s) => s.setAcademicYearId);
  const setStoredAcademicYearName = useUIStore((s) => s.setAcademicYearName);

  const [years,     setYears]     = useState<AcademicYearInfo[]>([]);
  const [activeYear,setActiveYear]= useState<AcademicYearInfo | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [switching, setSwitching] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    getAllAcademicYears()
      .then((res) => {
        const list = res?.status && Array.isArray(res?.data) ? res.data : [];
        setYears(list);

        // Respect the user's persisted selection; fall back to the server-active year
        const savedId   = useUIStore.getState().academicYearId;
        const preferred = list.find((y) => y.id === savedId)
          ?? list.find((y) => y.active)
          ?? list[0]
          ?? null;

        setActiveYear(preferred);
        setStoredAcademicYearId(preferred?.id ?? null);
        setStoredAcademicYearName(preferred?.yearName ?? null);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : "Failed to load academic years";
        console.error("Failed to fetch academic years", err);
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [setStoredAcademicYearId, setStoredAcademicYearName]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const switchYear = async (year: AcademicYearInfo) => {
    if (switching || activeYear?.id === year.id) return;
    setSwitching(true);
    try {
      await selectAcademicYear(year.id);
    } catch {
      // best-effort — backend may not support the endpoint yet; still switch locally
    }
    setActiveYear(year);
    setStoredAcademicYearId(year.id);
    setStoredAcademicYearName(year.yearName);
    setSwitching(false);
    toast.success(`Switched to ${year.yearName} — data reloaded`);
  };

  return { years, activeYear, loading, switching, error, switchYear, retry: load };
};
