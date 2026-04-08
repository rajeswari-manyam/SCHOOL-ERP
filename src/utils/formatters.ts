export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(date),
  );

export const formatCurrency = (amount: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
