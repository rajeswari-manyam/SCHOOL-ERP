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
  const nextExam = exams[0];
  const daysLeft = getDaysLeft(nextExam.date);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 items-start">
      <ExamCard exam={nextExam} daysLeft={daysLeft} />
      <ExamTable exams={exams} />
    </div>
  );
};