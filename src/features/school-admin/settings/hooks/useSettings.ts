import { useState, useEffect, useCallback } from "react";
import type {
  SchoolProfile,
  AcademicYear,
  CreateAcademicYearPayload,
  ClassSection,
  WorkingDaysConfig,
  FeeHead,
  GradeFeeStructure,
  TransportSlab,
  FeeQuickInsights,
  UserAccount,
  RolePermission,
  WAConnection,
  WATemplate,
  NotificationSettings,
  ModulePermission,
  AddUserFormData,
  CreateClassPayload,
  Department,
  CreateDepartmentPayload,
} from "../types/settings.types";
import * as api from "@/services/school-settings.api";
import * as deptApi from "@/services/department.api";
import * as wdApi from "@/services/working-days.api";
import type { WorkingDayRecord, WorkingDayPayload } from "@/services/working-days.api";
import * as holidaysApi from "@/services/holidays.api";
import type { HolidayFromApi, CreateHolidayPayload, UpdateHolidayPayload } from "@/services/holidays.api";
import * as leaveAllocApi from "@/services/leave-allocation.api";
import type { LeaveAllocation, CreateLeaveAllocationPayload } from "@/services/leave-allocation.api";

// ─── School Profile ───────────────────────────────────────────────────────────

export function useSchoolProfile() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.fetchSchoolProfile().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const save = useCallback(async (data: Partial<SchoolProfile>) => {
    setSaving(true);
    const updated = await api.updateSchoolProfile(data);
    setProfile(updated);
    setSaving(false);
  }, []);

  return { profile, loading, saving, save };
}

// ─── Academic Config ──────────────────────────────────────────────────────────

export function useAcademicConfig() {
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [workingDays, setWorkingDays] = useState<WorkingDaysConfig | null>(null);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.fetchClasses(), api.fetchWorkingDays(), api.fetchAcademicYears()]).then(
      ([cls, wd, years]) => {
        setClasses(cls);
        setWorkingDays(wd);
        setAcademicYears(years);
        setLoading(false);
      }
    );
  }, []);

  const saveWorkingDays = useCallback(async (data: Partial<WorkingDaysConfig>) => {
    setSaving(true);
    const updated = await api.updateWorkingDays(data);
    setWorkingDays(updated);
    setSaving(false);
  }, []);

  const addNewClass = useCallback(async (payload: CreateClassPayload) => {
    const newCls = await api.addClass(payload);
    setClasses(prev => [...prev, newCls]);
  }, []);

  const createAcademicYear = useCallback(async (payload: CreateAcademicYearPayload) => {
    const newYear = await api.createAcademicYear(payload);
    setAcademicYears(prev => [...prev, newYear]);
    return newYear;
  }, []);

  return { classes, workingDays, academicYears, loading, saving, saveWorkingDays, addNewClass, createAcademicYear };
}

// ─── Fee Configuration ────────────────────────────────────────────────────────

export function useFeeConfig() {
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>([]);
  const [gradeStructures, setGradeStructures] = useState<GradeFeeStructure[]>([]);
  const [transportSlabs, setTransportSlabs] = useState<TransportSlab[]>([]);
  const [insights, setInsights] = useState<FeeQuickInsights | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string>("Grade 10");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.fetchFeeHeads(),
      api.fetchGradeFeeStructures(),
      api.fetchTransportSlabs(),
      api.fetchFeeQuickInsights(),
    ]).then(([heads, grades, slabs, ins]) => {
      setFeeHeads(heads);
      setGradeStructures(grades);
      if (grades.length > 0) setSelectedGrade(grades[grades.length - 1].grade);
      setTransportSlabs(slabs);
      setInsights(ins);
      setLoading(false);
    });
  }, []);

  const saveStructure = useCallback(async () => {
    setSaving(true);
    await api.saveFeeStructure();
    setSaving(false);
  }, []);

  return {
    feeHeads, gradeStructures, transportSlabs, insights,
    selectedGrade, setSelectedGrade,
    loading, saving, saveStructure,
  };
}

// ─── User Accounts ────────────────────────────────────────────────────────────

export function useUserAccounts() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadPage = useCallback(async (p: number) => {
    setLoading(true);
    const result = await api.fetchUsers(p);
    setUsers(result.users);
    setTotalCount(result.totalCount);
    setTotalPages(result.totalPages);
    setPage(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  const addUser = useCallback(async (data: AddUserFormData) => {
    const newUser = await api.addUser(data);
    setUsers(prev => [newUser, ...prev]);
    setTotalCount(prev => prev + 1);
  }, []);

  const deactivateUser = useCallback(async (id: string) => {
    await api.deactivateUser(id);
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, status: "INACTIVE" as const } : u))
    );
  }, []);

  const editUser = useCallback(async (id: string, data: Partial<UserAccount>) => {
    await api.updateUser(id, data);
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  return {
    users, totalCount, totalPages, page,
    loading, setPage: loadPage,
    addUser, deactivateUser, editUser,
  };
}

// ─── Role Permissions ─────────────────────────────────────────────────────────

export function usePermissions() {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("Teacher");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.fetchRolePermissions().then(data => {
      setRolePermissions(data);
      setLoading(false);
    });
  }, []);

  const save = useCallback(async (permissions: ModulePermission[]) => {
    setSaving(true);
    await api.saveRolePermissions(selectedRole, permissions);
    setRolePermissions(prev =>
      prev.map(r => (r.role === selectedRole ? { ...r, permissions } : r))
    );
    setSaving(false);
  }, [selectedRole]);

  return {
    rolePermissions, selectedRole, setSelectedRole,
    loading, saving, save,
  };
}

