// components/UpcomingSection.tsx

import { ExamCard } from "./Examcard";
import { ExamTable } from "./ExamTable";
import type { Exam } from "../types/exams.types";

const getDaysLeft = (dateStr: string): number => {
  const examDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diff = examDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const UpcomingSection = ({ exams }: { exams: Exam[] }) => {
  if (!exams || exams.length === 0) return null;

  const nextExam = exams[0];
  const daysLeft = getDaysLeft(nextExam.date);

  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]
        gap-6 items-start
      "
    >

      {/* ================= LEFT CARD ================= */}
      <div
        className="
          transition-all duration-200
          hover:border-indigo-200
          hover:shadow-sm
          hover:-translate-y-1
          border border-transparent
          rounded-xl
        "
      >
        <ExamCard exam={nextExam} daysLeft={daysLeft} />
      </div>

      {/* ================= RIGHT TABLE ================= */}
      <div
        className="
          transition-all duration-200
          hover:border-indigo-200
          hover:shadow-sm
          border border-transparent
          rounded-xl
        "
      >
        <ExamTable exams={exams} />
      </div>
    </div>
  );
};