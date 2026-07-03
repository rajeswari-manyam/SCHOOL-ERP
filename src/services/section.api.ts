import api from "@/config/axios";

export interface Section {
  id: string;
  sectionName: string;
  classId: string;
  className?: string;
  classTeacherId: string;
  classTeacherName?: string;
  class_teacher_id?: string;
  academicYearId: string;
  totalStrength: number;
  currentStrength: number;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    class_name: string;
  };
  academicYear?: {
    id: string;
    yearName: string;
  };
  classTeacher?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

export interface SectionsByClassResponse {
  status: boolean;
  count?: number;
  data: Array<{
    id: string;
    sectionName?: string;
    section_name?: string;
    classTeacherId?: string;
    class_teacher_id?: string;
    classTeacherName?: string;
    class_teacher_name?: string;
    totalStrength?: number;
    total_strength?: number;
    subjectCount?: number;
    subject_count?: number;
    totalSubjects?: number;
    classId?: string;
    class_id?: string;
    academicYearId?: string;
    academic_year_id?: string;
  }>;
}

/** GET /tenant/getsectionsbyclassId/{classId} */
export const getSectionsByClassIdFromApi = async (classId: string): Promise<SectionsByClassResponse> => {
  const { data } = await api.get<SectionsByClassResponse>(
    `/tenant/getsectionsbyclassId/${classId}`
  );
  return data;
};

/** GET /tenant/getallsections — filtered client-side by class ID */
export const getSectionsByClassId = async (classId: string): Promise<Section[]> => {
  const all = await getAllSections();
  return all.filter((s) => s.classId === classId);
};

/** GET /tenant/getsections/:id */
export const getSectionById = async (sectionId: string): Promise<Section> => {
  const { data } = await api.get<ApiResponse<Section>>(
    `/tenant/getsections/${sectionId}`
  );
  return data.data;
};

/** GET /tenant/getallsections */
export const getAllSections = async (): Promise<Section[]> => {
  const { data } = await api.get<ApiResponse<Section[]>>(
    "/tenant/getallsections"
  );
  return data.data;
};

/** GET /tenant/getallsections?classTeacherId=... */
export const getSectionsByTeacherId = async (classTeacherId: string): Promise<Section[]> => {
  const { data } = await api.get<ApiResponse<Section[]>>(
    "/tenant/getallsections",
    { params: { classTeacherId } }
  );
  return data.data ?? [];
};

export interface SectionStrength {
  sectionId: string;
  sectionName: string;
  totalStrength: number;
  currentStrength: number;
  availableSeats: number;
}

export interface SectionStudent {
  id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  admission_number: string;
  class_id: string;
  class_name: string;
  section_id: string;
  section_name: string;
}

/** GET /tenant/getsectionstrength/{sectionId} */
export const getSectionStrength = async (sectionId: string): Promise<SectionStrength> => {
  const { data } = await api.get<{ status: boolean; data: SectionStrength }>(
    `/tenant/getsectionstrength/${sectionId}`
  );
  return data.data;
};

/** GET /tenant/studentsbyclasssection?class_id=&section_id= */
export const getStudentsByClassSection = async (classId: string, sectionId: string): Promise<SectionStudent[]> => {
  const { data } = await api.get<{ status: boolean; count: number; data: SectionStudent[] }>(
    `/tenant/studentsbyclasssection`,
    { params: { class_id: classId, section_id: sectionId } }
  );
  return data.data ?? [];
};