import api from "@/config/axios";

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  count?: number;
  data: T;
}

// ── Payments ─────────────────────────────────────────────────────────────────

export interface CreatePaymentPayload {
  student_id: string;
  academicYearId: string;
  feeHeadMappingId?: string;
  transportfeeId?: string;
  feeConcessionId?: string;
  amount_received: number;
  payment_mode: string;
  reference_no: string;
  payment_date: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  student_id: string;
  academicYearId: string;
  fee_type: string;
  fee_reference_id: string;
  feehead_id: string;
  total_fee: number;
  amount_received: number;
  total_paid: number;
  balance_amount: number;
  payment_mode: string;
  reference_no: string;
  receipt_no: string;
  payment_date: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  studentName?: string;
  feeName?: string;
  academicYear?: string;
  payment_summary?: {
    total_fee: number;
    total_paid_before: number;
    amount_received: number;
    total_paid: number;
    balance_amount: number;
  };
}

export const createPayment = async (payload: CreatePaymentPayload) => {
  const res = await api.post<ApiResponse<PaymentRecord>>("/tenant/createpayment", payload);
  return res.data;
};

export interface FeeSummaryEntry {
  fee_type: string;
  id: string;
  feeName: string;
  total_fee: number;
  total_paid: number;
  balance: number;
}

export interface PaymentsByStudentData {
  student: { id: string; name: string };
  fee_summaries: FeeSummaryEntry[];
  payments: PaymentRecord[];
}

export const getPaymentsByStudentId = async (studentId: string) => {
  const res = await api.get<ApiResponse<PaymentsByStudentData>>(
    `/tenant/getpaymentsbystudentid/${studentId}`
  );
  return res.data;
};

// ── Student-specific fee queries ──────────────────────────────────────────────

export interface StudentFeeSummaryDetail {
  id: string;
  feeHeadName: string | null;
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "PENDING" | "PAID" | "PARTIAL";
  dueDate: string | null;
  type?: "fee" | "transport" | "concession";
  fee_type?: "fee" | "transport" | "concession";
  feeHeadMappingId?: string;
  transportfeeId?: string;
  feeConcessionId?: string;
}

export interface StudentFeeSummaryResponse {
  status: boolean;
  data: {
    student: { id: string; name: string };
    summary: {
      totalOriginal: number;
      totalDiscount: number;
      totalFinal: number;
      totalPaid: number;
      totalDue: number;
      overallStatus: string;
    };
    details: StudentFeeSummaryDetail[];
  };
}

export const getPendingFeesByStudentId = async (studentId: string) => {
  const res = await api.get<StudentFeeSummaryResponse>(
    `/tenant/getpendingfeesbystudentid/${studentId}`
  );
  return res.data;
};

