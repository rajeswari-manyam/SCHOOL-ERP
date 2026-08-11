import api from "@/config/axios";
import { getErrorMessage } from "@/utils/getErrorMessage";



export interface StaffRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;

  qualification?: string;
  salary?: number;

  date_of_birth?: string;
  date_of_join?: string;

  class_teacher_of?: string;
  subject_teacher_of?: string;

  emp_number?: string;
  status?: string;

  bank_account_name?: string;
  bank_account_number?: string;
  ifsc_code?: string;

  leavesBalance?: number;
  leavesTaken?: number;
  leavesPending?: number;
}

/* =========================================================
   📘 GET ALL STAFF
========================================================= */

export interface GetAllStaffResponse {
  status: boolean;
  count: number;
  data: StaffRecord[];
}

export interface GetAllStaffParams {
  class_name?: string;
  section?: string;
  role?: string;
}

export const getAllStaff = async (
  params?: GetAllStaffParams
): Promise<GetAllStaffResponse> => {
  const { data } = await api.get<GetAllStaffResponse>(
    `/tenant/getallstaff`,
    { params }
  );
  return data;
};

/* =========================================================
   📘 GET STAFF BY ID
========================================================= */

export interface GetStaffByIdResponse {
  status: boolean;
  data: StaffRecord;
}

export const getStaffById = async (
  id: string
): Promise<GetStaffByIdResponse> => {
  const { data } = await api.get<GetStaffByIdResponse>(
    `/tenant/getstaffById/${id}`
  );
  return data;
};
/* ===== Merged from school-staff.api.ts ===== */
import { getAuthUser } from "@/store/authStore";
import type { CreateStaffPayload, LeaveRequest, StaffMember, UpdateStaffPayload } from "@/features/school-admin/staff/types/staff.types";

export interface StaffStatsResponse {
  status: boolean;
  data?: {
    totalStaff?: number;
    teacherCount?: number;
    nonTeachingCount?: number;
    pendingLeaves?: number;
  };
}

export interface StaffStatsSummary {
  total: number;
  teachers: number;
  nonTeaching: number;
  leavePending: number;
}

