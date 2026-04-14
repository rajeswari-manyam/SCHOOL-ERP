import type { LeaveApplication, ApplyLeaveFormData, LeaveBalance } from "../types/leave.types";

export const leaveApi = {
  /** Fetch teacher's leave balances */
  getLeaveBalances: async (): Promise<LeaveBalance[]> => {
    // const res = await axios.get("/api/teacher/leave/balances");
    // return res.data;
    return Promise.resolve([]);
  },

  /** Fetch all leave applications for the teacher */
  getLeaveHistory: async (): Promise<LeaveApplication[]> => {
    // const res = await axios.get("/api/teacher/leave/applications");
    // return res.data;
    return Promise.resolve([]);
  },

  /** Submit a new leave application */
  applyLeave: async (form: ApplyLeaveFormData): Promise<LeaveApplication> => {
    // const payload = new FormData();
    // Object.entries(form).forEach(([k, v]) => v && payload.append(k, v));
    // const res = await axios.post("/api/teacher/leave/apply", payload);
    // return res.data;
    void form;
    return Promise.reject(new Error("Not implemented"));
  },

  /** Cancel a pending leave application */
  cancelLeave: async (id: string): Promise<void> => {
    // await axios.patch(`/api/teacher/leave/${id}/cancel`);
    void id;
  },
};
