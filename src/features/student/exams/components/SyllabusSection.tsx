import { SyllabusTable } from "./SyllabusTable";
import { UnitTestSyllabus } from "./UnitTestSyllabus";
import { PreparationTips } from "./PreparationTips";
import { UpcomingDeadlines } from "./UpcomingDeadline";
import type { Syllabus, UnitSyllabus, Deadline } from "../types/exams.types";

interface SyllabusSectionProps {
  syllabus: Syllabus[];
  unitTestSyllabus?: UnitSyllabus[];
  deadlines?: Deadline[];
}

export const SyllabusSection = ({
  syllabus,
  unitTestSyllabus,
  deadlines,
}: SyllabusSectionProps) => {
  return (
    <div className="space-y-6">

      {/* ================= TOP SECTION ================= */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:border-indigo-500 hover:shadow-sm">

        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Syllabus — Academic Year 2024-25
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Uploaded by subject teachers
          </p>
        </div>

        <SyllabusTable data={syllabus} />
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* Left: Unit Test Syllabus */}
        <div className="transition-all duration-200 hover:border-indigo-500 hover:shadow-sm rounded-xl border border-transparent lg:border-gray-100">
          <UnitTestSyllabus data={unitTestSyllabus} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">

          {/* Preparation Tips */}
          <div className="rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-indigo-500 hover:shadow-sm hover:-translate-y-1">
            <PreparationTips />
          </div>

          {/* Deadlines */}
          <div className="rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-indigo-500 hover:shadow-sm hover:-translate-y-1">
            <UpcomingDeadlines deadlines={deadlines} />
          </div>

        </div>
      </div>
    </div>
  );
};