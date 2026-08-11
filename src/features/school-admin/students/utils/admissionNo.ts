import type { Student } from "../types/student.types";

/**
 * Shared across Add Student and Bulk Add Student so auto-generated numbers
 * continue in one sequence (e.g. 1 from Add Student, then 2 from Bulk Add)
 * instead of each form restarting its own counter.
 */
export const getNextAdmissionNumber = (students: Student[]): number => {
  const nums = students
    .map((s) => parseInt(s.admissionNo?.replace(/\D/g, "") || "0", 10))
    .filter((n) => !isNaN(n) && n > 0);
  return nums.length > 0 ? Math.max(...nums) + 1 : 1;
};

export const formatAdmissionNo = (n: number): string => `ADM-${String(n).padStart(3, "0")}`;
