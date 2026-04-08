export const ROLES = [
  "super_admin",
  "school_admin",
  "teacher",
  "accountant",
  "parent",
  "student",
] as const;

export type Role = (typeof ROLES)[number];
