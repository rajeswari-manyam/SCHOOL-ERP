import { useQuery } from "@tanstack/react-query";
import { examMarksApi } from "../api/exam-marks.api";
import type {
  ClassStudentResultsQuery,
  StudentResultItem,
} from "../types/exam-marks.types";

export const CLASS_RESULTS_KEYS = {
  all:     ["teacher", "class-student-results"] as const,
  results: (query: ClassStudentResultsQuery) =>
    [...CLASS_RESULTS_KEYS.all, query] as const,
};

export function useClassStudentResults(query: ClassStudentResultsQuery) {
  const enabled = Boolean(
    query.className &&
    query.sectionName &&
    query.subjectName &&
    query.academicYear &&
    query.exam_type,
  );

  return useQuery({
    queryKey: CLASS_RESULTS_KEYS.results(query),
    queryFn: () => examMarksApi.getClassStudentResults(query),
    staleTime: 1000 * 60 * 5,
    retry: 2,
    enabled,
  });
}

export function mapToStudentMarkEntries(items: StudentResultItem[]) {
  return items.map((item) => ({
    studentId: item.studentId ?? item.id ?? "",
    rollNo: item.rollNo ?? "",
    name: item.studentName ?? "",
    marks: (item.marks != null ? item.marks : "") as number | "",
    maxMarks: item.maxMarks ?? 100,
    grade: (item.grade || null) as import("../types/exam-marks.types").Grade | null,
    remarks: item.remarks ?? "",
    isAbsent: item.isAbsent ?? false,
  }));
}
