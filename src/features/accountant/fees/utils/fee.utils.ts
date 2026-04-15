export const formatCurrency = (amt: number) =>
  `₹${amt.toLocaleString("en-IN")}`;

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Paid":
      return "text-green-600";
    case "Pending":
      return "text-amber-600";
    case "Overdue":
      return "text-red-600";
    default:
      return "";
  }
};