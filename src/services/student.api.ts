import api from "@/config/axios";
export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  address: string;
  photo?: string;

  class_id: string;
  sectionId: string;
  academicYearId: string;

  roll_number: string;
  admission_number: string;
  admission_date: string;
  status: "active" | "inactive";

  school_id: string;
  school_code: string;

  createdAt: string;
  updatedAt: string;

  classDetail?: {
    id: string;
    class_name: string;
  };

  sectionDetail?: {
    id: string;
    sectionName: string;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export const getStudentById = async (
  studentId: string
): Promise<Student> => {
  const response = await api.get<ApiResponse<Student>>(
    `/tenant/getstudentsById/${studentId}`
  );
  return response.data.data;
};