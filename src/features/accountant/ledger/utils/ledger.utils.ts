export const formatCurrency = (amt: number) =>
  `₹${amt.toLocaleString("en-IN")}`;