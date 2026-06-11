import api from "@/config/axios";
import type { CreateStaffPayload, StaffMember, UpdateStaffPayload } from "../types/staff.types";

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

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      acc[camelKey] = toCamelCase(obj[key]);
      return acc;
    }, {} as Record<string, any>);
  }
  return obj;
};

const normalizeRole = (role?: string): StaffMember["role"] => {
  const value = (role ?? "").toLowerCase().trim();

  if (value === "teacher" || value.includes("teacher")) return "Teacher";
  if (value === "admin" || value.includes("admin")) return "Admin";
  if (value === "support" || value.includes("support")) return "Support";

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  return (isUuid ? "Staff" : (role ?? "Staff")) as StaffMember["role"];
};

const normalizeStatus = (status?: string): StaffMember["status"] => {
  const value = (status ?? "").toUpperCase();
  if (value === "ACTIVE" || value === "INACTIVE" || value === "ON_LEAVE") return value as StaffMember["status"];
  return "ACTIVE";
};

const normalizeStaffMember = (item: any): StaffMember => {
  const camel = toCamelCase(item);
  const role = normalizeRole(camel.role ?? camel.designation ?? camel.position);
  const status = normalizeStatus(camel.status);
  const isTeaching = /teacher/i.test(camel.role ?? "") || Boolean(camel.isTeaching);

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
    classes: Array.isArray(camel.classes) ? camel.classes : [],
    subjects: Array.isArray(camel.subjects) ? camel.subjects : [],
    leaveBalance: Number(camel.leaveBalance ?? camel.leavesBalance ?? 0),
    isTeaching,
    leaveRequest: camel.leaveRequest,
    createdAt: camel.createdAt,
    updatedAt: camel.updatedAt,
  };
};

export const fetchStaffStats = async (): Promise<StaffStatsSummary> => {
  const { data } = await api.get<StaffStatsResponse>("/tenant/staffstats");

  if (!data?.status || !data?.data) {
    throw new Error("Invalid response from /tenant/staffstats");
  }

  return {
    total: Number(data.data.totalStaff ?? 0),
    teachers: Number(data.data.teacherCount ?? 0),
    nonTeaching: Number(data.data.nonTeachingCount ?? 0),
    leavePending: Number(data.data.pendingLeaves ?? 0),
  };
};

export const fetchStaff = async (): Promise<StaffMember[]> => {
  const { data } = await api.get("/tenant/getallstaff");
  console.log("fetchStaff raw response:", JSON.stringify(data));
  let list: any[] = [];
  if (Array.isArray(data)) list = data;
  else if (data?.staff && Array.isArray(data.staff)) list = data.staff;
  else if (data?.data && Array.isArray(data.data)) list = data.data;
  else console.warn("fetchStaff: unexpected response shape", data);
  return list.map(normalizeStaffMember);
};

export const createStaff = async (
  input: CreateStaffPayload,
): Promise<StaffMember> => {
  try {
    const { data } = await api.post("/tenant/staff", input);
    console.log("createStaff success", { url: "/tenant/staff", payload: input, response: data });
    return data;
  } catch (err: any) {
    // Log useful debug information to the console so the frontend can reveal
    // backend validation details during development.
    console.error("createStaff failed", {
      url: "/tenant/staff",
      payload: input,
      response: err?.response?.data ?? err?.message,
    });

    // Throw a clearer error message that callers can display.
    const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to create staff";
    throw new Error(message);
  }
};

export const updateStaff = async (
  id: string,
  payload: UpdateStaffPayload,
): Promise<StaffMember> => {
  const url = `/tenant/updatestaffById/${id}`;
  console.log("📤 updateStaff →", url, JSON.stringify(payload, null, 2));

  try {
    const { data: raw, status: httpStatus } = await api.put(url, payload);
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
  } catch (err: unknown) {
    const error = err as { response?: { status?: number; data?: { message?: string } }; message?: string };
    console.error("❌ updateStaff failed", {
      url,
      status: error?.response?.status,
      responseData: error?.response?.data,
      message: error?.message,
    });
    const message =
      error?.response?.data?.message ??
      JSON.stringify(error?.response?.data) ??
      error?.message ??
      "Failed to update staff";
    throw new Error(message);
  }
};
