export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
}

export type Role =
  | "superadmin"
  | "schooladmin"
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
