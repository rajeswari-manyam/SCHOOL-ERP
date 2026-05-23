import type { ParentProfile } from "../types/profile.types";

export const parentProfile: ParentProfile = {
  name: "Suresh Kumar",
  initials: "SK",
  role: "Parent",
  phone: "+91 98765 43210",
  contact: {
    fatherName: "Suresh Kumar",
    fatherPhone: "+91 98765 43210",
    motherName: "Lakshmi Devi",
    motherEmail: "lakshmi@email.com",
    emergencyContact: "+91 87654 32109",
  },
  children: [
    {
      id: "1",
      name: "Ravi Kumar",
      initials: "RK",
      avatarColor: "#3525CD",
      class: "Class 10A",
      admissionNo: "ADM-001",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Priya Kumar",
      initials: "PK",
      avatarColor: "#F97316",
      class: "Class 7B",
      admissionNo: "ADM-156",
      status: "ACTIVE",
    },
  ],
  notifications: [
    { id: "attendance",  label: "Attendance Alerts",         description: "Real-time WhatsApp updates",      iconBg: "#EEF2FF", iconColor: "#3525CD", enabled: true  },
    { id: "fees",        label: "Fee Reminders",             description: "Upcoming payment dues",           iconBg: "#FFF4ED", iconColor: "#F97316", enabled: true  },
    { id: "homework",    label: "Homework Notifications",    description: "Daily assignment logs",           iconBg: "#EDFCF2", iconColor: "#16A34A", enabled: true  },
    { id: "browser",     label: "Browser/App Notifications", description: "Direct push alerts on this device", iconBg: "#F0F4FF", iconColor: "#6366F1", enabled: true  },
  ],
};