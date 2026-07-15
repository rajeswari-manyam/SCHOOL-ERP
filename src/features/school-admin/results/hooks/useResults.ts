import { useCallback, useMemo, useState } from "react";
import type { GetAllMarksQuery, SubmittedExam } from "@/features/teacher/exam/types/exam-marks.types";
import { examMarksApi } from "@/services/teacher-exam-marks.api";
import { useAllMarks, marksToSubmittedExam } from "@/features/teacher/exam/hooks/useAllMarks";
import type { SubmittedFilter } from "@/features/teacher/exam/components/SubmittedMarksFilter";

const isDev = import.meta.env.DEV;
function logger(level: "log" | "warn" | "error", ...args: unknown[]) { if (isDev) console[level]("[useResults]", ...args); }

const EMPTY_FILTER: SubmittedFilter = {
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_id: "",
};

// Publishing an entire exam for a class/section (School Admin > Results).
// Reuses the same /tenant/getallmarks + /tenant/markspublish plumbing the
// teacher's Submitted Marks screen uses — publish just lives here instead.
export const useResults = () => {
  const [filter, setFilter] = useState<SubmittedFilter>(EMPTY_FILTER);
  // `activeFilter` is what was last searched — only updates when "Search" is clicked.
  const [activeFilter, setActiveFilter] = useState<SubmittedFilter>(EMPTY_FILTER);

  const handleSearch = useCallback(() => {
    setActiveFilter({ ...filter });
  }, [filter]);

  const marksQuery = useMemo((): GetAllMarksQuery => ({
    class_id:   activeFilter.class_id,
    section_id: activeFilter.section_id,
    subject_id: activeFilter.subject_id,
    ...(activeFilter.exam_id ? { exam_id: activeFilter.exam_id } : {}),
  }), [activeFilter]);

  const enabled = Boolean(activeFilter.class_id && activeFilter.section_id && activeFilter.subject_id);

  const {
    data: marksRecords,
    isLoading: marksLoading,
    isError: marksError,
    refetch: refetchMarks,
  } = useAllMarks(marksQuery, enabled);

  // ── Publish ─────────────────────────────────────────────────────────────
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  // Optimistic overlay: a successful publish call is proof the exam is
  // published even if the re-fetched /tenant/getallmarks row's status
  // hasn't caught up yet — track it locally by row id.
  const [publishedExamIds, setPublishedExamIds] = useState<Set<string>>(new Set());

  const results: SubmittedExam[] = useMemo(() => {
    const mapped = marksRecords
      ? marksToSubmittedExam(marksRecords, activeFilter.className, activeFilter.subjectName, activeFilter.examName)
      : [];
    return mapped.map((ex) =>
      publishedExamIds.has(ex.id) && ex.status !== "PUBLISHED"
        ? { ...ex, status: "PUBLISHED" as const }
        : ex
    );
  }, [marksRecords, activeFilter, publishedExamIds]);

  // Publishes an entire exam for a class/section — every subject and every
  // student with marks entered, in one call. exam_id prefers the row's own
  // examId/the searched exam_id over the row's `id`, since that field isn't
  // guaranteed to be the exam's real UUID.
  const handlePublish = useCallback(async (exam: SubmittedExam) => {
    const examId = activeFilter.exam_id || exam.examId || exam.id;
    const academicYearId = exam.academicYearId || activeFilter.academicYearId || "";

    setPublishingId(exam.id);
    setPublishError(null);

    try {
      await examMarksApi.publishMarks({
        class_id: activeFilter.class_id,
        section_id: activeFilter.section_id,
        exam_id: examId,
        academicYearId,
      });
      setPublishedExamIds((prev) => new Set(prev).add(exam.id));
      await refetchMarks();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish results";
      logger("error", "handlePublish failed", { message, examId });
      setPublishError(message);
      setTimeout(() => setPublishError(null), 10000);
    } finally {
      setPublishingId(null);
    }
  }, [activeFilter, refetchMarks]);

  return {
    filter, setFilter,
    activeFilter,
    handleSearch,
    results,
    marksLoading, marksError, refetchMarks,
    enabled,
    handlePublish, publishingId, publishError,
  };
};
