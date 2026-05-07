// modules/exams/ExamsPage.tsx
import { useExamData } from "../hooks/Useexamdata";
import { UpcomingSection } from "../components/UpcomingSection";
import { ResultsSection } from "../components/ResultSection";
import { ReportCardSection } from "../components/ReportCardSection";
import { SyllabusSection } from "../components/SyllabusSection";

const tabs = [
  { id: "upcoming", label: "Upcoming Exams" },
  { id: "results", label: "Results" },
  { id: "report", label: "Report Card" },
  { id: "syllabus", label: "Syllabus" },
] as const;

export const ExamsPage = () => {
  const {
    activeTab,
    setActiveTab,
    exams,
    examResult,        // ← FIXED: singular, not plural
    report,
    syllabus,
    unitTestSyllabus,
    deadlines,
  } = useExamData();

  return (
    <div className="mx-auto max-w-7xl px-1 sm:px-3 py-3 sm:py-4 space-y-1">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-700">My Exams & Results</h1>
          <p className="text-sm text-gray-500">Class 10A | Academic Year 2024-25</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">
          2024-25
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="pt-2">
        {activeTab === "upcoming" && <UpcomingSection exams={exams} />}
        {activeTab === "results" && examResult && (
          <ResultsSection examResult={examResult} />
        )}
        {activeTab === "report" && report && <ReportCardSection report={report} />}
        {activeTab === "syllabus" && (
          <SyllabusSection 
            syllabus={syllabus} 
            unitTestSyllabus={unitTestSyllabus}
            deadlines={deadlines}
          />
        )}
      </div>
    </div>
  );
};