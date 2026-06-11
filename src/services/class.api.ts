import api from "@/config/axios";

export interface ClassRecord {
  id: string;
  class_name: string;
  academicYearId: string;

  section?: string;
  class_teacher?: string;
  classteacherid?: string | null;

  capacity?: number;
  total_strength?: number;

  description?: string;
  status?: string;

  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   📘 GET ALL CLASSES
========================================================= */

export interface GetAllClassesResponse {
  status: boolean;
  count: number;
  data: ClassRecord[];
}

export interface GetAllClassesParams {
  academicYearId?: string;
  section?: string;
  status?: string;
  class_name?: string;
}

export const getAllClasses = async (
  params?: GetAllClassesParams
): Promise<GetAllClassesResponse> => {
  const { data } = await api.get<GetAllClassesResponse>(
    `/tenant/getallclasses`,
    { params }
  );
  return data;
};

/* =========================================================
   📘 CREATE CLASS
========================================================= */

export interface CreateClassPayload {
  class_name: string;
  academicYearId: string;
}

export interface CreateClassResponse {
  status: boolean;
  message: string;
  data: ClassRecord;
}

export const createClass = async (
  payload: CreateClassPayload
): Promise<CreateClassResponse> => {
  const { data } = await api.post<CreateClassResponse>(
    `/tenant/class`,
    payload
  );
  return data;
};

/* =========================================================
   📘 GET CLASS BY ID
========================================================= */

export interface GetClassByIdResponse {
  status: boolean;
  data: ClassRecord;
}

export const getClassById = async (
  id: string
): Promise<GetClassByIdResponse> => {
  const { data } = await api.get<GetClassByIdResponse>(
    `/tenant/getclassById/${id}`
  );
  return data;
};

/* =========================================================
   📘 GET SECTIONS BY CLASS ID  ← NEW
========================================================= */

export interface SectionRecord {
  id: string;
  sectionName: string;
  section_name?: string;
  classId: string;
  class_name?: string;
  capacity?: number;
  total_strength?: number;
  class_teacher?: string;
  classteacherid?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetSectionsByClassIdResponse {
  status: boolean;
  count: number;
  data: SectionRecord[];
}

export const getSectionsByClassId = async (
  classId: string
): Promise<GetSectionsByClassIdResponse> => {
  const { data } = await api.get<GetSectionsByClassIdResponse>(
    `/tenant/getallsections`,
    { params: { class_id: classId } }   // ← query param, not path param
  );
  return data;
};

/* =========================================================
   📘 STAFF TYPES
========================================================= */

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