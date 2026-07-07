import api from "@/config/axios";export interface ParentDetail {
  id: string;
  parent_name: string;
  relation: string;
  phone: string;
  email: string;
  occupation: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  address: string;
  photo?: string | null;

  class_id: string;
  sectionId: string;
  academicYearId: string;

  roll_number: string;
  admission_number: string;
  admission_date: string;
  status: "active" | "inactive";

  school_id: string;
  school_code: string;

  parentId?: string | null;

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

  // ADD THESE
  academicYear?: {
    id: string;
    yearName: string;
  };

  studentName?: string;

  parentDetail?: ParentDetail[];

  classTeacher?: {
    id?: string;
    first_name: string;
    last_name: string;
    phone?: string;
    email?: string;
  } | null;
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