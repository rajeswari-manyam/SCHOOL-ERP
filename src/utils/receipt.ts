

export const generateReceiptNo = (): string => {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-5);
  return `RCP-${year}-${timestamp}`;
};
export const getModeBadge = (mode: string): string => {
  const styles: Record<string, string> = {
    Cash: "bg-green-50 text-green-600 border-green-200",
    UPI: "bg-purple-50 text-purple-600 border-purple-200",
    Card: "bg-blue-50 text-blue-600 border-blue-200",
    Bank: "bg-orange-50 text-orange-600 border-orange-200",
  };

  return styles[mode] || "bg-gray-50 text-gray-600 border-gray-200";
};