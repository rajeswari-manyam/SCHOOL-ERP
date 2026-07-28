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

// ✅ Updated — API requires class_id, section_id, academicYearId
export interface YearlyAttendanceParams {
  studentId: string;
  year: number;
  class_id: string;
  section_id: string;
  academicYearId: string;
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

// ✅ Updated to match actual API response shape
export interface YearlyAttendanceResponse {
  status: boolean;
  studentId: string;
  academicYearId: string;
  summary: {
    present: number;
    absent: number;
    total: number;
  };
  records: AttendanceRecord[];
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

export interface MonthlyAttendanceResponse {
  status: boolean;
  studentId: string;
  month: number;
  year: number;
  summary: {
    total: number;
    present: number;
    absent: number;
    present_dates: string[];
    absent_dates: string[];
  };
  records: any[];
}

// MONTHLY
export const getMonthlyAttendance = async (
  params: MonthlyAttendanceParams
): Promise<MonthlyAttendanceResponse> => {
  const { data } = await api.get(
    `/tenant/getMonthlyAttendanceByStudentId`,
    { params }
  );
  return data;
};

// ✅ YEARLY — updated to send class_id, section_id, academicYearId
export const getYearlyAttendance = async (
  params: YearlyAttendanceParams
): Promise<YearlyAttendanceResponse> => {
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

// GET class attendance for today (date param not supported by this endpoint)
export const getClassAttendanceByDate = async (
  class_id: string,
  section_id: string,
  _date: string
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

// ─── Staff Attendance ──────────────────────────────────────────────────────────
export type StaffAttendanceStatusValue = "present" | "absent" | "late" | "leave" | "halfday";

export interface StaffAttendanceRecord {
  id: string;
  staff_id: string;
  date: string;
  status: StaffAttendanceStatusValue;
  working_day: boolean;
  academicYearId: string | null;
  school_code: string;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffAttendancePayload {
  school_code: string;
  attendance_records: {
    staff_id: string;
    date: string;
    status: "present" | "absent" | "late" | "leave";
    working_day: boolean;
    remarks?: string;
    academicYearId?: string;
  }[];
}

export interface CreateStaffAttendanceResponse {
  status: boolean;
  message: string;
  data: StaffAttendanceRecord[];
}

export interface GetAllStaffAttendanceResponse {
  status: boolean;
  count: number;
  data: StaffAttendanceRecord[];
}

export interface GetStaffAttendanceByIdResponse {
  status: boolean;
  data: StaffAttendanceRecord;
}

export interface UpdateStaffAttendancePayload {
  status?: string;
  remarks?: string;
}

export interface UpdateStaffAttendanceResponse {
  status: boolean;
  message: string;
  data: StaffAttendanceRecord;
}

export interface DeleteStaffAttendanceResponse {
  status: boolean;
  message: string;
}

export interface MonthlyStaffAttendanceParams {
  staff_id: string;
  month: number;
  year: number;
}

export interface MonthlyStaffAttendanceResponse {
  status: boolean;
  staff_id: string;
  month: number;
  year: number;
  summary: {
    totalDaysInMonth: number;
    workingDays: number;
    present: number;
    absent: number;
    halfday: number;
    leave: number;
    markedDays: number;
    unmarkedDays: number;
  };
  records: StaffAttendanceRecord[];
}

export interface DateRangeStaffAttendanceParams {
  // All optional — omitting staff_id returns every staff member's records for
  // the range; omitting start_date/end_date returns that staff's full history.
  staff_id?: string;
  start_date?: string;
  end_date?: string;
}

export interface DateRangeStaffAttendanceResponse {
  status: boolean;
  staff_id: string | null;
  start_date: string | null;
  end_date: string | null;
  summary: {
    totalDays: number;
    workingDays: number;
    present: number;
    absent: number;
    halfday: number;
    leave: number;
  };
  records: StaffAttendanceRecord[];
}

export interface YearlyStaffAttendanceParams {
  staff_id: string;
  year: number;
}

export interface YearlyStaffAttendanceResponse {
  status: boolean;
  staff_id: string;
  year: number;
  summary: {
    markedDays: number;
    workingDays: number;
    present: number;
    absent: number;
    halfday: number;
    leave: number;
  };
  monthlyBreakdown: Record<string, {
    present: number;
    absent: number;
    halfday: number;
    leave: number;
    workingDays: number;
  }>;
  records: StaffAttendanceRecord[];
}

/** POST /tenant/createstaffattendance */
export const createStaffAttendance = async (
  payload: CreateStaffAttendancePayload
): Promise<CreateStaffAttendanceResponse> => {
  const { data } = await api.post("/tenant/createstaffattendance", payload);
  return data;
};

/** GET /tenant/getallstaffattendance */
export const getAllStaffAttendance = async (): Promise<GetAllStaffAttendanceResponse> => {
  const { data } = await api.get("/tenant/getallstaffattendance");
  return data;
};

/** GET /tenant/getstaffattendanceByStaffId/{staffId} */
export const getStaffAttendanceByStaffId = async (
  staffId: string
): Promise<GetAllStaffAttendanceResponse> => {
  const { data } = await api.get(`/tenant/getstaffattendanceByStaffId/${staffId}`);
  return data;
};

/** GET /tenant/getstaffattendanceById/{id} */
export const getStaffAttendanceById = async (
  id: string
): Promise<GetStaffAttendanceByIdResponse> => {
  const { data } = await api.get(`/tenant/getstaffattendanceById/${id}`);
  return data;
};

/** PUT /tenant/updatestaffattendanceById/{id} */
export const updateStaffAttendanceById = async (
  id: string,
  payload: UpdateStaffAttendancePayload
): Promise<UpdateStaffAttendanceResponse> => {
  const { data } = await api.put(`/tenant/updatestaffattendanceById/${id}`, payload);
  return data;
};

/** DELETE /tenant/deletestaffattendanceById/{id} */
export const deleteStaffAttendanceById = async (
  id: string
): Promise<DeleteStaffAttendanceResponse> => {
  const { data } = await api.delete(`/tenant/deletestaffattendanceById/${id}`);
  return data;
};

/** GET /tenant/getMonthlyStaffAttendance */
export const getMonthlyStaffAttendance = async (
  params: MonthlyStaffAttendanceParams
): Promise<MonthlyStaffAttendanceResponse> => {
  const { data } = await api.get("/tenant/getMonthlyStaffAttendance", { params });
  return data;
};

/** GET /tenant/getDateRangeStaffAttendance */
export const getDateRangeStaffAttendance = async (
  params: DateRangeStaffAttendanceParams
): Promise<DateRangeStaffAttendanceResponse> => {
  const { data } = await api.get("/tenant/getDateRangeStaffAttendance", { params });
  return data;
};

/** GET /tenant/getYearlyStaffAttendance */
export const getYearlyStaffAttendance = async (
  params: YearlyStaffAttendanceParams
): Promise<YearlyStaffAttendanceResponse> => {
  const { data } = await api.get("/tenant/getYearlyStaffAttendance", { params });
  return data;
};

export interface StudentTodayAttendanceResponse {
  status: boolean;
  studentId: string;
  date: string;
  summary: {
    present: number;
    absent: number;
    total: number;
  };
  records: AttendanceRecord[];
}

export const getStudentTodayAttendance = async (
  studentId: string
): Promise<StudentTodayAttendanceResponse> => {
  const { data } = await api.get(
    `/tenant/getstudenttodayattendance`,
    { params: { studentId } }
  );
  return data;
};