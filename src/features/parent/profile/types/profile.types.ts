export interface Child {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  class: string;
  admissionNo: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface ContactInfo {
  fatherName: string;
  fatherPhone: string;
  motherName: string;
  motherEmail: string;
  emergencyContact: string;
}

export interface NotificationPref {
  id: string;
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
  enabled: boolean;
}

export interface ParentProfile {
  name: string;
  initials: string;
  role: string;
  phone: string;
  contact: ContactInfo;
  children: Child[];
  notifications: NotificationPref[];
}

export interface ProfileCardProps {
  name: string;
  initials: string;
  role: string;
  phone: string;
  email?: string;
  relation?: string;
  occupation?: string;
  address?: string;
  onEdit?: () => void;
}

/** Matches the API shape from getParentById */
export interface ApiParent {
  id: string;
  parent_name: string;
  students: string[]; // array of student IDs
}

/** Matches the API shape from getstudentsById */
export interface ApiStudent {
  id: string;
  student_name: string;
  class_name: string;
  school_name: string;
}
