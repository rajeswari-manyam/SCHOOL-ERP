// hooks/useExamData.ts
import { useState } from "react";
import {
  examsMock,
  examResultMock,
  reportMock,
  syllabusMock,
  unitTestSyllabusMock,
  deadlinesMock,
} from "../data/exam.mock";

export const useExamData = () => {
  const [activeTab, setActiveTab] = useState<
    "upcoming" | "results" | "report" | "syllabus"
  >("upcoming");

  return {
    activeTab,
    setActiveTab,
    exams: examsMock,
    examResult: examResultMock,
    report: reportMock,
    syllabus: syllabusMock,
    unitTestSyllabus: unitTestSyllabusMock,
    deadlines: deadlinesMock,
  };
};