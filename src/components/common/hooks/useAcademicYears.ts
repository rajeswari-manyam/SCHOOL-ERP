import { useState, useEffect, useCallback } from "react";
import { useUIStore } from "@/store/uiStore";
import { getAllAcademicYears, type AcademicYearRecord } from "@/services/academicYear.api";

export type AcademicYearInfo = AcademicYearRecord;

export const useAcademicYears = () => {
  const setStoredAcademicYearId = useUIStore((state) => state.setAcademicYearId);
  const [years, setYears] = useState<AcademicYearInfo[]>([]);
  const [activeYear, setActiveYear] = useState<AcademicYearInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    getAllAcademicYears()
      .then((res) => {
        const list = res?.status && Array.isArray(res?.data) ? res.data : [];
        setYears(list);

        const nextActive = list.find((year) => year.active) || list[0] || null;
        setActiveYear(nextActive);
        setStoredAcademicYearId(nextActive?.id ?? null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
            ? (err as { message: string }).message
            : 'Failed to load academic years';

        console.error('Failed to fetch academic years', err);
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [setStoredAcademicYearId]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const switchYear = (year: AcademicYearInfo) => {
    setActiveYear(year);
    setStoredAcademicYearId(year.id);
  };

  return { years, activeYear, loading, error, switchYear, retry: load };
};
