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
  onEdit?: () => void;
}
