import { useState, useEffect, useCallback } from "react";
import { fetchClassesList } from "@/services/school-students.api";
import type { ClassOption } from "@/services/school-students.api";

const LOAD_TIMEOUT_MS = 30_000;

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);

export const useClassesList = (academicYearId: string | null) => {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await withTimeout(
          fetchClassesList(academicYearId),
          LOAD_TIMEOUT_MS,
          "fetchClassesList"
        );
        setClasses(data);
        setLoading(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load classes";
        setError(message);
        setLoading(false);
      }
    }, 0);
    return timer;
  }, [academicYearId]);

  useEffect(() => {
    const timer = load();
    return () => window.clearTimeout(timer);
  }, [load]);

  return { classes, loading, error, retry: load };
};
