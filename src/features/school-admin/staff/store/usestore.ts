import { create } from "zustand";
import type { StaffMember, TabKey, UpdateStaffPayload, LeaveRequest } from "../types/staff.types";
import { fetchStaff, fetchStaffStats, fetchLeaves, approveLeave as approveLeaveApi, rejectLeave as rejectLeaveApi, updateStaff as updateStaffApi, deleteStaff as deleteStaffApi } from "@/services/staff.api";
import { updateLeave as updateLeaveApi, deleteLeave as deleteLeaveApi } from "@/services/leaves.api";
import type { LeaveRecord } from "@/services/staff.api";
import { useUIStore } from "@/store/uiStore";

interface StaffStats {
  total: number;
  teachers: number;
  nonTeaching: number;
  leavePending: number;
}

interface StaffState {
  // Data
  staffData: StaffMember[];
  leaveData: LeaveRecord[];
  stats: StaffStats;
  loading: boolean;
  error: string | null;
  leaveProcessing: Record<string, 'approving' | 'rejecting'>;

  // Filters
  activeTab: TabKey;
  search: string;
  roleFilter: string;
  statusFilter: string;
  selectedStaffId: string;
  showModal: boolean;

  // Edit
  editStaffMember: StaffMember | null;
  editLoading: boolean;

