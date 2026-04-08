export interface Fee {
  id: string;
  student: string;
  amount: number;
  dueDate: string;
  status: "pending" | "paid";
  paidAt?: string;
}

export interface FeeCreateInput {
  student: string;
  amount: number;
  dueDate: string;
}

export interface FeeUpdateInput extends Partial<FeeCreateInput> {}
