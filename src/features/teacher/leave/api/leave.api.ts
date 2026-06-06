import api from "@/config/axios";
import type {
  LeaveApplication, LeaveType, LeaveStatus, LeaveBalance,
  ApplyLeaveFormData, ApplyLeavePayload, ApplyLeaveResponse,
} from "../types/leave.types";

const SCHOOL_CODE = import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode");

const extractArray = (data: unknown, depth = 0): any[] => {
  if (depth > 3) return [];

  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const obj = data as Record<string, unknown>;

  const keysToTry = ["data", "leaves", "applications", "result", "records", "items", "list", "response", "balances", "leave_balances", "balance_list"];
  for (const key of keysToTry) {
    const val = obj[key];
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = extractArray(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  const values = Object.values(obj);
  for (const v of values) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") {
      const nested = extractArray(v, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

const mapLeaveApplication = (item: any): LeaveApplication => ({
  id: item?.id ?? item?._id ?? "",
  type: (item?.leave_type ?? item?.type ?? "CASUAL").toUpperCase() as LeaveType,
  fromDate: item?.start_date ?? item?.fromDate ?? "",
  toDate: item?.end_date ?? item?.toDate ?? "",
  totalDays: Number(item?.total_days ?? item?.totalDays ?? 0),
  reason: item?.reason ?? "",
  substituteArrangement: item?.substitute_arrangement ?? item?.substituteArrangement ?? undefined,
  medicalCertUrl: item?.medical_cert_url ?? item?.medicalCertUrl ?? undefined,
  status: (item?.status ?? "PENDING").toUpperCase() as LeaveStatus,
  appliedOn: item?.applied_on ?? item?.appliedOn ?? "",
  reviewedBy: item?.reviewed_by ?? item?.reviewedBy ?? undefined,
  reviewedOn: item?.reviewed_on ?? item?.reviewedOn ?? undefined,
  rejectionReason: item?.rejection_reason ?? item?.rejectionReason ?? undefined,
});

const LEAVETYPE_ACCENT: Record<string, string> = {
  CASUAL: "sky", SICK: "rose", PERSONAL: "violet", EMERGENCY: "amber",
};

const LEAVETYPE_LABEL: Record<string, string> = {
  casual: "Casual Leave", sick: "Sick Leave", personal: "Personal Leave", emergency: "Emergency Leave",
};

const mapLeaveBalance = (item: any): LeaveBalance => {
  const rawType = item?.leave_type ?? item?.type ?? "casual";
  const leaveType = rawType.toUpperCase() as LeaveType;
  return {
    type: leaveType,
    label: item?.label ?? LEAVETYPE_LABEL[rawType.toLowerCase()] ?? rawType,
    total: Number(item?.total ?? item?.total_days ?? item?.allocated ?? 0),
    used: Number(item?.used ?? item?.used_days ?? 0),
    remaining: Number(item?.remaining ?? item?.remaining_days ?? item?.balance ?? 0),
    accentColor: item?.accentColor ?? LEAVETYPE_ACCENT[leaveType] ?? "sky",
  };
};

export const leaveApi = {
  getLeaveBalances: async (staffId: string): Promise<LeaveBalance[]> => {
    try {
      const { data } = await api.get("/tenant/leavebalance", { params: { staff_id: "5b165170-41f3-489f-b7fe-dea209b55bac" } });
      const items = extractArray(data);
      if (items.length > 0) return items.map(mapLeaveBalance);

      if (data && typeof data === "object" && !Array.isArray(data)) {
        const obj = data as Record<string, unknown>;
        const source = obj.data && typeof obj.data === "object" ? obj.data as Record<string, unknown> : obj;
        const entries = Object.entries(source).filter(([_, v]) => v && typeof v === "object" && !Array.isArray(v));
        if (entries.length > 0) {
          return entries.map(([key, val]) => mapLeaveBalance({ ...(val as object), leave_type: key }));
        }
      }

      return [];
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error("getLeaveBalances failed", { staffId, response: ctx });
      const message = ctx?.message ?? ctx?.error ?? "Failed to load leave balances";
      throw new Error(message);
    }
  },

  getLeaveHistory: async (staffId: string): Promise<LeaveApplication[]> => {
    try {
      const { data } = await api.get("/tenant/getallleaves", { params: { staff_id: "5b165170-41f3-489f-b7fe-dea209b55bac" } });
      const items = extractArray(data);
      return items.map(mapLeaveApplication);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error("getLeaveHistory failed", { staffId, response: ctx });
      const message = ctx?.message ?? ctx?.error ?? "Failed to load leave history";
      throw new Error(message);
    }
  },

  applyLeave: async (form: ApplyLeaveFormData, staffId: string, totalDays?: number): Promise<LeaveApplication> => {
    void staffId;
    const payload: ApplyLeavePayload = {
      staff_id: "5b165170-41f3-489f-b7fe-dea209b55bac",
      leave_type: (form.type?.toLowerCase() ?? "casual") as ApplyLeavePayload["leave_type"],
      start_date: form.fromDate,
      end_date: form.toDate,
      total_days: totalDays ?? 0,
      reason: form.reason,
      school_code: SCHOOL_CODE,
    };
    try {
      const { data: res } = await api.post<ApplyLeaveResponse>("/tenant/createleaves", payload);
      return {
        id: res.data?.id ?? `l${Date.now()}`,
        type: form.type ?? "CASUAL",
        fromDate: form.fromDate,
        toDate: form.toDate,
        totalDays: res.data?.total_days ?? 0,
        reason: form.reason,
        substituteArrangement: form.substituteArrangement || undefined,
        status: (res.data?.status as LeaveApplication["status"]) ?? "PENDING",
        appliedOn: new Date().toISOString().split("T")[0],
      };
    } catch (err: any) {
      console.error("applyLeave failed", { url: "/tenant/createleaves", payload, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to apply leave";
      throw new Error(message);
    }
  },

  cancelLeave: async (id: string): Promise<void> => {
    try {
      await api.put(`/tenant/updateleaveById/${id}`, { status: "CANCELLED" });
    } catch (err: any) {
      console.error("cancelLeave failed", { id, response: err?.response?.data ?? err?.message });
      throw new Error(err?.response?.data?.message ?? err?.message ?? "Failed to cancel leave");
    }
  },
};
