// pages/ExamsPage.tsx
import { useState } from "react";
import { useExamData } from "../hooks/useExam";
import { UpcomingSection } from "../components/UpcomingSection";
import { ResultsSection } from "../components/ResultSection";
import { useAuthStore } from "@/store/authStore";
import { getAllAcademicYears } from "../../../../services/academicYear.api";
import { getClassById } from "../../../../services/class.api";
import { useQuery } from "@tanstack/react-query";

const tabs = [
  { id: "upcoming", label: "Upcoming Exams" },
  { id: "results", label: "Results" },
] as const;

export const ExamsPage = () => {
  const { user } = useAuthStore();

  const classId = user?.class_id ?? "";
  const sectionId = user?.section_id ?? "";
  const studentId = user?.id ?? "";
  const sectionName = user?.section_id?.split(":")[1] ?? "";

  // ── Fetch class name ──
  const { data: classData } = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getClassById(classId),
    enabled: !!classId,
    staleTime: 10 * 60 * 1000,
  });
  const className = classData?.data?.class_name ?? "";

  // ── Academic years ──
  const { data: academicYearsData } = useQuery({
    queryKey: ["academicYears"],
    queryFn: getAllAcademicYears,
    staleTime: 10 * 60 * 1000,
  });
  const academicYears = academicYearsData?.data ?? [];
  const defaultYear =
    academicYears.find((y) => y.active)?.yearName ??
    academicYears[0]?.yearName ??
    "2024-2025";
  const defaultYearId =
    academicYears.find((y) => y.active)?.id ??
    academicYears[0]?.id ??
    "";

  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedYearId, setSelectedYearId] = useState<string>("");
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const activeYear = selectedYear || defaultYear;
  const activeYearId = selectedYearId || defaultYearId;

  const {
    activeTab,
    setActiveTab,
    exams,
    examsLoading,
    examsError,
    refetchExams,
    examResult,
    resultsLoading,
    resultsError,
    refetchResults,
    examList,
    examListLoading,
    selectedResultExamId,
    setSelectedResultExamId,
  } = useExamData(classId, sectionId, studentId, "", activeYearId);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-3 py-3 sm:py-4 space-y-4">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-indigo-700">
            My Exams &amp; Results
          </h1>
          <p className="text-sm text-gray-500">
            {className && sectionName
              ? `Class ${className} - ${sectionName}`
              : className
              ? `Class ${className}`
              : "Loading class…"}{" "}
            | Academic Year {activeYear}
          </p>
        </div>

        {/* Academic Year Dropdown */}
        <div className="relative">
          <button
            onClick={() => setYearDropdownOpen((o) => !o)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition"
          >
            {activeYear}
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {yearDropdownOpen && academicYears.length > 0 && (
            <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
              {academicYears.map((y) => (
                <button
                  key={y.id}
                  onClick={() => {
                    setSelectedYear(y.yearName);
                    setSelectedYearId(y.id);
                    setYearDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                    activeYear === y.yearName
                      ? "text-indigo-600 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {y.yearName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative px-4 py-3 text-sm font-medium transition whitespace-nowrap
              ${activeTab === tab.id ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"}
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* ================= CONTENT AREA ================= */}
      <div className="pt-2 transition-all duration-200 space-y-4">

        {activeTab === "upcoming" && (
          <div className="rounded-xl border border-transparent transition-all duration-200">
            {examsLoading && (
              <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                <svg className="animate-spin h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading exam timetable…
              </div>
            )}
            {!examsLoading && examsError && (
              <div className="flex flex-col items-center gap-3 py-12 text-sm text-red-500">
                <span>{examsError}</span>
                <button
                  onClick={refetchExams}
                  className="rounded-lg border border-red-200 px-4 py-1.5 text-xs text-red-500 transition"
                >
                  Retry
                </button>
              </div>
            )}
            {!examsLoading && !examsError && <UpcomingSection exams={exams} />}
          </div>
        )}

        {activeTab === "results" && (
          <div className="rounded-xl border border-transparent transition-all duration-200">
            <ResultsSection
              studentId={studentId}
              examResult={examResult}
              resultsLoading={resultsLoading}
              resultsError={resultsError}
              onRetry={refetchResults}
              examList={examList}
              examListLoading={examListLoading}
              selectedResultExamId={selectedResultExamId}
              onSelectExam={setSelectedResultExamId}
            />
          </div>
        )}

      </div>
    </div>
  );
};
