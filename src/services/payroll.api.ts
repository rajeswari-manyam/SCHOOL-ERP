import api from "@/config/axios";

export interface CreatePayrollPayload {
  staff_id: string;
  salary: string;
  pf_percentage: number;
  hra: number;
  professional_tax: number;
  transport_allowance: number;
  tds_monthly: number;
  other_allowance: number;
  effective_from: string;
  academicYearId: string;
}

export interface PayrollRecord {
  id: string;
  staff_id: string;
  staff_name: string;
  role: string;
  base_salary: number;
  pf_percentage: number;
  pf_amount: number;
  hra: number;
  transport_allowance: number;
  other_allowance: number;
  professional_tax: number;
  tds_monthly: number;
  gross_salary: number;
  total_deduction: number;
  net_salary: number;
  effective_from: string;
  academicYearId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePayrollRecord {
  id: string;
  staff_id: string;
  staff_name: string;
  role: string;
  base_salary: number;
  pf_percentage: number;
  pf_amount: number;
  hra: number;
  transport_allowance: number;
  other_allowance: number;
  professional_tax: number;
  tds_monthly: number;
  gross_salary: number;
  total_deduction: number;
  net_salary: number;
  effective_from: string;
  academicYearId: string;
}

export interface CreatePayrollResponse {
  status: boolean;
  message: string;
  data: CreatePayrollRecord;
}

export interface GetAllPayrollResponse {
  status: boolean;
  count: number;
  data: PayrollRecord[];
}

export interface UpdatePayrollPayload {
  pf_percentage?: number;
  hra?: number;
  professional_tax?: number;
  transport_allowance?: number;
  tds_monthly?: number;
  other_allowance?: number;
  effective_from?: string;
}

export interface UpdatePayrollResponse {
  status: boolean;
  message: string;
  data: PayrollRecord;
}

export interface DeletePayrollResponse {
  status: boolean;
  message: string;
}

export const createPayroll = async (
  payload: CreatePayrollPayload
): Promise<CreatePayrollResponse> => {
  const { data } = await api.post<CreatePayrollResponse>(
    "/tenant/createpayroll",
    payload
  );
  return data;
};

export const getAllPayroll = async (): Promise<GetAllPayrollResponse> => {
  const { data } = await api.get<GetAllPayrollResponse>("/tenant/getallpayroll");
  return data;
};

export const updatePayrollById = async (
  id: string,
  payload: UpdatePayrollPayload
): Promise<UpdatePayrollResponse> => {
  const { data } = await api.put<UpdatePayrollResponse>(
    `/tenant/updatepayrollById/${id}`,
    payload
  );
  return data;
};

export const deletePayrollById = async (id: string): Promise<DeletePayrollResponse> => {
  const { data } = await api.delete<DeletePayrollResponse>(
    `/tenant/deletepayrollById/${id}`
  );
  return data;
};

// ── Payslip APIs ──────────────────────────────────────────────────────────────

export interface CreatePayslipPayload {
  staff_id: string;
  month: number;
  year: number;
  payroll_id?: string;
  academicYearId?: string;
  bonus?: number;
  overtime?: number;
  extra_class_payment?: number;
}

export interface PayslipRecord {
  id: string;
  staff_id: string;
  staff_name: string;
  academicYearId?: string;
  month: number;
  year: number;
  present_days: number;
  absent_days: number;
  base_salary: number;
  hra: number | null;
  transport_allowance: number | null;
  other_allowance: number | null;
  bonus: number | null;
  overtime: number | null;
  extra_class_payment: number | null;
  total_earnings: number | null;
  gross_salary: number;
  professional_tax: number | null;
  tds_monthly: number | null;
  pf: number | null;
  leave_deduction: number | null;
  total_deductions: number | null;
  net_salary: number;
  payment_status: "Pending" | "Paid";
  payment_date: string | null;
  remarks: string | null;
}

export interface CreatePayslipData {
  id: string;
  staff_id: string;
  staff_name: string;
  month: number;
  year: number;
  present_days: number;
  absent_days: number;
  base_salary: number;
  gross_salary: number;
  net_salary: number;
  payment_status: "Pending" | "Paid";
  earnings: {
    hra: number;
    transport_allowance: number;
    other_allowance: number;
    bonus: number;
    overtime: number;
    extra_class_payment: number;
    total_earnings: number;
  };
  deductions: {
    professional_tax: number;
    tds_monthly: number;
    pf: number;
    leave_deduction: number;
    total_deductions: number;
  };
}

export interface CreatePayslipResponse {
  status: boolean;
  message: string;
  data: CreatePayslipData;
}

export interface GetAllPayslipsResponse {
  status: boolean;
  message: string;
  totalRecords: number;
  data: PayslipRecord[];
}

export const createPayslip = async (
  payload: CreatePayslipPayload
): Promise<CreatePayslipResponse> => {
  const { data } = await api.post<CreatePayslipResponse>("/tenant/createpayslips", payload);
  return data;
};

export const getAllPayslips = async (): Promise<GetAllPayslipsResponse> => {
  const { data } = await api.get<GetAllPayslipsResponse>("/tenant/getallpayslips");
  return data;
};

export interface UpdatePayslipPayload {
  overtime?: number;
  bonus?: number;
  extra_class_payment?: number;
  base_salary?: number;
  hra?: number;
  transport_allowance?: number;
  other_allowance?: number;
  present_days?: number;
  absent_days?: number;
  professional_tax?: number;
  tds_monthly?: number;
  pf?: number;
  leave_deduction?: number;
  payment_status?: "Pending" | "Paid";
  remarks?: string;
}

export interface UpdatePayslipResponse {
  status: boolean;
  message: string;
  data: PayslipRecord;
}

export interface DeletePayslipResponse {
  status: boolean;
  message: string;
}

export const updatePayslipById = async (
  id: string,
  payload: UpdatePayslipPayload
): Promise<UpdatePayslipResponse> => {
  const { data } = await api.put<UpdatePayslipResponse>(
    `/tenant/updatepayslipById/${id}`,
    payload
  );
  return data;
};

export const deletePayslipById = async (id: string): Promise<DeletePayslipResponse> => {
  const { data } = await api.delete<DeletePayslipResponse>(
    `/tenant/deletepayslipById/${id}`
  );
  return data;
};

// ── Payroll History API ───────────────────────────────────────────────────────

export interface PayrollHistoryRecord {
  month: number;
  year: number;
  staff_count: number;
  gross_salary: number;
  total_deductions: number;
  net_paid: number;
  payment_date: string | null;
  payment_mode: string;
  payment_status: "Paid" | "Pending";
}

export interface PayrollHistorySummary {
  total_records: number;
  total_gross_salary: number;
  total_deductions: number;
  total_net_paid: number;
}

export interface GetPayrollHistoryResponse {
  status: boolean;
  message: string;
  data: PayrollHistoryRecord[];
  summary: PayrollHistorySummary;
}

export const getPayrollHistory = async (): Promise<GetPayrollHistoryResponse> => {
  const { data } = await api.get<GetPayrollHistoryResponse>("/tenant/getpayrollhistory");
  return data;
};

export interface MonthlyPaidPayrollResponse {
  status: boolean;
  message: string;
  data: { month: number; academicYearId: string; total_paid: number };
}

export const getMonthlyPaidPayroll = async (
  month: number,
  academicYearId: string
): Promise<MonthlyPaidPayrollResponse> => {
  const { data } = await api.get<MonthlyPaidPayrollResponse>(
    "/tenant/getmonthlypaidpayroll",
    { params: { month, academicYearId } }
  );
  return data;
};
