import { axios } from "@/config/axios";
import { LeaveRequest, CreateLeaveRequestInput, UpdateLeaveRequestInput } from "../types/leave.types";

export const fetchLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const { data } = await axios.get("/teacher/leave");
  return data;
};

export const createLeaveRequest = async (input: CreateLeaveRequestInput): Promise<LeaveRequest> => {
  const { data } = await axios.post("/teacher/leave", input);
  return data;
};

export const updateLeaveRequest = async (id: string, input: UpdateLeaveRequestInput): Promise<LeaveRequest> => {
  const { data } = await axios.put(`/teacher/leave/${id}` , input);
  return data;
};

export const deleteLeaveRequest = async (id: string): Promise<void> => {
  await axios.delete(`/teacher/leave/${id}`);
};
