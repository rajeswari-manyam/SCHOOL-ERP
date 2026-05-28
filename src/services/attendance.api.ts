// src/features/attendance/api/attendance.api.ts

import api from "@/config/axios";

/* ================= TYPES ================= */

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  date: string;
  status: "present" | "absent" | "late";
  reason?: string | null;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllAttendanceResponse {
  status: boolean;
  data: AttendanceRecord[];
}

export interface SingleAttendanceResponse {
  status: boolean;
  data: AttendanceRecord;
}

export interface CreateAttendancePayload {
  class: string;
  section: string;
  date: string;
  school_code: string;
  attendance: {
    studentId: string;
    roll: string;
    name: string;
    status: string;
  }[];
}

export interface UpdateAttendancePayload {
  status: string;
  remarks?: string;
}

export interface MonthlyAttendanceParams {
  studentId: string;
  month: number;
  year: number;
}

export interface YearlyAttendanceParams {
  studentId: string;
  year: number;
}


export interface WeeklyAttendanceSummary {
  present: number;
  absent: number;
  total: number;
}

export interface WeeklyAttendanceResponse {
  status: boolean;
  studentId: string;
  start_date: string;
  end_date: string;
  summary: WeeklyAttendanceSummary;
  records: AttendanceRecord[];
}

export interface WeeklyAttendanceParams {
  studentId: string;
  start_date: string;
  end_date: string;
}
/* ================= API CALLS ================= */

// GET /tenant/getallattendance
export const getAllAttendance = async (
  student_id: string,
  date: string
): Promise<GetAllAttendanceResponse> => {
  const { data } = await api.get<GetAllAttendanceResponse>(
    `/tenant/getallattendance`,
    {
      params: { student_id, date },
    }
  );
  return data;
};

// GET /tenant/getattendanceById/:id
export const getAttendanceById = async (
  id: string
): Promise<SingleAttendanceResponse> => {
  const { data } = await api.get<SingleAttendanceResponse>(
    `/tenant/getattendanceById/${id}`
  );
  return data;
};

// POST /tenant/createattendance
export const createAttendance = async (
  payload: CreateAttendancePayload
): Promise<any> => {
  const { data } = await api.post(`/tenant/createattendance`, payload);
  return data;
};

// PUT /tenant/updateattendanceById/:id
export const updateAttendanceById = async (
  id: string,
  payload: UpdateAttendancePayload
): Promise<any> => {
  const { data } = await api.put(
    `/tenant/updateattendanceById/${id}`,
    payload
  );
  return data;
};

// POST /tenant/attendance/bulk
export const bulkAttendance = async (payload: any): Promise<any> => {
  const { data } = await api.post(`/tenant/attendance/bulk`, payload);
  return data;
};

// GET /tenant/getMonthlyAttendanceByStudentId
export const getMonthlyAttendance = async (
  params: MonthlyAttendanceParams
): Promise<any> => {
  const { data } = await api.get(
    `/tenant/getMonthlyAttendanceByStudentId`,
    { params }
  );
  return data;
};

// GET /tenant/getYearlyAttendance
export const getYearlyAttendance = async (
  params: YearlyAttendanceParams
): Promise<any> => {
  const { data } = await api.get(`/tenant/getYearlyAttendance/`, {
    params,
  });
  return data;
};

// GET /tenant/getclasstodayattendance
export const getClassTodayAttendance = async (
  className: string,
  section: string
): Promise<any> => {
  const { data } = await api.get(
    `/tenant/getclasstodayattendance`,
    {
      params: { className, section },
    }
  );
  return data;
};

// POST /tenant/attendance/roster
export const getAttendanceRoster = async (payload: {
  className: string;
  section: string;
  date: string;
}): Promise<any> => {
  const { data } = await api.post(
    `/tenant/attendance/roster`,
    payload
  );
  return data;
};
// GET /tenant/getWeeklyAttendanceByStudentId
export const getWeeklyAttendance = async (
  params: WeeklyAttendanceParams
): Promise<WeeklyAttendanceResponse> => {
  const { data } = await api.get<WeeklyAttendanceResponse>(
    `/tenant/getWeeklyAttendanceByStudentId`,
    {
      params,
    }
  );
  return data;
};