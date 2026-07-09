import { useState, useEffect, useCallback } from "react";
import { useUIStore } from "@/store/uiStore";
import { getAllAcademicYears, selectAcademicYear, type AcademicYearRecord } from "@/services/academicYear.api";
import { queryClient } from "@/config/queryClient";

export type AcademicYearInfo = AcademicYearRecord;

/**
 * The academic year immediately preceding `reference`, chosen by start date.
 * Used to force Carry Forward to always source from the one year right before
 * the target — never an older year further back.
 */
export const getPreviousAcademicYear = <T extends { id: string; startDate: string }>(
  years: T[],
  reference: Pick<T, "id" | "startDate">,
): T | null => {
  const earlier = years
    .filter((y) => y.id !== reference.id && new Date(y.startDate).getTime() < new Date(reference.startDate).getTime())
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  return earlier[0] ?? null;
};

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
    // Update store first so axios interceptor picks up the new year for all refetches
    setActiveYear(year);
    setStoredAcademicYearId(year.id);
    setStoredAcademicYearName(year.yearName);
    setSwitching(false);
    // Invalidate every TanStack Query cache — they'll refetch with the new X-Academic-Year header.
    // Non-Query hooks (useStudents, useClasses, useStaff, useFeeCollection) react via
    // their own useEffect([academicYearId]) subscriptions.
    void queryClient.invalidateQueries();
  };

  const previousYear = activeYear ? getPreviousAcademicYear(years, activeYear) : null;

  return { years, activeYear, previousYear, loading, switching, error, switchYear, retry: load };
};
