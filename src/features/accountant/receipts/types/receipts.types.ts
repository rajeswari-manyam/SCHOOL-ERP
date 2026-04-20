export type PaymentMode = "UPI" | "Cash" | "Cheque";

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