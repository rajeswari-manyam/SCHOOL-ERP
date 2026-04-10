export const formatCurrency = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const formatPercentage = (value: number) => {
  return `${value}%`;
};

export const getStatusColor = (status?: string) => {
  switch (status) {
    case "success":
      return "text-green-600";
    case "warning":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};