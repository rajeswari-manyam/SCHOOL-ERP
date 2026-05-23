import { create } from "zustand";
import type { StaffMember, TabKey } from "../types/staff.types";
import { staffMockData } from "../data/staff.data";

interface StaffStats {
  total: number;
  teachers: number;
  nonTeaching: number;
  leavePending: number;
}

interface StaffState {
  // Data
  staffData: StaffMember[];
  stats: StaffStats;

  // Filters
  activeTab: TabKey;
  search: string;
  roleFilter: string;
  statusFilter: string;
  showModal: boolean;

  // Actions
  setStaffData: (data: StaffMember[]) => void;
  setActiveTab: (tab: TabKey) => void;
  setSearch: (search: string) => void;
  setRoleFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setShowModal: (show: boolean) => void;

  // Computed
  getFilteredStaff: () => StaffMember[];
}

const calculateStats = (staff: StaffMember[]): StaffStats => {
  const total = staff.length;
  const teachers = staff.filter(s => s.isTeaching).length;
  const nonTeaching = staff.filter(s => !s.isTeaching).length;
  const leavePending = staff.filter(s => s.leaveRequest?.status === "PENDING").length;
  return { total, teachers, nonTeaching, leavePending };
};

const filterStaff = (staff: StaffMember[], activeTab: TabKey, search: string, roleFilter: string, statusFilter: string): StaffMember[] => {
  let filtered = staff;

  // Filter by tab
  if (activeTab === "teachers") {
    filtered = filtered.filter(s => s.isTeaching);
  } else if (activeTab === "non-teaching") {
    filtered = filtered.filter(s => !s.isTeaching);
  } else if (activeTab === "leave-requests") {
    filtered = filtered.filter(s => s.leaveRequest?.status === "PENDING");
  }

  // Filter by search
  if (search) {
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter by role
  if (roleFilter) {
    filtered = filtered.filter(s => s.role === roleFilter);
  }

  // Filter by status
  if (statusFilter) {
    filtered = filtered.filter(s => s.status === statusFilter);
  }

  return filtered;
};

export const useStaffStore = create<StaffState>((set, get) => ({
  // Initial data
  staffData: staffMockData,
  stats: calculateStats(staffMockData),

  // Initial filters
  activeTab: "all",
  search: "",
  roleFilter: "",
  statusFilter: "",
  showModal: false,

  // Actions
  setStaffData: (data) => set(() => ({
    staffData: data,
    stats: calculateStats(data),
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSearch: (search) => set({ search }),

  setRoleFilter: (filter) => set({ roleFilter: filter }),

  setStatusFilter: (filter) => set({ statusFilter: filter }),

  setShowModal: (show) => set({ showModal: show }),

  // Computed
  getFilteredStaff: () => {
    const state = get();
    return filterStaff(state.staffData, state.activeTab, state.search, state.roleFilter, state.statusFilter);
  },
}));