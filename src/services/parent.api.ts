import api from "@/config/axios";

/* ================= TYPES ================= */

export interface Parent {
  id: string;
  parent_name: string;
  relation: string;
  occupation: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  school_id: string;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  blood_group: string;
  address: string;
  photo: string | null;
  class_id: string | null;
  class: string;
  section: string;
  roll_number: string;
  admission_number: string;
  admission_date: string | null;
  status: string;
  school_id: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

/* ================= API ================= */

export const getParentById = async (parentId: string): Promise<Parent> => {
  const { data } = await api.get(`/tenant/getparentById/${parentId}`);
  return data.data;
};

export const getstudentsById = async (studentId: string): Promise<Student> => {
  const { data } = await api.get(`/tenant/getstudentsById/${studentId}`);
  return data.data;
};