export const downloadPaymentReceipt = async (paymentId: string): Promise<void> => {
  const res = await api.get(`/tenant/downloadpaymentreceipt/${paymentId}`, {
    responseType: "blob",
  });
  const contentType = String(res.headers["content-type"] ?? "application/pdf");
  const blob = new Blob([res.data], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${paymentId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const deletePaymentById = async (id: string) => {
  const res = await api.delete<{ status: boolean; message: string }>(
    `/tenant/deletepaymentById/${id}`
  );
  return res.data;
};

// ── Record Fee Payments ───────────────────────────────────────────────────────

export interface RecordFeePaymentPayload {
  class_id: string;
  section_id: string;
  student_id: string;
  payment_mode: string;
  amount: number;
  topay: number;
  receipt_no: string;
  transaction_id?: string;
  payment_date: string;
}

export interface RecordFeePaymentRecord {
  id: string;
  class_id: string;
  section_id: string;
  student_id: string;
  payment_mode: string;
  amount: number;
  topay: number;
  receipt_no: string;
  transaction_id?: string;
  payment_date: string;
  createdAt: string;
  updatedAt: string;
  studentName?: string;
  className?: string | null;
  sectionName?: string;
}

export const createRecordFeePayment = async (payload: RecordFeePaymentPayload) => {
  const res = await api.post<ApiResponse<RecordFeePaymentRecord>>("/tenant/createrecordfeepayment", payload);
  return res.data.data;
};

export const getAllRecordFeePayments = async () => {
  const res = await api.get<{ status: boolean; count: number; totalPages: number; currentPage: number; data: RecordFeePaymentRecord[] }>("/tenant/getallrecordfeepayments");
  return res.data;
};

export interface AllPaymentsRecord {
  id: string;
  student_id: string;
  academicYearId: string;
  fee_type: string;
  fee_reference_id: string;
  feehead_id: string;
  total_fee: number;
  amount_received: number;
  total_paid: number;
  balance_amount: number;
  payment_mode: string;
  reference_no: string;
  receipt_no: string;
  payment_date: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  studentName: string;
  feeName: string;
  academicYear: string;
}

export const getAllPayments = async () => {
  const res = await api.get<{ status: boolean; count: number; totalPages: number; currentPage: number; data: AllPaymentsRecord[] }>("/tenant/getallpayments");
  return res.data;
};

export const getRecordFeePaymentById = async (id: string) => {
  const res = await api.get<ApiResponse<RecordFeePaymentRecord>>(`/tenant/getrecordfeepaymentById/${id}`);
  return res.data;
};

export const updateRecordFeePaymentById = async (id: string, payload: Partial<RecordFeePaymentPayload>) => {
  const res = await api.put<ApiResponse<RecordFeePaymentRecord>>(`/tenant/updaterecordfeepaymentById/${id}`, payload);
  return res.data;
};

export const deleteRecordFeePayment = async (id: string) => {
  const res = await api.delete<{ status: boolean; message: string }>(`/tenant/deleterecordfeepaymentById/${id}`);
  return res.data;
};

export const downloadRecordFeePayment = async (id: string): Promise<void> => {
  const res = await api.get(`/tenant/downloadpaymentreceipt/${id}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `receipt-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadRecordFeePaymentById = async (id: string): Promise<void> => {
  const res = await api.get(`/tenant/downloadrecordfeepaymentById/${id}`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `receipt-${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// ── All Pending Fees ──────────────────────────────────────────────────────────

export interface AllPendingFeesEntry {
  student: { id: string; name: string };
  summary: {
    totalOriginal: number;
    totalDiscount: number;
    totalFinal: number;
    totalPaid: number;
    totalDue: number;
    overallStatus: string;
  };
  details: StudentFeeSummaryDetail[];
}

export interface GetAllPendingFeesResponse {
  status: boolean;
  count: number;
  totalPages: number;
  currentPage: number;
  data: AllPendingFeesEntry[];
}

export const getAllPendingFees = async () => {
  const res = await api.get<GetAllPendingFeesResponse>("/tenant/getallpendingfees");
  return res.data;
};

// ── Student lookup (for modals) ───────────────────────────────────────────────

export interface StudentByClassSectionRecord {
  id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  admission_number: string;
  class_name: string;
  section_name: string;
}

export const getStudentsByClassSection = async (class_id: string, section_id: string) => {
  const res = await api.get<ApiResponse<StudentByClassSectionRecord[]>>(
    `/tenant/studentsbyclasssection`,
    { params: { class_id, section_id } }
  );
  return res.data;
};

// ── Fee Heads ─────────────────────────────────────────────────────────────────

export interface FeeHeadDTO {
  id: string;
  feeName: string;
  description?: string;
  displayOrder: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getFeeHeads = async () => {
  const res = await api.get<ApiResponse<FeeHeadDTO[]>>("/tenant/getallfeeheads");
  return res.data;
};

export const getFeeHeadById = async (id: string) => {
  const res = await api.get<ApiResponse<FeeHeadDTO>>(`/tenant/getfeeheadById/${id}`);
  return res.data;
};

export const createFeeHead = async (payload: {
  feeName: string;
  description?: string;
  displayOrder?: number | string;
  status?: string;
}) => {
  const res = await api.post<ApiResponse<FeeHeadDTO>>("/tenant/addfeehead", payload);
  return res.data;
};

export const updateFeeHead = async (id: string, payload: Partial<{
  feeName: string;
  description: string;
  displayOrder: number | string;
  status: string;
}>) => {
  const res = await api.put<ApiResponse<FeeHeadDTO>>(`/tenant/updatefeeheadById/${id}`, payload);
  return res.data;
};

// ── Fee Structures ────────────────────────────────────────────────────────────

export interface AssignedStudent {
  id: string;
  first_name: string;
  last_name: string;
  admission_number: string;
}

export interface FeeHeadMappingDTO {
  id: string;
  feeHeadId: string;
  academicYearId: string;
  classId: string;
  sectionId: string | null;
  amount: number;
  dueDate: string;
  isMandatory: boolean;
  applicableTo: string;
  allowConcession: boolean;
  concessionTypes: string[];
  billingCycle: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  feeHeadName: string;
  className: string;
  sectionName: string | null;
  academicYear: string;
  assignedStudents: AssignedStudent[];
}

export const getFeeStructures = async (params: {
  class_id: string;
  section_id: string;
  fromDate: string;
  toDate: string;
}) => {
  const res = await api.get<{ status: boolean; count: number; data: FeeHeadMappingDTO[] }>(
    "/tenant/getallfeeheadmappings",
    { params }
  );
  return res.data;
};

export const getFeeHeadMappingById = async (id: string) => {
  const res = await api.get<ApiResponse<FeeHeadMappingDTO>>(`/tenant/getfeeheadmappingById/${id}`);
  return res.data;
};

export interface AddFeePayload {
  feeHeadId: string;
  academicYearId: string;
  classId: string;
  sectionId: string;
  amount: number;
  dueDate: string;
  applicableTo: string;
  selectedStudentIds?: string[];
  billingCycle: string;
  isMandatory?: boolean;
  allowConcession?: boolean;
  concessionTypes?: string[];
}

export const addFee = async (payload: AddFeePayload) => {
  const res = await api.post<ApiResponse<FeeHeadMappingDTO>>("/tenant/addfee", payload);
  return res.data;
};

export const updateFeeHeadMapping = async (id: string, payload: Partial<AddFeePayload>) => {
  const res = await api.put<ApiResponse<FeeHeadMappingDTO>>(`/tenant/updatefeeheadmappingById/${id}`, payload);
  return res.data;
};

export const deleteFeeHeadMapping = async (id: string) => {
  const res = await api.delete<{ status: boolean; message: string }>(`/tenant/deletefeeheadmappingById/${id}`);
  return res.data;
};

export const deleteFeeHeadById = async (id: string) => {
  const res = await api.delete<{ status: boolean; message: string }>(`/tenant/deletefeeheadById/${id}`);
  return res.data;
};

// ── Concessions ───────────────────────────────────────────────────────────────

export interface ConcessionRecord {
  id: string;
  studentId?: string;
  feeStructureId?: string;
  concessionType?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  totalAmount?: number;
  discountAmount?: number;
  finalAmount?: number;
  reason?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  createdAt?: string;
  updatedAt?: string;
  studentName?: string;
  feeHeadName?: string;
  // legacy snake_case fields
  feeheadName?: string;
  concession_type?: string;
  amount_type?: string;
  amount?: number;
  effective_from?: string;
  effective_until?: string;
  academicYearId?: string;
}

export interface CreateConcessionPayload {
  studentId: string;
  feeStructureId: string;
  concessionType: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  reason?: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
}

export const getAllConcessions = async () => {
  const res = await api.get<ApiResponse<ConcessionRecord[]>>("/tenant/getallconcessions");
  return res.data;
};

export const getConcessionsByStudentId = async (studentId: string) => {
  const res = await api.get<ApiResponse<ConcessionRecord[]>>(`/tenant/getconcessionsbystudentId/${studentId}`);
  return res.data;
};

export const getConcessionById = async (id: string) => {
  const res = await api.get<ApiResponse<ConcessionRecord>>(`/tenant/getconcessionById/${id}`);
  return res.data;
};

export const addConcession = async (payload: CreateConcessionPayload) => {
  const res = await api.post<ApiResponse<ConcessionRecord>>("/tenant/addconcession", payload);
  return res.data;
};

export const deleteConcession = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/tenant/deleteconcessionById/${id}`);
  return res.data;
};

export const updateConcession = async (id: string, payload: Partial<CreateConcessionPayload>) => {
  const res = await api.put<ApiResponse<ConcessionRecord>>(`/tenant/updateconcessionById/${id}`, payload);
  return res.data;
};

// ── Transport Fees ────────────────────────────────────────────────────────────

export interface TransportFeeRecord {
  id: string;
  feehead_id: string;
  slab_name: string;
  from_km: number;
  to_km: number;
  student_id: string;
  section_id: string;
  class_id: string;
  monthly_fee: number;
  annual_fee: number;
  academicYearId?: string;
  createdAt?: string;
  updatedAt?: string;
  feeHeadName?: string;
  studentName?: string;
  className?: string;
  sectionName?: string;
}

export interface AddTransportFeePayload {
  feehead_id: string;
  slab_name: string;
  from_km: number;
  to_km: number;
  student_id: string;
  section_id: string;
  class_id: string;
  academicYearId: string;
  monthly_fee: number;
  annual_fee: number;
}

export const getAllTransportFees = async () => {
  const res = await api.get<ApiResponse<TransportFeeRecord[]>>("/tenant/getalltransportfees");
  return res.data;
};

export const getTransportFeeById = async (id: string) => {
  const res = await api.get<ApiResponse<TransportFeeRecord>>(`/tenant/gettransportfeeById/${id}`);
  return res.data;
};

export const addTransportFee = async (payload: AddTransportFeePayload) => {
  const res = await api.post<ApiResponse<TransportFeeRecord>>("/tenant/addtransportfee", payload);
  return res.data;
};

export const updateTransportFeeById = async (id: string, payload: Partial<AddTransportFeePayload>) => {
  const res = await api.put<ApiResponse<TransportFeeRecord>>(`/tenant/updatetransportfeeById/${id}`, payload);
  return res.data;
};

export const deleteTransportFee = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/tenant/deletetransportfeeById/${id}`);
  return res.data;
};
