import { useState, useEffect, useCallback, useRef } from "react";
import { fetchSectionsByClassId } from "../api/classes.api";
import type { SectionItem } from "../types/classes.types";

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);

const LOAD_TIMEOUT_MS = 30_000;

export const useSectionsByClass = (
  classId: string | null,
  onSectionsLoaded?: (classId: string, sections: SectionItem[]) => void
) => {
  const [sections, setSections] = useState<SectionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onLoadedRef = useRef(onSectionsLoaded);

  useEffect(() => {
    onLoadedRef.current = onSectionsLoaded;
  });

  const load = useCallback(async () => {
    if (!classId) {
      setSections([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await withTimeout(
        fetchSectionsByClassId(classId),
        LOAD_TIMEOUT_MS,
        `fetchSectionsByClassId(${classId})`
      );
      setSections(data);
      onLoadedRef.current?.(classId, data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load sections";
      setError(message);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  return { sections, loading, error, refresh: load };
};
