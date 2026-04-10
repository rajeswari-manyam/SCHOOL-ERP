import type{ Stat } from "../types/dashboard.types";

export const stats: Stat[] = [
  { title: "Attendance", value: "91.7%", status: "success" },
  { title: "Fees Pending", value: "₹8,500", status: "error" },
  { title: "Assignments", value: "2 Pending", status: "warning" },
  { title: "Working Days", value: "90 days" },
];