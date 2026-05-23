import { useState, useEffect, useCallback } from "react";
import type {
  SchoolProfile,
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
} from "../types/settings.types";
import * as api from "../api/settings.api";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.fetchClasses(), api.fetchWorkingDays()]).then(
      ([cls, wd]) => {
        setClasses(cls);
        setWorkingDays(wd);
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

  const addNewClass = useCallback(async (data: Omit<ClassSection, "id">) => {
    const newCls = await api.addClass(data);
    setClasses(prev => [...prev, newCls]);
  }, []);

  return { classes, workingDays, loading, saving, saveWorkingDays, addNewClass };
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