export interface Receipt {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description?: string;
}

export interface CreateReceiptInput {
  studentId: string;
  amount: number;
  date: string;
  paymentMethod: string;
  description?: string;
}

export interface UpdateReceiptInput extends Partial<CreateReceiptInput> {}
