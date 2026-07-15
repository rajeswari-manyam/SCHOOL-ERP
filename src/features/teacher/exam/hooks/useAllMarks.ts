import { useQuery } from "@tanstack/react-query";
import { examMarksApi } from "@/services/teacher-exam-marks.api";
import type {
  GetAllMarksQuery,
  MarksRecordItem,
  SubmittedExam,
  ExamStatus,
} from "../types/exam-marks.types";

export const ALL_MARKS_KEYS = {
  all: ["teacher", "all-marks"] as const,
  list: (query: GetAllMarksQuery) => [...ALL_MARKS_KEYS.all, query] as const,
};

export function useAllMarks(query: GetAllMarksQuery, enabled: boolean) {
  return useQuery({
    queryKey: ALL_MARKS_KEYS.list(query),
    queryFn: () => examMarksApi.getAllMarks(query),
    staleTime: 1000 * 60 * 2,
    retry: 1,
    // exam_id is optional — only require class + section + subject
    enabled: enabled && Boolean(query.class_id && query.section_id && query.subject_id),
  });
}

/**
 * Maps the /tenant/getallmarks summary records directly to SubmittedExam rows.
 *
 * API returns one record per exam:
 *   { id, examName, academicYear, className, subjectName, examDate,
 *     marksEntered, totalStudents, averageMarks, completionPercentage, status }
 *
 * No grouping needed — each record IS one submitted exam row.
 */
export function marksToSubmittedExam(
  items: MarksRecordItem[],
  fallbackClassName?: string,
  fallbackSubject?: string,
  fallbackExamType?: string,
): SubmittedExam[] {
  if (!items || items.length === 0) return [];

  return items.map((item) => {
    const rawStatus = (item.status ?? "SUBMITTED").toUpperCase();
    const validStatuses: ExamStatus[] = ["DRAFT", "SUBMITTED", "APPROVED", "PUBLISHED"];
    const status: ExamStatus = validStatuses.includes(rawStatus as ExamStatus)
      ? (rawStatus as ExamStatus)
      : "SUBMITTED";

    return {
      id:                   item.id,
      examId:               item.examId ?? "",
      examType:             fallbackExamType ?? item.examName ?? "",
      examLabel:            item.examName    ?? "Exam",
      className:            item.className   ?? fallbackClassName ?? "",
      subject:              item.subjectName ?? fallbackSubject   ?? "",
      academicYear:         item.academicYear ?? "",
      academicYearId:       item.academicYearId ?? "",
      submittedOn:          item.examDate    ?? "",
      status,
      totalStudents:        item.totalStudents        ?? 0,
      appeared:             item.marksEntered         ?? 0,
      average:              item.averageMarks         ?? 0,
      // API doesn't return passRate directly — use completionPercentage as proxy,
      // or 0 if absent. Override once the backend exposes it.
      passRate:             0,
      completionPercentage: item.completionPercentage ?? 0,
    };
  });
}
