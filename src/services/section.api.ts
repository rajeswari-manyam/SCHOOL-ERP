import api from "@/config/axios";

export interface Section {
  id: string;
  sectionName: string;
  classId: string;
  classTeacherId: string;
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