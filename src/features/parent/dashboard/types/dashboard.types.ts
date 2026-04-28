export type Status= "success" | "warning" | "error";

export interface Stat {
  title: string;
  value: string;
  status?: Status; 
}

export interface AttendanceData {
  date: string;
  attendance: number;
}

export interface FeeData {
  month: string;
  fees: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export interface Assignment {
  title: string;
  subject: string;
}


export type AnnouncementVariant = "latest" | "announcements";

export interface AnnouncementCardProps {
  title: string;
  description: string;
  tag?: string;
  variant?: AnnouncementVariant;
  postedAt?: string;
  onViewAll?: () => void;
}
export interface FeeStatusCardProps {
    isPaid?: boolean;
}

export interface FeeItem {
  month: string;
  amount: number;
  status: "paid" | "pending";
}

export interface FeeStatusCardProps {
  isPaid?: boolean;
  fees: FeeItem[];
  lastPayment?: {
    amount: number;
    date: string;
    method: string;
  };
  nextDue?: {
    label: string;
    date: string;
  };
}
export interface HomeworkItem {
  title: string;
  subject: string;
}
export interface HomeworkCardProps {
  variant?: "card" | "simple";
  data?: HomeworkItem[];
}
export interface HomeworkItem {
  title: string;
  subject: string;
  type?: "card" | "simple";
  fileUrl: string; // ✅ ADD THIS
}
export type Exam = {
  subject: string;
  date: string;
  day: string;
  time: string;
  venue: string;
};