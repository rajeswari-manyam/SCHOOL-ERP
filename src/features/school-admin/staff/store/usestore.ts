import { create } from "zustand";
import type { StaffMember, TabKey, UpdateStaffPayload } from "../types/staff.types";
import { fetchStaff, updateStaff as updateStaffApi } from "../api/staff.api";
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
  loading: boolean;
  error: string | null;

  // Filters
  activeTab: TabKey;
  search: string;
  roleFilter: string;
  statusFilter: string;
  showModal: boolean;

  // Edit
  editStaffMember: StaffMember | null;
  editLoading: boolean;

  // Actions
  loadStaff: () => void;
  setStaffData: (data: StaffMember[]) => void;
  setActiveTab: (tab: TabKey) => void;
  setSearch: (search: string) => void;
  setRoleFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setShowModal: (show: boolean) => void;
  setEditStaffMember: (member: StaffMember | null) => void;
  updateStaffInStore: (id: string, payload: UpdateStaffPayload) => Promise<void>;

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
  loading: false,
  error: null,

  // Initial filters
  activeTab: "all",
  search: "",
  roleFilter: "",
  statusFilter: "",
  showModal: false,

  // Edit
  editStaffMember: null,
  editLoading: false,

  // Actions
  loadStaff: () => {
    set({ loading: true, error: null });
    fetchStaff().then(data => {
      set({ staffData: data, stats: calculateStats(data), loading: false });
    }).catch(err => {
      console.error("Failed to load staff", err);
      set({ error: err?.message || "Failed to load staff.", loading: false });
    });
  },

  setStaffData: (data) => set(() => ({
    staffData: data,
    stats: calculateStats(data),
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSearch: (search) => set({ search }),

  setRoleFilter: (filter) => set({ roleFilter: filter }),

  setStatusFilter: (filter) => set({ statusFilter: filter }),

  setShowModal: (show) => set({ showModal: show }),

  setEditStaffMember: (member) => set({ editStaffMember: member }),

  updateStaffInStore: async (id, payload) => {
    set({ editLoading: true });
    try {
      const updated = await updateStaffApi(id, payload);
      set((state) => {
        const next = state.staffData.map((s) =>
          s.id === id ? { ...s, ...updated } : s,
        );
        return {
          staffData: next,
          stats: calculateStats(next),
          editStaffMember: null,
          editLoading: false,
        };
      });
    } catch (err) {
      set({ editLoading: false });
      throw err;
    }
  },

  // Computed
  getFilteredStaff: () => {
    const state = get();
    return filterStaff(state.staffData, state.activeTab, state.search, state.roleFilter, state.statusFilter);
  },
}));