import api from "@/config/axios";
import type { CreateStaffPayload, StaffMember } from "../types/staff.types";

export const fetchStaff = async (): Promise<StaffMember[]> => {
  const { data } = await api.get("/tenant/staff");
  return data;
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
