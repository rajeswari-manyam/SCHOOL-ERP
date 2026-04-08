export const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;

export const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800";
    case "suspended": return "bg-red-100 text-red-800";
    case "pending": return "bg-yellow-100 text-yellow-800";
    default: return "bg-gray-100 text-gray-800";
  }
};
