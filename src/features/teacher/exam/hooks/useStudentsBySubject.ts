import { useQuery } from "@tanstack/react-query";
import { examMarksApi } from "../api/exam-marks.api";
import type {
  StudentsBySubjectQuery,
  StudentsBySubjectItem,
  StudentMarkEntry,
} from "../types/exam-marks.types";

export const STUDENTS_BY_SUBJECT_KEYS = {
  all: ["teacher", "students-by-subject"] as const,
  list: (query: StudentsBySubjectQuery) =>
    [...STUDENTS_BY_SUBJECT_KEYS.all, query] as const,
};

export function useStudentsBySubject(query: StudentsBySubjectQuery) {
  const enabled = Boolean(
    query.class_id &&
    query.section_id &&
    query.subject_id &&
    query.academicYearId &&
    query.exam_id,
  );

  return useQuery({
    queryKey: STUDENTS_BY_SUBJECT_KEYS.list(query),
    queryFn: () => examMarksApi.getStudentsBySubject(query),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  });
}

export function mapToStudentMarkEntriesFromSubject(items: StudentsBySubjectItem[]): StudentMarkEntry[] {
  return items.map((item) => ({
    studentId: item.studentId ?? item.id ?? "",
    rollNo: item.rollNo ?? "",
    name: item.studentName ?? "",
    marks: "",
    maxMarks: 100,
    grade: null,
    remarks: "",
    isAbsent: false,
  }));
}