  // Actions
  loadStaff: () => Promise<void>;
  setStaffData: (data: StaffMember[]) => void;
  setActiveTab: (tab: TabKey) => void;
  setSearch: (search: string) => void;
  setRoleFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setSelectedStaffId: (id: string) => void;
  setShowModal: (show: boolean) => void;
  setEditStaffMember: (member: StaffMember | null) => void;
  updateStaffInStore: (id: string, payload: UpdateStaffPayload) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  loadLeaves: (staffId?: string) => Promise<void>;
  editLeave: (id: string, reason: string, status: string) => Promise<void>;
  deleteLeave: (id: string) => Promise<void>;
  approveLeave: (leaveId: string, remarks?: string) => Promise<void>;
  rejectLeave: (leaveId: string, remarks?: string) => Promise<void>;

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

const removeProcessing = (map: Record<string, 'approving' | 'rejecting'>, id: string) => {
  const copy = { ...map };
  delete copy[id];
  return copy;
};

export const filterStaff = (staff: StaffMember[], activeTab: TabKey, search: string, roleFilter: string, statusFilter: string, selectedStaffId?: string): StaffMember[] => {
  let filtered = staff;

  // Filter by tab
  if (activeTab === "teachers") {
    filtered = filtered.filter(s => s.isTeaching);
  } else if (activeTab === "non-teaching") {
    filtered = filtered.filter(s => !s.isTeaching);
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

  // Filter by selected staff
  if (selectedStaffId) {
    filtered = filtered.filter(s => s.id === selectedStaffId);
  }

  return filtered;
};

export const useStaffStore = create<StaffState>((set, get) => ({
  // Initial data
  staffData: [],
  leaveData: [],
  leaveProcessing: {},
  stats: { total: 0, teachers: 0, nonTeaching: 0, leavePending: 0 },
  loading: false,
  error: null,

  // Initial filters
  activeTab: "all",
  search: "",
  roleFilter: "",
  statusFilter: "",
  selectedStaffId: "",
  showModal: false,

  // Edit
  editStaffMember: null,
  editLoading: false,

  // Actions
  loadStaff: async () => {
    const academicYearId = useUIStore.getState().academicYearId;
    set({ loading: true, error: null });
    try {
      const [staffData, statsData, leaveData] = await Promise.all([
        fetchStaff(academicYearId),
        fetchStaffStats().catch((err) => {
          console.warn("Staff stats endpoint unavailable, falling back to derived values", err);
          return null;
        }),
        fetchLeaves(),
      ]);

      set({
        staffData,
        leaveData,
        stats: statsData ?? calculateStats(staffData),
        loading: false,
      });
    } catch (err) {
      console.error("Failed to load staff", err);
      set({
        error: err instanceof Error ? err.message : "Failed to load staff.",
        loading: false,
      });
    }
  },

  setStaffData: (data) => set(() => ({
    staffData: data,
    stats: calculateStats(data),
  })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSearch: (search) => set({ search }),

  setRoleFilter: (filter) => set({ roleFilter: filter }),

  setStatusFilter: (filter) => set({ statusFilter: filter }),

  setSelectedStaffId: (id) => set({ selectedStaffId: id }),

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

  deleteStaff: async (id) => {
    try {
      await deleteStaffApi(id);
      set((state) => {
        const next = state.staffData.filter((s) => s.id !== id);
        return {
          staffData: next,
          stats: calculateStats(next),
        };
      });
    } catch (err) {
      console.error("Failed to delete staff", err);
      throw err;
    }
  },

  loadLeaves: async (staffId) => {
    try {
      const leaves = await fetchLeaves(staffId ? { staff_id: staffId } : undefined);
      set({ leaveData: leaves });
    } catch (err) {
      console.error("Failed to load leaves", err);
    }
  },

  editLeave: async (id, reason, status) => {
    try {
      const payload: Record<string, string> = {};
      if (reason !== undefined) payload.reason = reason;
      if (status !== undefined) payload.status = status;
      await updateLeaveApi(id, payload);
      set((state) => {
        const nextLeaves = state.leaveData.map((l) =>
          l.id === id ? { ...l, reason: reason ?? l.reason, status: (status ?? l.status) as LeaveRequest['status'] } : l,
        );
        const pendingCount = nextLeaves.filter((l) => l.status === 'PENDING').length;
        return {
          leaveData: nextLeaves,
          stats: { ...state.stats, leavePending: pendingCount },
        };
      });
    } catch (err) {
      console.error("Failed to update leave", err);
      throw err;
    }
  },

  deleteLeave: async (id) => {
    try {
      await deleteLeaveApi(id);
      set((state) => {
        const nextLeaves = state.leaveData.filter((l) => l.id !== id);
        const pendingCount = nextLeaves.filter((l) => l.status === 'PENDING').length;
        return {
          leaveData: nextLeaves,
          stats: { ...state.stats, leavePending: pendingCount },
        };
      });
    } catch (err) {
      console.error("Failed to delete leave", err);
      throw err;
    }
  },

  approveLeave: async (leaveId: string, remarks?: string) => {
    set((state) => ({
      leaveProcessing: { ...state.leaveProcessing, [leaveId]: 'approving' },
    }));
    try {
      await approveLeaveApi(leaveId, remarks);
      set((state) => {
        const nextLeaves = state.leaveData.map((l) =>
          l.id === leaveId ? { ...l, status: 'APPROVED' as const } : l,
        );
        const pendingCount = nextLeaves.filter((l) => l.status === 'PENDING').length;
        return {
          leaveData: nextLeaves,
          leaveProcessing: removeProcessing(state.leaveProcessing, leaveId),
          stats: { ...state.stats, leavePending: pendingCount },
        };
      });
      // Also sync staffData leaveRequest if matched
      set((state) => {
        const target = state.leaveData.find((l) => l.id === leaveId);
        if (!target?.staffId) return {};
        const nextStaff = state.staffData.map((s) =>
          s.id === target.staffId && s.leaveRequest
            ? { ...s, leaveRequest: { ...s.leaveRequest, status: 'APPROVED' as const } }
            : s,
        );
        return { staffData: nextStaff };
      });
    } catch (err) {
      set((state) => ({
        leaveProcessing: removeProcessing(state.leaveProcessing, leaveId),
      }));
      throw err;
    }
  },

  rejectLeave: async (leaveId: string, remarks?: string) => {
    set((state) => ({
      leaveProcessing: { ...state.leaveProcessing, [leaveId]: 'rejecting' },
    }));
    try {
      await rejectLeaveApi(leaveId, remarks);
      set((state) => {
        const nextLeaves = state.leaveData.map((l) =>
          l.id === leaveId ? { ...l, status: 'REJECTED' as const } : l,
        );
        const pendingCount = nextLeaves.filter((l) => l.status === 'PENDING').length;
        return {
          leaveData: nextLeaves,
          leaveProcessing: removeProcessing(state.leaveProcessing, leaveId),
          stats: { ...state.stats, leavePending: pendingCount },
        };
      });
      // Also sync staffData leaveRequest if matched
      set((state) => {
        const target = state.leaveData.find((l) => l.id === leaveId);
        if (!target?.staffId) return {};
        const nextStaff = state.staffData.map((s) =>
          s.id === target.staffId && s.leaveRequest
            ? { ...s, leaveRequest: { ...s.leaveRequest, status: 'REJECTED' as const } }
            : s,
        );
        return { staffData: nextStaff };
      });
    } catch (err) {
      set((state) => ({
        leaveProcessing: removeProcessing(state.leaveProcessing, leaveId),
      }));
      throw err;
    }
  },

  // Computed
  getFilteredStaff: () => {
    const state = get();
    return filterStaff(state.staffData, state.activeTab, state.search, state.roleFilter, state.statusFilter, state.selectedStaffId);
  },
}));