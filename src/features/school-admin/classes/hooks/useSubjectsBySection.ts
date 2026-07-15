import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSubjectsBySectionId } from "@/services/class.api";
import type { SubjectItem } from "../types/classes.types";

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);

const LOAD_TIMEOUT_MS = 30_000;

export const useSubjectsBySection = (
  sectionId: string | null,
  onSubjectsLoaded?: (sectionId: string, subjects: SubjectItem[]) => void
) => {
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onLoadedRef = useRef(onSubjectsLoaded);

  useEffect(() => {
    onLoadedRef.current = onSubjectsLoaded;
  });

  const load = useCallback(async () => {
    if (!sectionId) {
      setSubjects([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await withTimeout(
        fetchSubjectsBySectionId(sectionId),
        LOAD_TIMEOUT_MS,
        `fetchSubjectsBySectionId(${sectionId})`
      );
      setSubjects(data);
      onLoadedRef.current?.(sectionId, data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load subjects";
      setError(message);
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return { subjects, loading, error, refresh: load };
};
