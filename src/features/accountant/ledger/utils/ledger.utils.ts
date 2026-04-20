// utils/ledger.utils.ts
export const formatCurrency = (amt: number) => {
  if (amt === 0) return "₹0";
  return `₹${amt.toLocaleString("en-IN")}`;
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

export const calculatePercentage = (value: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};