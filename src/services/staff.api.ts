import api from "@/config/axios";



export interface StaffRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;

  qualification?: string;
  salary?: number;

  date_of_birth?: string;
  date_of_join?: string;

  class_teacher_of?: string;
  subject_teacher_of?: string;

  emp_number?: string;
  status?: string;

  bank_account_name?: string;
  bank_account_number?: string;
  ifsc_code?: string;

  leavesBalance?: number;
  leavesTaken?: number;
  leavesPending?: number;
}

/* =========================================================
   📘 GET ALL STAFF
========================================================= */

export interface GetAllStaffResponse {
  status: boolean;
  count: number;
  data: StaffRecord[];
}

export interface GetAllStaffParams {
  class_name?: string;
  section?: string;
  role?: string;
}

export const getAllStaff = async (
  params?: GetAllStaffParams
): Promise<GetAllStaffResponse> => {
  const { data } = await api.get<GetAllStaffResponse>(
    `/tenant/getallstaff`,
    { params }
  );
  return data;
};

/* =========================================================
   📘 GET STAFF BY ID
========================================================= */

export interface GetStaffByIdResponse {
  status: boolean;
  data: StaffRecord;
}

export const getStaffById = async (
  id: string
): Promise<GetStaffByIdResponse> => {
  const { data } = await api.get<GetStaffByIdResponse>(
    `/tenant/getstaffById/${id}`
  );
  return data;
};