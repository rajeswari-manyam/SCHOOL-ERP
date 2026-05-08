import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export const ExamsPage = () => {
  const {
    activeTab,
    setActiveTab,
    exams,
    examResult,
    report,
    syllabus,
    unitTestSyllabus,
    deadlines,
  } = useExamData();

  return (
    <div className="mx-auto max-w-7xl px-2 sm:px-3 py-3 sm:py-4 space-y-4">

      {/* HEADER */}
      <motion.div
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="text-xl font-bold text-indigo-700">
            My Exams & Results
          </h1>
          <p className="text-sm text-gray-500">
            Class 10A | Academic Year 2024-25
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition hover:border-indigo-200 hover:shadow-sm">
          2024-25
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </motion.div>

      {/* TABS */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-4 py-3 text-sm font-medium transition whitespace-nowrap
              ${activeTab === tab.id
                ? "text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pt-2"
        >
          {activeTab === "upcoming" && <UpcomingSection exams={exams} />}
          {activeTab === "results" && examResult && (
            <ResultsSection examResult={examResult} />
          )}
          {activeTab === "report" && report && (
            <ReportCardSection report={report} />
          )}
          {activeTab === "syllabus" && (
            <SyllabusSection
              syllabus={syllabus}
              unitTestSyllabus={unitTestSyllabus}
              deadlines={deadlines}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};