import type { PaymentMode } from "../features/accountant/receipts/types/receipts.types";

type TransactionLike = {
  amount: number;
  mode: PaymentMode;
};



type PaymentOption = {
  label: string;
  value: PaymentMode;
};

export const PAYMENT_OPTIONS: PaymentOption[] = [
  { label: "Cash", value: "CASH" },
  { label: "UPI", value: "UPI" },
  { label: "Cheque", value: "CHEQUE" },
  { label: "Online", value: "ONLINE" },
];

// ✅ MODE BADGE STYLES
export const getModeBadgeClass = (mode: PaymentMode) => {
  switch (mode) {
    case "CASH":
      return "px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold";
    case "UPI":
      return "px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold";
    case "CHEQUE":
      return "px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold";
    case "ONLINE":
      return "px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold";
    default:
      return "px-2 py-1 rounded-full bg-gray-50 text-gray-600 text-xs";
  }
};

// ✅ SUMMARY FUNCTION (your existing one)
export const calculatePaymentSummary = (data: TransactionLike[]) => {
  return data.reduce(
    (acc, item) => {
      acc.total += item.amount;

      switch (item.mode) {
        case "CASH":
          acc.cash += item.amount;
          break;
        case "UPI":
          acc.upi += item.amount;
          break;
        case "CHEQUE":
          acc.cheque += item.amount;
          break;
        case "ONLINE":
          acc.online += item.amount;
          break;
      }

      return acc;
    },
    {
      cash: 0,
      upi: 0,
      cheque: 0,
      online: 0,
      total: 0,
    }
  );
};