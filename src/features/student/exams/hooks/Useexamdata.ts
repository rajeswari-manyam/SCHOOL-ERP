import { useEffect, useState } from "react";
import {
  fetchUpcomingExams, fetchChecklist, fetchExamResults,
  fetchReportCard, fetchSyllabusFiles, fetchUnitTestSyllabus,
} from "../api/ExamApi";
import type { Exam, ExamResultSummary, ReportCard, SyllabusFile, UnitTestSyllabus } from "../types/Exam.types";
import { useExamStore } from "../store/ExamStore";

export function useUpcomingExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const { setChecklist } = useExamStore();

  useEffect(() => {
    fetchUpcomingExams().then(setExams).finally(() => setLoading(false));
    fetchChecklist().then(setChecklist);
  }, [setChecklist]);

  return { exams, loading };
}

export function useExamResults() {
  const [results, setResults] = useState<ExamResultSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamResults().then(setResults).finally(() => setLoading(false));
  }, []);

  return { results, loading };
}

export function useReportCard() {
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportCard().then(setReportCard).finally(() => setLoading(false));
  }, []);

  return { reportCard, loading };
}

export function useSyllabus() {
  const [files, setFiles] = useState<SyllabusFile[]>([]);
  const [unitTest, setUnitTest] = useState<UnitTestSyllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSyllabusFiles(), fetchUnitTestSyllabus()])
      .then(([f, u]) => { setFiles(f); setUnitTest(u); })
      .finally(() => setLoading(false));
  }, []);

  return { files, unitTest, loading };
}