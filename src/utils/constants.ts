export const ROLES = [
  "super_admin",
  "school_admin",
  "teacher",
  "accountant",
  "parent",
  "student",
] as const;

export type Role = (typeof ROLES)[number];
export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin", 
  teacher: "Teacher",
  accountant: "Accountant",
  parent: "Parent", 
  student: "Student",
};
                                                                    