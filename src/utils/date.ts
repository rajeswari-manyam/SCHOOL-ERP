
export const parseDate = (dateStr?: string | null): Date | null => {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  return Number.isNaN(date.getTime()) ? null : date;
};



export const formatDate = (dateStr?: string | null): string => {
  const date = parseDate(dateStr);
  if (!date) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTime = (dateStr?: string | null): string => {
  const date = parseDate(dateStr);
  if (!date) return "—";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatTime = (dateStr?: string | null): string => {
  const date = parseDate(dateStr);
  if (!date) return "—";

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};



export const getTodayISO = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getNow = (): Date => new Date();

export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};



export const getCurrentPeriod = (): string => {
  return new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export const getMonthKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export const getYear = (date: Date = new Date()): number => {
  return date.getFullYear();
};

export const getMonth = (date: Date = new Date()): number => {
  return date.getMonth() + 1;
};



export const isToday = (dateStr?: string | null): boolean => {
  const date = parseDate(dateStr);
  if (!date) return false;

  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isPast = (dateStr?: string | null): boolean => {
  const date = parseDate(dateStr);
  if (!date) return false;

  return date.getTime() < new Date().getTime();
};

export const isFuture = (dateStr?: string | null): boolean => {
  const date = parseDate(dateStr);
  if (!date) return false;

  return date.getTime() > new Date().getTime();
};



export const getStartOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getStartOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getEndOfMonth = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};



export const getDaysDifference = (from: Date, to: Date = new Date()): number => {
  const diff = to.getTime() - from.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getAge = (dob?: string | null): number => {
  const birth = parseDate(dob);
  if (!birth) return 0;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];


export const DAYS_OF_WEEK: string[] = [
  "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
];

export const isWeekend = (
  year: number,
  month: number, 
  day: number
): boolean => {
  const dow = new Date(year, month, day).getDay();
  return dow === 0 || dow === 6;
};

export const getMonthMeta = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    year,
    month,
    firstDow: new Date(year, month, 1).getDay(),
    daysInMonth: new Date(year, month + 1, 0).getDate(),
    daysInPrev: new Date(year, month, 0).getDate(),
  };
};