import api from "@/config/axios";

export interface CreateParentPayload {
  parent_name: string;
  relation: string;
  occupation: string;
  email: string;
  phone: string;
  students: string[];
  address: string;
  school_id: string;
}

export const parentsApi = {
  createParent: async (payload: CreateParentPayload) => {
    const { data } = await api.post("/tenant/createparents", payload);
    return data;
  },
};
