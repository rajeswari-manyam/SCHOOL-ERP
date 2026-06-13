import api from "@/config/axios";

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  count?: number;
  data: T;
}

export interface FeeHeadDTO {
  id: string;
  name: string;
  code: string;
  description: string;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeeHeadPayload {
  FeeheadName: string;
  description?: string;
  displayOrder: number;
}

export interface FeeStructurePayload {
  id?: string;
  feeHeadId: string;
  classId: string;
  sectionId: string | null;
  mandatory: boolean;
  billingCycle: string;
  dueDate: string;
  amount: number | null;
  annualTotal: number | null;
  studentIds?: string[];
}

export const getFeeHeads = async () => {
  const res = await api.get<ApiResponse<FeeHeadDTO[]>>("/tenant/getallfeeheads");
  return res.data;
};

export const createFeeHead = async (payload: CreateFeeHeadPayload) => {
  const res = await api.post<ApiResponse<FeeHeadDTO>>("/tenant/addfeehead", payload);
  return res.data;
};

export interface Fee {
  id: string;
  student_id: string;
  fee_type: string;
  amount: number;
  amount_paid: number;
  due_date: string;
  payment_date: string | null;
  payment_method: string;
  transaction_id: string;
  status: string;
  academic_year: string;
  school_code: string;
  createdAt: string;
  updatedAt: string;
}

export const getAllFees = async (params: {
  student_id?: string;
  fee_type?: string;
  status?: string;
  academic_year?: string;
}) => {
  const res = await api.get<ApiResponse<Fee[]>>("/tenant/getallfees", { params });
  return res.data;
};

export const getFeeById = async (id: string) => {
  const res = await api.get<ApiResponse<Fee>>(`/tenant/getFeeById/${id}`);
  return res.data;
};

export const payFee = async (
  id: string,
  payload: { amount_paid: number; payment_method: string; transaction_id: string }
) => {
  const res = await api.put<ApiResponse<Fee>>(`/tenant/fees/${id}/payment`, payload);
  return res.data;
};

export const createFeeStructure = async (payload: FeeStructurePayload) => {
  const res = await api.post<ApiResponse<FeeStructurePayload>>("/tenant/addfeestructure", payload);
  return res.data;
};

export const updateFeeStructure = async (id: string, payload: FeeStructurePayload) => {
  const res = await api.put<ApiResponse<FeeStructurePayload>>(`/tenant/updatefeestructure/${id}`, payload);
  return res.data;
};

export const deleteFeeStructure = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/tenant/deletefeestructure/${id}`);
  return res.data;
};

export const getFeeStructures = async () => {
  const res = await api.get<ApiResponse<FeeStructurePayload[]>>("/tenant/getfeestructures");
  return res.data;
};