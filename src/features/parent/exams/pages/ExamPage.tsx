import { useOutletContext } from "react-router-dom";
import { BookOpen, CalendarDays, FileText, AlertCircle, Mail } from "lucide-react";
import { useExamsStore } from "../store/useExam.store";
import { upcomingExams, nextExam, resultSummaries, reportCard } from "../data/data";
import { findResultById } from "../utils/exam.utils";
import { ExamBanner } from "../components/ExamBanner";
import { ExamTable } from "../components/ExamTable";
import { ResultSummaryCard } from "../components/ResultSummaryCard";
import { ResultsTable } from "../components/ResultTable";
import { ReportCardTable } from "../components/ReportCardTable";
import { Card, CardContent } from "@/components/ui/card";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
  };
};

const TABS = [
  { id: "upcoming" as const, label: "Upcoming Exams" },
  { id: "results" as const, label: "Results" },
  { id: "reportcard" as const, label: "Report Card" },
];

export default function ExamsPage() {
  const { tab, setTab, selectedResultId, setSelectedResultId } = useExamsStore();
  const { activeChild } = useOutletContext<ParentLayoutContext>();
  const selectedResult = findResultById(resultSummaries, selectedResultId);

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-8 px-4 sm:px-6 lg:px-10 pb-16 bg-[#F4F6FB] min-h-screen">

      <p className="text-[12px] text-gray-400 mb-4">
        {activeChild.name} ›
        <span className="text-gray-600 font-medium"> Exams &amp; Results</span>
      </p>

      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0B1C30]">
          Exams &amp; Results — {activeChild.name}
        </h1>
        <p className="text-[13px] text-gray-400 mt-1">
          Class {activeChild.class} | Academic Year 2024-25
        </p>
      </div>

      <div className="flex border-b border-[#E8EBF2] mb-7">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-[#3525CD] text-[#3525CD]"
                : "border-transparent text-gray-400 hover:text-[#0B1C30]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* UPCOMING TAB */}
      {tab === "upcoming" && (
        <div>
          <div className="mb-6">
            <ExamBanner {...nextExam} />
          </div>
          <Card className="rounded-2xl shadow-sm overflow-hidden border-0 mb-6">
            <CardContent className="p-0">
              <div className="px-5 pt-5 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-[#0B1C30]">
                  Unit Test 1 — April 2025
                </p>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#3525CD] hover:underline rounded-full bg-[#F4F6FB] px-2 py-1">
                  <BookOpen size={13} />
                  View Syllabus
                </button>
              </div>
              <div className="px-5 pt-4">
                <ExamTable exams={upcomingExams} />
              </div>
              <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between px-5 py-4 border-t border-[#EEF2F7]">
                <p className="text-[12px] text-gray-400">
                  Sync your exam schedule with Google Calendar
                </p>
                <button className="bg-[#006C49] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#00563a] transition-all flex items-center gap-2">
                  <CalendarDays size={14} />
                  Add all to Google Calendar
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preparation Guide card */}
            <div className="bg-[#EFF4FF] rounded-2xl p-5 flex gap-3 border border-[#E8EBF2] hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
                <FileText size={18} color="#3525CD" strokeWidth={1.3} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#0B1C30] mb-1">Preparation Guide</p>
                <p className="text-[12px] text-gray-400 leading-relaxed mb-2">
                  Download the detailed syllabus and reference material for all Unit Test 1 subjects.
                </p>
                <button className="text-[12px] font-semibold text-[#3525CD] hover:underline">VIEW RESOURCES →</button>
              </div>
            </div>

            {/* Need Assistance card */}
            <div className="bg-[#FFDDB8] rounded-2xl p-5 flex gap-3 border border-[#E8EBF2] hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
                <AlertCircle size={18} color="#F97316" strokeWidth={1.3} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#0B1C30] mb-1">Need Assistance?</p>
                <p className="text-[12px] text-gray-400 leading-relaxed mb-2">
                  Questions regarding the exam schedule or venues? Contact the administration desk.
                </p>
                <button className="flex items-center gap-1 text-[12px] font-semibold text-[#3525CD] hover:underline">
                  CONTACT ADMIN <Mail size={12} className="ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS TAB */}
      {tab === "results" && (
        <div>
          <div className="mb-5">
            <select
              value={selectedResultId}
              onChange={(e) => setSelectedResultId(e.target.value)}
              className="border border-[#E8EBF2] rounded-xl px-4 py-2 text-[13px] text-[#0B1C30] bg-white cursor-pointer"
            >
              {resultSummaries.map((s) => (
                <option key={s.id} value={s.id}>{s.examName}</option>
              ))}
            </select>
          </div>
          {selectedResult && (
            <>
              <ResultSummaryCard summary={selectedResult} />
              <ResultsTable results={selectedResult.results} />
            </>
          )}
        </div>
      )}

      {/* REPORT CARD TAB */}
      {tab === "reportcard" && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="text-[15px] font-semibold text-[#0B1C30]">
              Annual Report Card — {reportCard.academicYear}
            </span>
            <select className="border border-[#E8EBF2] rounded-xl px-4 py-2 text-[13px] text-[#0B1C30] bg-white cursor-pointer">
              <option>2024-25</option>
              <option>2023-24</option>
            </select>
          </div>
          <ReportCardTable data={reportCard} />
        </div>
      )}

    </div>
  );
}