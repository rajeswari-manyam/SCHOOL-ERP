import { useQuery } from "@tanstack/react-query";
import { examMarksApi } from "../api/exam-marks.api";
import type { GetAllMarksQuery, MarksRecordItem, SubmittedExam, ExamStatus } from "../types/exam-marks.types";

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
    enabled: enabled && Boolean(query.class_id && query.exam_id && query.subject_id && query.section_id),
  });
}

export function marksToSubmittedExam(items: MarksRecordItem[], className?: string, subjectName?: string, examType?: string): SubmittedExam[] {
  if (!items || items.length === 0) return [];

  const grouped = new Map<string, MarksRecordItem[]>();
  for (const item of items) {
    const key = `${item.examId ?? "?"}-${item.subjectName ?? subjectName ?? "?"}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  return Array.from(grouped.entries()).map(([key, group], i) => {
    const appeared = group.filter((m) => !m.isAbsent && m.marksObtained != null);
    const marksArr = appeared.map((m) => m.marksObtained!);
    const passArr = marksArr.filter((m) => m >= 40);
    const total = group.length;

    return {
      id: key,
      examType: examType ?? "FINAL",
      examLabel: group[0]?.examName ?? items[0]?.examName ?? `Exam ${i + 1}`,
      className: className ?? group[0]?.className ?? "",
      subject: subjectName ?? group[0]?.subjectName ?? "",
      academicYear: group[0]?.academicYearId ?? "",
      submittedOn: "",
      status: "SUBMITTED" as ExamStatus,
      totalStudents: total,
      appeared: appeared.length,
      average: marksArr.length ? Math.round((marksArr.reduce((a, b) => a + b, 0) / marksArr.length) * 10) / 10 : 0,
      passRate: marksArr.length ? Math.round((passArr.length / marksArr.length) * 100) : 0,
    };
  });
}
