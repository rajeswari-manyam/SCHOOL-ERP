import api from "@/config/axios";
import type { CreateStaffPayload, StaffMember, UpdateStaffPayload } from "../types/staff.types";

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

export const fetchStaff = async (): Promise<StaffMember[]> => {
  const { data } = await api.get("/tenant/getallstaff");
  console.log("fetchStaff raw response:", JSON.stringify(data));
  let list: any[] = [];
  if (Array.isArray(data)) list = data;
  else if (data?.staff && Array.isArray(data.staff)) list = data.staff;
  else if (data?.data && Array.isArray(data.data)) list = data.data;
  else console.warn("fetchStaff: unexpected response shape", data);
  return list.map(toCamelCase) as StaffMember[];
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
