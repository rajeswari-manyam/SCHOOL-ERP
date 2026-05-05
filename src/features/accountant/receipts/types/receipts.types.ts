

export type PaymentMode = "UPI" | "CASH" | "CHEQUE" | "ONLINE";

export type FeeStatus = "paid" | "overdue" | "warning" | "upcoming" | "due-today";

export type Receipt = {
  id: string;
  receiptNo: string;
  date: string;
  time: string;
  student: string;
  className: string;
  feeHead: string;
  amount: number;
  mode: PaymentMode;
  status: "Sent" | "Not Sent";
  waStatus: "Sent" | "Not Sent";
};

export type CreateReceiptInput = Omit<Receipt, "id" | "receiptNo">;
export type UpdateReceiptInput = Partial<CreateReceiptInput>;

export type ReceiptDetail = Receipt & {
  fatherName: string;
  admissionNo: string;
  referenceNo: string;
  period: string;
  collectedBy: string;
};

export type Student = {
  id: string;
  name: string;
  className: string;
  section: string;
  admissionNo: string;
  fatherName: string;
  parentContact: string;
  avatar: string;
};

export type GenerateReceiptModalProps = {
  onClose: () => void;
  onSuccess?: (receiptNo: string) => void;
};