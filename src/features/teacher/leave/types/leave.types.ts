export interface LeaveRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface CreateLeaveRequestInput {
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequestInput extends Partial<CreateLeaveRequestInput> {}
