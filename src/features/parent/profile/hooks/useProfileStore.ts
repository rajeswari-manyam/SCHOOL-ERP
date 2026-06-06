import { create } from "zustand";
import type { ContactInfo, NotificationPref, Child } from "../types/profile.types";
import { getParentById } from "../../../../services/parent.api";
import { getStudentById } from "../../../../services/student.api";

interface ProfileState {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelation: string;
  parentOccupation: string;
  parentAddress: string;
  contact: ContactInfo;
  notifications: NotificationPref[];
  children: Child[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: (parentId: string) => Promise<void>;
  setContact: (contact: ContactInfo) => void;
  toggleNotification: (id: string) => void;
}

function toInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((w) => w[0].toUpperCase()).join("").slice(0, 2);
}

const AVATAR_COLORS = ["#3525CD", "#F97316", "#16A34A", "#6366F1", "#E11D48"];

const DEFAULT_NOTIFICATIONS: NotificationPref[] = [
  { id: "attendance", label: "Attendance Alerts",         description: "Real-time WhatsApp updates",        iconBg: "#EEF2FF", iconColor: "#3525CD", enabled: true },
  { id: "fees",       label: "Fee Reminders",             description: "Upcoming payment dues",             iconBg: "#FFF4ED", iconColor: "#F97316", enabled: true },
  { id: "homework",   label: "Homework Notifications",    description: "Daily assignment logs",             iconBg: "#EDFCF2", iconColor: "#16A34A", enabled: true },
  { id: "browser",    label: "Browser/App Notifications", description: "Direct push alerts on this device", iconBg: "#F0F4FF", iconColor: "#6366F1", enabled: true },
];

const EMPTY_CONTACT: ContactInfo = {
  fatherName: "", fatherPhone: "", motherName: "", motherEmail: "", emergencyContact: "",
};

export const useProfileStore = create<ProfileState>((set) => ({
  parentName:       "",
  parentPhone:      "",
  parentEmail:      "",
  parentRelation:   "",
  parentOccupation: "",
  parentAddress:    "",
  contact:          EMPTY_CONTACT,
  notifications:    DEFAULT_NOTIFICATIONS,
  children:         [],
  isLoading:        false,
  error:            null,

  fetchProfile: async (parentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const parent = await getParentById(parentId);

      const students = await Promise.all(
      parent.students.map((sid) => getStudentById(sid))
      );

      const children: Child[] = students.map((s, idx) => ({
        id:          s.id,
        name:        `${s.first_name} ${s.last_name}`.trim(),
        initials:    toInitials(`${s.first_name} ${s.last_name}`),
        avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        class:       s.class,
        admissionNo: s.admission_number,
        status:      "ACTIVE" as const,
      }));

      // ✅ Map ALL real API fields into contact
      // relation tells us if this parent is mother or father
      const isMother = parent.relation?.toLowerCase() === "mother";

      const contact: ContactInfo = {
        fatherName:       isMother ? ""                : parent.parent_name,
        fatherPhone:      isMother ? ""                : parent.phone,
        motherName:       isMother ? parent.parent_name : "",
        motherEmail:      isMother ? parent.email       : "",
        emergencyContact: parent.phone,   // best available; extend if API adds emergency field
      };

      set({
        parentName:       parent.parent_name,
        parentPhone:      parent.phone,
        parentEmail:      parent.email,
        parentRelation:   parent.relation,
        parentOccupation: parent.occupation,
        parentAddress:    parent.address,
        contact,
        children,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load profile",
      });
    }
  },

  setContact: (contact) => set({ contact }),
  toggleNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, enabled: !n.enabled } : n
      ),
    })),
}));