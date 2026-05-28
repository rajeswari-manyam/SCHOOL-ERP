import api from "@/config/axios";



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

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  count?: number;
  data: T;
}


export const getAllFees = async (params: {
  student_id?: string;
  fee_type?: string;
  status?: string;
  academic_year?: string;
}) => {
  const res = await api.get<ApiResponse<Fee[]>>(
    "/tenant/getallfees",   // ✅ FIXED HERE
    { params }
  );
  return res.data;
};


export const getFeeById = async (id: string) => {
  const res = await api.get<ApiResponse<Fee>>(
    `/tenant/getFeeById/${id}`
  );
  return res.data;
};


export const createFee = async (payload: {
  student_id: string;
  fee_type: string;
  amount: number;
  amount_paid: number;
  due_date: string;
  payment_method: string;
  transaction_id: string;
  academic_year: string;
  school_code: string;
}) => {
  const res = await api.post<ApiResponse<Fee>>(
    "/tenant/createfees",
    payload
  );
  return res.data;
};


export const updateFeeById = async (
  id: string,
  payload: Partial<{
    amount_paid: number;
    payment_method: string;
    transaction_id: string;
  }>
) => {
  const res = await api.put<ApiResponse<Fee>>(
    `/tenant/updatefeeById/${id}`,
    payload
  );
  return res.data;
};


export const payFee = async (
  id: string,
  payload: {
    amount_paid: number;
    payment_method: string;
    transaction_id: string;
  }
) => {
  const res = await api.put<ApiResponse<Fee>>(
    `/tenant/fees/${id}/payment`,
    payload
  );
  return res.data;
};


export const deleteFeeById = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(
    `/tenant/deletefeeById/${id}`
  );
  return res.data;
};