interface RawLeaveRecord {
  id?: string;
  staff_id?: string;
  staffId?: string;
  staff_name?: string;
  name?: string;
  employeeId?: string;
  emp_id?: string;
  userId?: string;
  leave_type?: string;
  type?: string;
  start_date?: string;
  fromDate?: string;
  end_date?: string;
  toDate?: string;
  total_days?: number;
  totalDays?: number;
  reason?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const extractArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  const data = value as Record<string, unknown>;
  for (const key of ["data", "leaves", "applications", "result", "records", "items"]) {
    const candidate = data[key];
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === "object") {
      const nested = extractArray(candidate);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const mapLeaveRequest = (item: Record<string, unknown>): LeaveRequest | undefined => {
  if (!item) return undefined;
  const raw = item as RawLeaveRecord;
  const type = (raw.leave_type ?? raw.type ?? "CASUAL").toUpperCase();
  const status = (raw.status ?? "PENDING").toUpperCase();
  return {
    staffId: String(raw.staff_id ?? raw.staffId ?? raw.employeeId ?? raw.id ?? ''),
    staffName: String(raw.staff_name ?? raw.name ?? ''),
    type: (type === "SICK" || type === "CASUAL" || type === "PAID" ? type : "CASUAL") as LeaveRequest["type"],
    from: raw.start_date ?? raw.fromDate ?? "",
    to: raw.end_date ?? raw.toDate ?? "",
    days: Number(raw.total_days ?? raw.totalDays ?? 0),
    reason: raw.reason ?? "",
    status: (status === "PENDING" || status === "APPROVED" || status === "REJECTED" ? status : "PENDING") as LeaveRequest["status"],
  };
};

export interface LeaveRecord extends LeaveRequest {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/** GET /tenant/getallleaves — returns parsed leave records */
export const fetchLeaves = async (params?: { staff_id?: string; leave_type?: string; status?: string }): Promise<LeaveRecord[]> => {
  try {
    const query: Record<string, string> = {};
    if (params?.staff_id) query.staff_id = params.staff_id;
    if (params?.leave_type) query.leave_type = params.leave_type;
    if (params?.status) query.status = params.status;
    const { data } = await api.get<unknown>("/tenant/getallleaves", { params: query });
    const raw = extractArray(data);
    const records: LeaveRecord[] = [];
    for (const item of raw) {
      if (!item || typeof item !== 'object') continue;
      const obj = item as Record<string, unknown>;
      const mapped = mapLeaveRequest(obj);
      if (mapped) {
        records.push({
          ...mapped,
          id: String(obj['id'] ?? obj['_id'] ?? ''),
          createdAt: obj['createdAt'] ? String(obj['createdAt']) : obj['created_at'] ? String(obj['created_at']) : undefined,
          updatedAt: obj['updatedAt'] ? String(obj['updatedAt']) : obj['updated_at'] ? String(obj['updated_at']) : undefined,
        });
      }
    }
    return records;
  } catch (err) {
    console.error(`[staff] GET /tenant/getallleaves FAILED`, getErrorMessage(err));
    return [];
  }
};

export interface LeaveActionPayload {
  approved_by?: string;
  remarks?: string;
}

export interface LeaveActionResponse {
  status: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

const getApprovedBy = (): string => getAuthUser()?.id ?? '';

/** PUT /tenant/leaves/:id/approve */
export const approveLeave = async (
  leaveId: string,
  remarks?: string,
): Promise<LeaveActionResponse> => {
  const payload: LeaveActionPayload = {
    approved_by: getApprovedBy(),
    remarks: remarks ?? '',
  };
  try {
    const { data } = await api.put<LeaveActionResponse>(
      `/tenant/leaves/${leaveId}/approve`,
      payload,
    );
    console.log(`[staff] approveLeave OK (${leaveId})`, data);
    return data;
  } catch (err) {
    console.error(`[staff] PUT /tenant/leaves/${leaveId}/approve FAILED`, getErrorMessage(err));
    throw new Error(getErrorMessage(err, 'Failed to approve leave'));
  }
};

/** PUT /tenant/leaves/:id/reject */
export const rejectLeave = async (
  leaveId: string,
  remarks?: string,
): Promise<LeaveActionResponse> => {
  const payload: LeaveActionPayload = {
    approved_by: getApprovedBy(),
    remarks: remarks ?? '',
  };
  try {
    const { data } = await api.put<LeaveActionResponse>(
      `/tenant/leaves/${leaveId}/reject`,
      payload,
    );
    console.log(`[staff] rejectLeave OK (${leaveId})`, data);
    return data;
  } catch (err) {
    console.error(`[staff] PUT /tenant/leaves/${leaveId}/reject FAILED`, getErrorMessage(err));
    throw new Error(getErrorMessage(err, 'Failed to reject leave'));
  }
};

const toCamelCase = (obj: unknown): unknown => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === "object") {
    const source = obj as Record<string, unknown>;
    return Object.keys(source).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = toCamelCase(source[key]);
      return acc;
    }, {} as Record<string, unknown>);
  }
  return obj;
};

