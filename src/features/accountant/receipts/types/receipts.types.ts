export type PaymentMode = "UPI" | "Cash" | "Cheque";

export type Receipt = {
  id: string;
  receiptNo: string;
  date: string;
  student: string;
  className: string;
  feeHead: string;
  amount: number;
  mode: PaymentMode;
  sentToParent: boolean;
};