import api from "@/config/axios";

/* ── getallclasses ── */

export interface ClassRecord {
  id: string;
  class_name: string;
  section: string;
  academic_year: string;
  class_teacher: string;
  classteacherid: string | null;
  capacity: number;
  total_strength: number;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllClassesResponse {
  status: boolean;
  count: number;
  data: ClassRecord[];
}

export interface GetAllClassesParams {
  academic_year?: string;
  section?: string;
  status?: string;
  class?: string;
  school_code?: string;
}

export const getAllClasses = async (
  params: GetAllClassesParams
): Promise<GetAllClassesResponse> => {
  const { data } = await api.get<GetAllClassesResponse>(
    `/tenant/getallclasses`,
    { params }
  );
  return data;
};

/* ── getallstaff ── */

export interface StaffRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  qualification: string;
  salary: number;
  date_of_birth: string;
  date_of_join: string;
  class_teacher_of: string;   // e.g. "10-A"
  subject_teacher_of: string;
  emp_number: string;
  status: string;
  leavesBalance: number;
  leavesTaken: number;
  leavesPending: number;
}

export interface GetAllStaffResponse {
  status: boolean;
  count: number;
  data: StaffRecord[];
}

export const getAllStaff = async (params: {
  class?: string;
  section?: string;
}): Promise<GetAllStaffResponse> => {
  const { data } = await api.get<GetAllStaffResponse>(
    `/tenant/getallstaff`,
    { params }
  );
  return data;
};