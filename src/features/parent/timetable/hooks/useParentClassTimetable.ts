import { useState, useEffect, useCallback } from "react";
import { getAllTimetable } from "@/services/timetable.api";
import { getAllAcademicYears } from "@/services/academicYear.api";
import { mapToClassTimetable } from "@/features/student/timetable/hooks/useClassTimetable";
import type { ClassTimetable } from "@/features/student/timetable/types/Classtimetable.types";

// Same data shape/parsing as the student portal's timetable, but driven by the
// active child's class/section IDs from ParentLayout's context instead of
// resolving them from the logged-in user's own student record.
export const useParentClassTimetable = (
  classId: string | undefined,
  sectionId: string | undefined,
  childName?: string
) => {
  const [data, setData] = useState<ClassTimetable | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const fetch = useCallback(async () => {
    if (!classId || !sectionId) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const { data: years } = await getAllAcademicYears();
      const activeYear = years.find((y) => y.active) ?? years[0];
      const academicYearName = activeYear?.yearName ?? "—";

      const res = await getAllTimetable(classId, sectionId);

      if (res.status && res.data.length > 0) {
        const firstSlot = res.data[0] as any;
        const className = firstSlot?.class?.class_name ?? classId;
        const sectionName = firstSlot?.section?.sectionName ?? sectionId;
        const displayName = childName
          ? `${childName} — Class ${className} – ${sectionName}`
          : `Class ${className} – ${sectionName}`;

        setData(mapToClassTimetable(res.data, displayName, academicYearName));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId, childName]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, isError, refetch: fetch };
};
