import { create } from "zustand";
import type { ContactInfo, NotificationPref, Child } from "../types/profile.types";
import { getUserById } from "../../../../services/auth.api";
import { getStudentById } from "../../../../services/student.api";
import type { ClassTeacherInfo } from "../components/ClassTeacherCard";

interface ProfileState {
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentRelation: string;
  parentOccupation: string;
  parentAddress: string;
  contact: ContactInfo;
  classTeacher: ClassTeacherInfo | null;
  notifications: NotificationPref[];
  children: Child[];
  isLoading: boolean;
  error: string | null;

  fetchProfile: (parentId: string, activeStudentId?: string) => Promise<void>;
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
  classTeacher:     null,
  notifications:    DEFAULT_NOTIFICATIONS,
  children:         [],
  isLoading:        false,
  error:            null,

  fetchProfile: async (parentId: string, activeStudentId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getUserById(parentId);
      const parent = res.data;

      const studentList = parent.students ?? [];
      const students = await Promise.all(
        studentList.map((item: { id: string; name: string }) => getStudentById(item.id))
      );

      const children: Child[] = students.map((s, idx) => ({
        id:          s.id,
        name:        `${s.first_name} ${s.last_name}`.trim(),
        initials:    toInitials(`${s.first_name} ${s.last_name}`),
        avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        class:       s.classDetail?.class_name ?? s.class_id ?? "",
        admissionNo: s.admission_number,
        status:      "ACTIVE" as const,
      }));

      // Prefer the currently-selected child's own record — richer and more
      // reliable than the parent-user record, which only carries one side
      // (father or mother) based on which account logged in.
      const activeStudent = students.find((s) => s.id === activeStudentId) ?? students[0];
      const parentRecord = activeStudent?.parentDetail?.[0];

      const contact: ContactInfo = parentRecord
        ? {
            fatherName:       parentRecord.father_name  ?? "",
            fatherPhone:      parentRecord.father_phone  ?? "",
            motherName:       parentRecord.mother_name   ?? "",
            motherEmail:      parentRecord.mother_email  ?? "",
            emergencyContact: parentRecord.father_phone || parentRecord.mother_phone || "",
          }
        : {
            fatherName:       parent.relation?.toLowerCase() === "mother" ? "" : (parent.parent_name ?? ""),
            fatherPhone:      parent.relation?.toLowerCase() === "mother" ? "" : (parent.phone ?? ""),
            motherName:       parent.relation?.toLowerCase() === "mother" ? (parent.parent_name ?? "") : "",
            motherEmail:      parent.email ?? "",
            emergencyContact: parent.phone ?? "",
          };

      const teacher = activeStudent?.classTeacher;
      const classTeacher: ClassTeacherInfo | null = teacher
        ? {
            name:  `${teacher.first_name} ${teacher.last_name ?? ""}`.trim(),
            phone: teacher.phone ?? "",
            email: teacher.email ?? "",
            photo: teacher.photo ?? null,
          }
        : null;

      set({
        parentName:       parent.parent_name       ?? "",
        parentPhone:      parent.phone             ?? "",
        parentEmail:      parent.email             ?? "",
        parentRelation:   parent.relation          ?? "",
        parentOccupation: parent.occupation        ?? "",
        parentAddress:    parent.address           ?? "",
        contact,
        classTeacher,
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