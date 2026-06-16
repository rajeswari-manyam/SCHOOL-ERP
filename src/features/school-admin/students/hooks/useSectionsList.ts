import { useState, useEffect, useCallback } from "react";
import { fetchSectionsList } from "@/services/school-students.api";
import type { ClassOption } from "@/services/school-students.api";

const LOAD_TIMEOUT_MS = 30_000;

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);

export const useSectionsList = (classId: string | null) => {
  const [sections, setSections] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    const timer = window.setTimeout(async () => {
      if (!classId) {
        setSections([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await withTimeout(
          fetchSectionsList(classId),
          LOAD_TIMEOUT_MS,
          `fetchSectionsList(${classId})`
        );
        setSections(data);
        setLoading(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load sections";
        setError(message);
        setLoading(false);
      }
    }, 0);
    return timer;
  }, [classId]);

  useEffect(() => {
    const timer = load();
    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [load]);

  return { sections, loading, error, retry: load };
};
