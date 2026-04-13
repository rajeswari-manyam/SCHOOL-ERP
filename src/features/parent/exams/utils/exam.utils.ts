    import type { ResultSummary } from "../types/exam.types";

export function getGradeColor(grade: string): string {
  if (grade === "A+" || grade === "A") return "bg-[#DCFCE7] text-[#166534]";
  if (grade === "B+" || grade === "B") return "bg-[#EEF2FF] text-[#3525CD]";
  return "bg-[#FEF3C7] text-[#92400E]";
}

export function formatPercentage(value: number): string {
  return value.toFixed(1) + "%";
}

export function findResultById(summaries: ResultSummary[], id: string): ResultSummary | undefined {
  return summaries.find((s) => s.id === id);
}