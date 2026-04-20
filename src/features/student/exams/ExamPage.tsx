import { useEffect, useState } from "react";

// Hooks
import {
  useUpcomingExams,
  useExamResults,
  useReportCard,
  useSyllabus,
} from "./hooks/Useexamdata";

// Components
import TabNav from "./components/Tabnav";
import ExamCard from "./components/Examcard";
import ResultsTable from "./components/Resultstable";
import ReportCard from "./components/Reportcard";
import Syllabus from "./components/Syllabus";

// Types
import type { TabId } from "./types/Exam.types";

const ExamPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("upcoming");
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  // ─── DATA HOOKS ─────────────────────────────
  const { exams, loading: examsLoading } = useUpcomingExams();
  const { results, loading: resultsLoading } = useExamResults();
  const { reportCard, loading: reportLoading } = useReportCard();
  const { files, unitTest, loading: syllabusLoading } = useSyllabus();

  useEffect(() => {
    if (!selectedExamId && results.length > 0) {
      setSelectedExamId(results[0].examId);
    }
  }, [results, selectedExamId]);

  const isLoading =
    examsLoading || resultsLoading || reportLoading || syllabusLoading;

  const highlightExam = exams[0];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-950">
              My Exams & Results
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Class 10A | Academic Year 2024-25
            </p>
          </div>
          <p className="max-w-xl text-sm text-slate-500">
            Stay on top of your upcoming tests, download reports, and prepare with the latest syllabus materials.
          </p>
        </div>
      </div>

      <TabNav active={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="p-6 text-slate-500">Loading exams...</div>
      ) : (
        <div className="space-y-6">
          {activeTab === "upcoming" && (
            <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
              <ExamCard
                title={highlightExam?.subject ?? "English"}
                date={highlightExam?.date ?? "15 Apr 2025"}
                daysToGo={highlightExam ? Math.max(0, Math.ceil((new Date(highlightExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) : 9}
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      Exam Timetable
                    </h2>
                    <p className="text-sm text-slate-500">
                      Review your upcoming exam schedule and venue details.
                    </p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                    Export PDF
                  </button>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Subject</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Venue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {exams.map((exam) => (
                        <tr key={exam.id} className="transition hover:bg-slate-50">
                          <td className="px-4 py-4 font-medium text-slate-900">{exam.subject}</td>
                          <td className="px-4 py-4 text-slate-500">{exam.date}</td>
                          <td className="px-4 py-4 text-slate-500">{exam.time}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {exam.venue}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">+</span>
                    <span>Add all to Google Calendar</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Exam rules and regulations apply. Please reach the hall 30 mins early.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "results" && results.length > 0 && (
            <ResultsTable
              result={
                results.find((r) => r.examId === selectedExamId) || results[0]
              }
              examOptions={results.map((r) => ({
                id: r.examId,
                name: r.examName,
              }))}
              selectedId={selectedExamId || results[0].examId}
              onSelectExam={setSelectedExamId}
            />
          )}

          {activeTab === "reportcard" && reportCard && (
            <ReportCard data={reportCard} />
          )}

          {activeTab === "syllabus" && (
            <Syllabus files={files} unitTest={unitTest} />
          )}
        </div>
      )}
    </div>
  );
};

export default ExamPage;