// Loosely-typed shape of a single staff record after camelCasing a raw API
// response (from /tenant/getallstaff or similar) — fields are optional and
// left as `unknown` where the raw value can vary, matching the duck-typed
// access pattern already used for RawLeaveRecord above.
interface RawStaffMemberRecord {
  id?: string;
  name?: string;
  role?: string;
  designation?: string;
  position?: string;
  status?: string;
  isTeaching?: boolean;
  classes?: unknown;
  subjects?: unknown;
  classTeacherOf?: unknown;
  subjectTeacherOf?: unknown;
  assignedClassesSubjects?: Array<{ subjectName?: string; className?: string; sectionName?: string }>;
  empNumber?: string;
  employeeId?: string;
  phone?: string;
  email?: string;
  leaveBalance?: number;
  leavesBalance?: number;
  leaveRequest?: LeaveRequest;
  departmentId?: string;
  department?: { id?: string; departmentName?: string };
  departmentName?: string;
  qualification?: string;
  salary?: number | string;
  dateOfBirth?: string;
  dateOfJoin?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeRole = (role?: string): StaffMember["role"] => {
  const value = (role ?? "").toLowerCase().trim();

  if (!value) return "Staff";

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  if (isUuid) return "Staff";

  // Preserve the original role value (e.g. "Maths teacher", "Science teacher")
  return role!.trim();
};

const normalizeStatus = (status?: string): StaffMember["status"] => {
  const value = (status ?? "").toUpperCase();
  if (value === "ACTIVE" || value === "INACTIVE" || value === "ON_LEAVE") return value as StaffMember["status"];
  return "ACTIVE";
};

const toArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((v) => (typeof v === "object" && v !== null ? String(v.name ?? v.value ?? "") : String(v))).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

const normalizeStaffMember = (item: unknown): StaffMember => {
  const camel = toCamelCase(item) as RawStaffMemberRecord;
  const role = normalizeRole(camel.role ?? camel.designation ?? camel.position);
  const status = normalizeStatus(camel.status);
  const isTeaching = /teacher/i.test(camel.role ?? "") || Boolean(camel.isTeaching);

  const dedupe = (values: string[]): string[] => Array.from(new Set(values));

  const classes = dedupe(toArray(camel.classes));
  const subjects = dedupe(toArray(camel.subjects));

  // Fallback to single-string fields if the array fields are empty
  const classTeacherOf = dedupe(toArray(camel.classTeacherOf));
  const subjectTeacherOf = dedupe(toArray(camel.subjectTeacherOf));

  // Extract from assigned_classes_subjects (from getallstaff API) — a staff
  // member can have more than one assignment row resolving to the same
  // class/subject label (e.g. duplicate rows from a re-run carry-forward),
  // so dedupe before rendering these as pills.
  const assigned = Array.isArray(camel.assignedClassesSubjects) ? camel.assignedClassesSubjects : [];
  const assignedSubjects = dedupe(assigned.map((a) => a.subjectName).filter(Boolean) as string[]);
  const assignedClasses = dedupe(assigned.map((a) => `Class ${a.className}${a.sectionName ? ` - ${a.sectionName}` : ""}`).filter(Boolean) as string[]);

  return {
    id: camel.id ?? "",
    name: camel.name ?? "Unknown",
    initials: (camel.name ?? "NA")
      .split(" ")
      .map((part: string) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA",
    role,
    status,
    employeeId: camel.empNumber ?? camel.employeeId ?? "",
    phone: camel.phone ?? "",
    email: camel.email ?? "",
    classes: classes.length > 0 ? classes : assignedClasses.length > 0 ? assignedClasses : classTeacherOf,
    subjects: subjects.length > 0 ? subjects : assignedSubjects.length > 0 ? assignedSubjects : subjectTeacherOf,
    leaveBalance: Number(camel.leaveBalance ?? camel.leavesBalance ?? 0),
    isTeaching,
    leaveRequest: camel.leaveRequest,
    departmentId: camel.departmentId ?? camel.department?.id ?? "",
    departmentName: camel.department?.departmentName ?? camel.departmentName ?? "",
    qualification: camel.qualification ?? "",
    salary: camel.salary != null ? Number(camel.salary) : undefined,
    dateOfBirth: camel.dateOfBirth ?? "",
    dateOfJoin: camel.dateOfJoin ?? "",
    image: camel.image ?? "",
    createdAt: camel.createdAt,
    updatedAt: camel.updatedAt,
  };
};

export interface LeaveSummaryEntry {
  id: string;
  leave_type: string;
  allocated: number;
  used: number;
  balance: number;
}

export interface LeaveBalanceResponse {
  status: boolean;
  academic_year: string;
  total_allocated: number;
  total_used: number;
  total_balance: number;
  balance_list: LeaveSummaryEntry[];
  used_list: { leave_type: string; total_days: number }[];
}

export const getStaffLeaveBalance = async (
  staffId: string,
  academicYearId?: string | null,
): Promise<LeaveBalanceResponse | null> => {
  try {
    const params: Record<string, string> = { staff_id: staffId };
    if (academicYearId) params.academic_year = academicYearId;
    const { data } = await api.get<LeaveBalanceResponse>("/tenant/leavebalance", { params });
    if (data?.status) return data;
    return null;
  } catch {
    return null;
  }
};

export const getStaffLeaveSummary = async (
  staffId: string,
  academicYearId?: string | null,
): Promise<LeaveSummaryEntry[]> => {
  const params: Record<string, string> = { staff_id: staffId };
  if (academicYearId) params.academic_year = academicYearId;
  const { data } = await api.get<LeaveBalanceResponse>("/tenant/leavebalance", { params });
  const list: LeaveSummaryEntry[] = Array.isArray(data?.balance_list) ? data.balance_list : [];
  return list;
};

export const fetchStaffStats = async (): Promise<StaffStatsSummary> => {
  const [staffStatsRes, leaves] = await Promise.all([
    api.get<StaffStatsResponse>("/tenant/staffstats").catch(() => null),
    fetchLeaves(),
  ]);

  const statsData = staffStatsRes?.data;
  const pendingLeaves = leaves.filter((item) => item.status === "PENDING").length;

  if (!statsData?.status || !statsData?.data) {
    return { total: 0, teachers: 0, nonTeaching: 0, leavePending: pendingLeaves };
  }

  return {
    total: Number(statsData.data.totalStaff ?? 0),
    teachers: Number(statsData.data.teacherCount ?? 0),
    nonTeaching: Number(statsData.data.nonTeachingCount ?? 0),
    leavePending: pendingLeaves || Number(statsData.data.pendingLeaves ?? 0),
  };
};

export const fetchStaff = async (academicYearId?: string | null): Promise<StaffMember[]> => {
  const params: Record<string, string> = {};
  if (academicYearId) params.academicYearId = academicYearId;
  const [staffRes, leaves] = await Promise.all([
    api.get<unknown>("/tenant/getallstaff", { params }).catch(() => ({ data: [] as unknown })),
    fetchLeaves(),
  ]);

  const rawStaff: unknown = (staffRes as { data?: unknown })?.data ?? staffRes;
  let list: unknown[] = [];
  if (Array.isArray(rawStaff)) {
    list = rawStaff;
  } else if (rawStaff && typeof rawStaff === "object") {
    const obj = rawStaff as Record<string, unknown>;
    if (Array.isArray(obj.staff)) list = obj.staff;
    else if (Array.isArray(obj.data)) list = obj.data;
    else console.warn("fetchStaff: unexpected response shape", rawStaff);
  }

  const leaveMap = new Map<string, LeaveRecord>();
  const leaveMapByName = new Map<string, LeaveRecord>();

  for (const record of leaves) {
    const candidates = [record.staffId, record.id].filter(Boolean) as string[];
    for (const candidate of candidates) {
      const existing = leaveMap.get(candidate);
      if (!existing || record.status === "PENDING") leaveMap.set(candidate, record);
    }
    const nameKey = record.staffName?.trim().toLowerCase() ?? '';
    if (nameKey) {
      const existingName = leaveMapByName.get(nameKey);
      if (!existingName || record.status === "PENDING") leaveMapByName.set(nameKey, record);
    }
  }

  const members = list.map((item) => {
    const member = normalizeStaffMember(item);
    const nameKey = member.name.trim().toLowerCase();
    const leaveRequest: LeaveRequest | undefined =
      leaveMap.get(member.id) ??
      leaveMap.get(member.employeeId) ??
      leaveMapByName.get(nameKey) ??
      member.leaveRequest;
    return { ...member, leaveRequest };
  });

  // Enrich leave balances from staffleavesummary in parallel
  const summaries = await Promise.allSettled(
    members.map((m) => getStaffLeaveSummary(m.id, academicYearId))
  );

  return members.map((m, i) => {
    const result = summaries[i];
    if (result.status !== "fulfilled" || result.value.length === 0) return m;
    const entries = result.value;
    const leaveBalance = entries.reduce((sum, e) => sum + (e.balance ?? 0), 0);
    const leavesTaken = entries.reduce((sum, e) => sum + (e.used ?? 0), 0);
    const leavesAllocated = entries.reduce((sum, e) => sum + (e.allocated ?? 0), 0);
    return { ...m, leaveBalance, leavesTaken, leavesAllocated };
  });
};

export const createStaff = async (
  input: CreateStaffPayload,
): Promise<StaffMember> => {
  const hasImage = input.image instanceof File;
  const body: CreateStaffPayload | FormData = hasImage
    ? Object.entries(input).reduce((fd, [key, value]) => {
        if (value === undefined || value === null || value === "") return fd;
        fd.append(key, value instanceof File ? value : String(value));
        return fd;
      }, new FormData())
    : input;

  try {
    const { data } = await api.post<StaffMember>(
      "/tenant/staff",
      body,
      hasImage ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    );
    console.log("createStaff success", { url: "/tenant/staff", payload: input, response: data });
    return data;
  } catch (err) {
    console.error("createStaff failed", { url: "/tenant/staff", payload: input, response: err });
    throw new Error(getErrorMessage(err, "Failed to create staff"));
  }
};

export const updateStaff = async (
  id: string,
  payload: UpdateStaffPayload,
): Promise<StaffMember> => {
  const url = `/tenant/updatestaffById/${id}`;
  const hasImage = payload.image instanceof File;
  const body: UpdateStaffPayload | FormData = hasImage
    ? Object.entries(payload).reduce((fd, [key, value]) => {
        if (value === undefined || value === null || value === "") return fd;
        fd.append(key, value instanceof File ? value : String(value));
        return fd;
      }, new FormData())
    : payload;
  console.log("📤 updateStaff →", url, hasImage ? "[multipart with image]" : JSON.stringify(payload, null, 2));

  try {
    const { data: raw, status: httpStatus } = await api.put<unknown>(
      url,
      body,
      hasImage ? { headers: { "Content-Type": "multipart/form-data" } } : undefined,
    );
    console.log("📥 updateStaff ←", httpStatus, JSON.stringify(raw, null, 2));

    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (obj?.status === false) {
        throw new Error((obj?.message as string) ?? "Update failed");
      }
      const item = obj?.data && typeof obj.data === "object" && !Array.isArray(obj.data)
        ? obj.data as Record<string, unknown>
        : obj;
      const camel = toCamelCase(item) as StaffMember;
      if (camel.id) return camel;
    }

    throw new Error("Invalid response from server");
  } catch (err) {
    console.error("❌ updateStaff failed", { url, response: err });
    throw new Error(getErrorMessage(err, "Failed to update staff"));
  }
};

/** DELETE /tenant/deletestaffById/:id — soft-delete (deactivate) a staff member */
export interface AssignedClassSubject {
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
  subject_id: string;
  subject_name: string;
}

export interface StaffDetails {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  qualification: string | null;
  emp_number: string;
  salary: number | null;
  date_of_birth: string | null;
  date_of_join: string | null;
  status: string;
  department: { id: string; departmentName: string } | null;
  leavesTaken?: number;
  leavesPending?: number;
  leavesBalance?: number;
  assigned_classes_subjects: AssignedClassSubject[];
}

export interface GetStaffDetailsByIdResponse {
  status: boolean;
  message?: string;
  data?: StaffDetails;
}

/** GET /tenant/getstaffById/:id — fetch detailed staff info */
export const getStaffDetailsById = async (id: string): Promise<StaffDetails> => {
  const { data } = await api.get<GetStaffDetailsByIdResponse>(`/tenant/getstaffById/${id}`);
  if (data?.status && data?.data) {
    return data.data;
  }
  throw new Error(data?.message || "Failed to fetch staff details");
};

export const deleteStaff = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tenant/deletestaffById/${id}`);
    console.log(`deleteStaff OK (${id})`);
  } catch (err) {
    console.error("deleteStaff failed", { url: `/tenant/deletestaffById/${id}`, response: err });
    const message = getErrorMessage(err, "Failed to delete staff");
    throw new Error(message);
  }
};
