export const ROLES = [
  "superadmin",
  "schooladmin",
  "teacher",
  "accountant",
  "parent",
  "student",
] as const;

export type Role = (typeof ROLES)[number];
export const ROLE_LABELS: Record<Role, string> = {
  superadmin: "Super Admin",
  schooladmin: "School Admin", 
  teacher: "Teacher",
  accountant: "Accountant",
  parent: "Parent", 
  student: "Student",
};
                                                                    