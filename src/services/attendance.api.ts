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

export interface CreateAttendancePayload {
  class_id: string;
  section_id: string;
  teacher_id: string;
  academicYearId: string;
  date: string;
  attendance: {
    studentId: string;
    status: "present" | "absent";
  }[];
}

export interface CreateAttendanceResponse {
  status: boolean;
  class_id: string;
  section_id: string;
  date: string;
  total: number;
  present: number;
  absent: number;
  data: any[];
}

export interface StudentByClassSection {
  id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  admission_number: string;
  class_id: string;
  sectionId: string;
}

export interface StudentsByClassSectionResponse {
  status: boolean;
  count: number;
  class_id: string;
  section_id: string;
  data: StudentByClassSection[];
}

export interface ClassTodayStudentRecord {
  id: string;
  student_name: string;
  roll_no: string;
  attendance_status: "present" | "absent" | "late";
}

export interface GetClassTodayAttendanceResponse {
  status: boolean;
  date: string;
  attendance_status: string;
  class: { id: string; name: string };
  section: { id: string; name: string };
  total_students: number;
  present_students: number;
  absent_students: number;
  students: ClassTodayStudentRecord[];
}

export interface ChronicAbsenteeRecord {
  id: string;
  student_name: string;
  class_name?: string;
  section_name?: string;
  absent_days: number;
  last_absent_date?: string;
  parent_phone?: string;
  parent_name?: string;
}

export interface AbsentMoreThan5DaysResponse {
  status: boolean;
  data: ChronicAbsenteeRecord[];
}

/* ================= APIs ================= */

// GET all attendance
export const getAllAttendance = async (
  student_id: string,
  date: string
): Promise<GetAllAttendanceResponse> => {
  const { data } = await api.get(`/tenant/getallattendance`, {
    params: { student_id, date },
  });
  return data;
};

// GET by ID
export const getAttendanceById = async (
  id: string
): Promise<SingleAttendanceResponse> => {
  const { data } = await api.get(`/tenant/getattendanceById/${id}`);
  return data;
};

// CREATE
export const createAttendance = async (
  payload: CreateAttendancePayload
): Promise<CreateAttendanceResponse> => {
  const { data } = await api.post(`/tenant/createattendance`, payload);
  return data;
};

// UPDATE
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

// BULK
export const bulkAttendance = async (payload: any): Promise<any> => {
  const { data } = await api.post(`/tenant/attendance/bulk`, payload);
  return data;
};

// MONTHLY
export const getMonthlyAttendance = async (
  params: MonthlyAttendanceParams
): Promise<any> => {
  const { data } = await api.get(
    `/tenant/getMonthlyAttendanceByStudentId`,
    { params }
  );
  return data;
};

// YEARLY
export const getYearlyAttendance = async (
  params: YearlyAttendanceParams
): Promise<any> => {
  const { data } = await api.get(`/tenant/getYearlyAttendance`, {
    params,
  });
  return data;
};

// GET all classes today attendance summary
export const getAllClassesTodayAttendance = async (): Promise<{
  status: boolean;
  date: string;
  total_classes: number;
  data: {
    class: { id: string; name: string };
    section: { id: string; name: string };
    teacher?: { id: string; name: string };
    attendance_status: string;
    total_students: number;
    present_students: number;
    absent_students: number;
  }[];
}> => {
  const { data } = await api.get(`/tenant/getallclassestodayattendance`);
  return data;
};

// GET single class today attendance with per-student status
export const getClassTodayAttendance = async (
  class_id: string,
  section_id: string
): Promise<GetClassTodayAttendanceResponse> => {
  const { data } = await api.get(`/tenant/getclasstodayattendance`, {
    params: { class_id, section_id },
  });
  return data;
};

export const getAttendanceRoster = async (payload: {
  className: string;
  section: string;
  date: string;
}): Promise<any> => {
  const { data } = await api.post(`/tenant/attendance/roster`, payload);
  return data;
};

// WEEKLY
export const getWeeklyAttendance = async (
  params: WeeklyAttendanceParams
): Promise<WeeklyAttendanceResponse> => {
  const { data } = await api.get(
    `/tenant/getWeeklyAttendanceByStudentId`,
    { params }
  );
  return data;
};

// STUDENTS by class + section
export const getStudentsByClassSection = async (
  class_id: string,
  section_id: string
): Promise<StudentsByClassSectionResponse> => {
  const { data } = await api.get(`/tenant/studentsbyclasssection`, {
    params: { class_id, section_id },
  });
  return data;
};

// GET students absent more than 5 days
export const getAbsentMoreThan5Days =
  async (): Promise<AbsentMoreThan5DaysResponse> => {
    const { data } = await api.get(`/tenant/absentmorethan5days`);
    return data;
  };