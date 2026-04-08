export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface StaffCreateInput {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
}

export interface StaffUpdateInput extends Partial<StaffCreateInput> {}
