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

export interface ParentChild {
  id: string;
  name: string;
}

export interface GetParentChildrenResponse {
  status: boolean;
  data: ParentChild[];
}

export const getParentChildren = async (
  parentId: string,
  schoolCode: string
): Promise<GetParentChildrenResponse> => {
  const { data } = await api.get<GetParentChildrenResponse>(
    `/tenant/parent/${parentId}/students`,
    { params: { school_code: schoolCode } }
  );
  return data;
};
