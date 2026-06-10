import { useState, useEffect, useCallback, useRef } from "react";
import { useUIStore } from "@/store/uiStore";
import * as classesApi from "../api/classes.api";
import type { ClassItem, SectionItem, SubjectItem, CreateClassPayload, AddSectionPayload, AddSubjectPayload } from "../types/classes.types";

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);

const LOAD_TIMEOUT_MS = 30_000;

export const useClasses = () => {
  const academicYearId = useUIStore((state) => state.academicYearId);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadClasses = useCallback(() => {
    setLoading(true);
    setError(null);

    const doLoad = async () => {
      try {
        const data = await withTimeout(
          classesApi.fetchClasses(academicYearId),
          LOAD_TIMEOUT_MS,
          "fetchClasses"
        );
        if (mountedRef.current) {
          setClasses(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (mountedRef.current) {
          const message = err instanceof Error ? err.message : "Failed to load classes";
          setError(message);
          setLoading(false);
        }
      }
    };

    void doLoad();
  }, [academicYearId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadClasses();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadClasses]);

  const handleAddClass = async (data: CreateClassPayload) => {
    const newClass = await classesApi.addClass(data);
    if (mountedRef.current) {
      setClasses((prev) => [...prev, newClass]);
    }
    return newClass;
  };

  const handleAddSection = async (className: string, payload: AddSectionPayload) => {
    const newSection = await classesApi.addSection(payload);
    if (mountedRef.current) {
      setClasses((prev) =>
        prev.map((c) =>
          c.className === className
            ? { ...c, sections: [...c.sections, newSection] }
            : c
        )
      );
    }
    return newSection;
  };

  const handleAddSubject = async (payload: AddSubjectPayload) => {
    const newSubject = await classesApi.addSubject(payload);
    if (mountedRef.current) {
      setClasses((prev) =>
        prev.map((c) =>
          c.id === payload.class_id
            ? {
                ...c,
                sections: c.sections.map((s) =>
                  s.id === payload.sectionid
                    ? { ...s, subjects: [...s.subjects, newSubject] }
                    : s
                ),
              }
            : c
        )
      );
    }
    return newSubject;
  };

  const updateClassSections = (classId: string, sections: SectionItem[]) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId ? { ...c, sections } : c
      )
    );
  };

  const updateSectionSubjects = (sectionId: string, subjects: SubjectItem[]) => {
    setClasses((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) =>
          s.id === sectionId ? { ...s, subjects } : s
        ),
      }))
    );
  };

  const stats = {
    totalClasses: classes.length,
    totalSections: classes.reduce((sum, c) => sum + (c.sections?.length || 0), 0),
    totalSubjects: classes.reduce((sum, c) => sum + (c.sections?.reduce((ss, s) => ss + (s.subjects?.length || 0), 0) || 0), 0),
    totalStudents: classes.reduce((sum, c) => sum + (c.totalStudents || 0), 0),
  };

  return {
    classes,
    loading,
    error,
    stats,
    loadClasses,
    addClass: handleAddClass,
    addSection: handleAddSection,
    addSubject: handleAddSubject,
    updateClassSections,
    updateSectionSubjects,
  };
};
