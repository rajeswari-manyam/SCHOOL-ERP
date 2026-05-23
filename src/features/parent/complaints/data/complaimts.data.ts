import type { ComplaintAttachee } from "../types/complaints.types";

export const COMPLAINT_ATTACHEES: ComplaintAttachee[] = [
  {
    id: "1",
    name: "Ravi Kumar",
    initials: "RK",
    avatarColor: "#3525CD",
  },
  {
    id: "2",
    name: "Priya Kumar",
    initials: "PK",
    avatarColor: "#F97316",
  },
];

export const COMPLAINT_CATEGORIES = [
  "Academic",
  "Fee",
  "Transport",
  "Staff",
  "Facility",
  "Other",
] as const;

export function generateReferenceNo(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `REF-${year}-${num}`;
}