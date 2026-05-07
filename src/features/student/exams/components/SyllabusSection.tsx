// components/SyllabusSection.tsx
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
      {/* Top: Syllabus Files Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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

      {/* Bottom: Unit Test Syllabus + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <UnitTestSyllabus data={unitTestSyllabus} />
        
        <div className="space-y-4">
          <PreparationTips />
          <UpcomingDeadlines deadlines={deadlines} />
        </div>
      </div>
    </div>
  );
};