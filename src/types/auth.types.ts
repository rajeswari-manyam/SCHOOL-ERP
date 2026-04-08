export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

export type Role =
  | "super_admin"
  | "school_admin"
  | "teacher"
  | "accountant"
  | "parent"
  | "student";

export interface Session {
  token: string;
  user: User;
  role: Role;
  tenantId: string;
}