// ─── WhatsApp & Notifications ─────────────────────────────────────────────────

export function useWhatsApp() {
  const [connection, setConnection] = useState<WAConnection | null>(null);
  const [templates, setTemplates] = useState<WATemplate[]>([]);
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.fetchWAConnection(),
      api.fetchWATemplates(),
      api.fetchNotificationSettings(),
    ]).then(([conn, tmpl, notif]) => {
      setConnection(conn);
      setTemplates(tmpl);
      setNotifications(notif);
      setLoading(false);
    });
  }, []);

  const toggleNotification = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      if (!notifications) return;
      const updated = { ...notifications, [key]: value };
      setNotifications(updated);
      await api.updateNotificationSettings(updated);
    },
    [notifications]
  );

  return { connection, templates, notifications, loading, toggleNotification };
}

// ─── Departments ──────────────────────────────────────────────────────────────

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    deptApi.fetchDepartments().then(data => {
      setDepartments(data);
      setLoading(false);
    });
  }, []);

  const addDepartment = useCallback(async (payload: CreateDepartmentPayload) => {
    setSaving(true);
    try {
      const newDept = await deptApi.createDepartment(payload);
      setDepartments(prev => [...prev, newDept]);
    } finally {
      setSaving(false);
    }
  }, []);

  const editDepartment = useCallback(async (id: string, departmentName: string) => {
    await deptApi.updateDepartment(id, { departmentName });
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, departmentName } : d));
  }, []);

  const removeDepartment = useCallback(async (id: string) => {
    await deptApi.deleteDepartment(id);
    setDepartments(prev => prev.filter(d => d.id !== id));
  }, []);

  return { departments, loading, saving, addDepartment, editDepartment, removeDepartment };
}

// ─── Working Days ─────────────────────────────────────────────────────────────

export function useWorkingDays() {
  const [workingDays, setWorkingDays] = useState<WorkingDayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    wdApi.fetchAllWorkingDays().then(data => {
      setWorkingDays(data);
      setLoading(false);
    });
  }, []);

  const createWorkingDay = useCallback(async (payload: WorkingDayPayload) => {
    setSaving(true);
    try {
      const record = await wdApi.createWorkingDay(payload);
      setWorkingDays(prev => [...prev, record]);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateWorkingDay = useCallback(async (id: string, payload: Partial<WorkingDayPayload>) => {
    setSaving(true);
    try {
      const record = await wdApi.updateWorkingDay(id, payload);
      setWorkingDays(prev => prev.map(w => w.id === id ? record : w));
    } finally {
      setSaving(false);
    }
  }, []);

  const removeWorkingDay = useCallback(async (id: string) => {
    await wdApi.deleteWorkingDay(id);
    setWorkingDays(prev => prev.filter(w => w.id !== id));
  }, []);

  return { workingDays, loading, saving, createWorkingDay, updateWorkingDay, removeWorkingDay };
}

// ─── Leave Allocations ────────────────────────────────────────────────────────

export function useLeaveAllocations() {
  const [allocations, setAllocations] = useState<LeaveAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    leaveAllocApi.getAllLeaveAllocations()
      .then(list => setAllocations(list))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const createAllocations = useCallback(async (payload: CreateLeaveAllocationPayload) => {
    setSaving(true);
    try {
      await leaveAllocApi.createLeaveAllocation(payload);
      const fresh = await leaveAllocApi.getAllLeaveAllocations();
      setAllocations(fresh);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateAllocation = useCallback(async (id: string, payload: { allocated_days?: number; leave_type?: string }) => {
    setSaving(true);
    try {
      await leaveAllocApi.updateLeaveAllocation(id, payload);
      setAllocations(prev => prev.map(a => a.id === id ? { ...a, ...payload } : a));
    } finally {
      setSaving(false);
    }
  }, []);

  const removeAllocation = useCallback(async (id: string) => {
    await leaveAllocApi.deleteLeaveAllocation(id);
    setAllocations(prev => prev.filter(a => a.id !== id));
  }, []);

  return { allocations, loading, saving, createAllocations, updateAllocation, removeAllocation };
}

// ─── Holidays ─────────────────────────────────────────────────────────────────

export function useHolidays() {
  const [holidays, setHolidays] = useState<HolidayFromApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    holidaysApi.getAllHolidays()
      .then(res => {
        let list: HolidayFromApi[] = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (res.holidays) list = res.holidays;
        else if (res.data && typeof res.data === "object" && "holidays" in res.data) {
          list = (res.data as { holidays: HolidayFromApi[] }).holidays;
        }
        setHolidays(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const createHoliday = useCallback(async (payload: CreateHolidayPayload) => {
    setSaving(true);
    try {
      const res = await holidaysApi.createHoliday(payload);
      if (res.data) setHolidays(prev => [...prev, res.data!]);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to create holiday";
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateHoliday = useCallback(async (id: string, payload: UpdateHolidayPayload) => {
    setSaving(true);
    try {
      const res = await holidaysApi.updateHolidayById(id, payload);
      setHolidays(prev => prev.map(h => h.id === id ? { ...h, ...(res.data ?? payload) } : h));
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to update holiday";
      throw new Error(msg);
    } finally {
      setSaving(false);
    }
  }, []);

  const removeHoliday = useCallback(async (id: string) => {
    await holidaysApi.deleteHolidayById(id);
    setHolidays(prev => prev.filter(h => h.id !== id));
  }, []);

  return { holidays, loading, saving, createHoliday, updateHoliday, removeHoliday };
}