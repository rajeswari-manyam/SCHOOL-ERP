

export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

export const formatDate = (dateStr: string): string => {
  const date = parseDate(dateStr);
  if (!date) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (dateStr: string): string => {
  const date = parseDate(dateStr);
  if (!date) return "—";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getCurrentPeriod = (): string => {
  return new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};