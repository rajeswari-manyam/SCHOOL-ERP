import api from "@/config/axios";
import type { CreateStaffPayload, StaffMember } from "../types/staff.types";

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
