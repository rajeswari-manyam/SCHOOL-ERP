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



/* ================= API ================= */

export const getParentById = async (parentId: string): Promise<Parent> => {
  const { data } = await api.get(`/tenant/getparentById/${parentId}`);
  return data.data;
};
