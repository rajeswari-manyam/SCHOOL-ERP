import api from "@/config/axios";

/* ── TYPES ── */

export interface Complaint {
  id: string;
  complainant_id?: string;
  complainant_type?: string;
  regarding_id: string;
  regarding_type: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  status: string;
  school_code: string;
  photos?: string[];
  resolution?: string | null;
  resolved_by?: string | null;
  resolved_at?: string | null;
  createdAt: string;
  updatedAt: string;
}

/* ── GET ALL COMPLAINTS ── */

export interface GetComplaintsResponse {
  status: boolean;
  data: Complaint[];
}

export const getComplaints = async (
  school_code: string
): Promise<GetComplaintsResponse> => {
  const { data } = await api.get<GetComplaintsResponse>(
    `/tenant/getcomplaints`,
    { params: { school_code } }
  );
  return data;
};

/* ── GET COMPLAINT BY ID ── */

export interface GetComplaintByIdResponse {
  status: boolean;
  data: Complaint;
}

export const getComplaintById = async (
  complaintId: string
): Promise<GetComplaintByIdResponse> => {
  const { data } = await api.get<GetComplaintByIdResponse>(
    `/tenant/getcomplaintById/${complaintId}`
  );
  return data;
};

/* ── CREATE COMPLAINT ── */

export interface CreateComplaintPayload {
  complainant_id: string;
  complainant_type: string;
  regarding_id: string;
  regarding_type: string;
  subject: string;
  description: string;
  category: string;
  school_code: string;
  priority: "low" | "medium" | "high";
  photos?: string[];
}

export interface CreateComplaintResponse {
  status: boolean;
  message: string;
  data: Complaint;
}

export const createComplaint = async (
  payload: CreateComplaintPayload
): Promise<CreateComplaintResponse> => {
  const { data } = await api.post<CreateComplaintResponse>(
    `/tenant/createcomplaints`,
    payload
  );
  return data;
};

/* ── UPDATE COMPLAINT ── */

export interface UpdateComplaintPayload {
  subject?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: string;
  resolution?: string;
}

export interface UpdateComplaintResponse {
  status: boolean;
  message?: string;
  data: Complaint;
}

export const updateComplaintById = async (
  complaintId: string,
  payload: UpdateComplaintPayload
): Promise<UpdateComplaintResponse> => {
  const { data } = await api.put<UpdateComplaintResponse>(
    `/tenant/updatecomplaintById/${complaintId}`,
    payload
  );
  return data;
};

/* ── DELETE COMPLAINT ── */

export interface DeleteComplaintResponse {
  status: boolean;
  message: string;
}

export const deleteComplaintById = async (
  complaintId: string
): Promise<DeleteComplaintResponse> => {
  const { data } = await api.delete<DeleteComplaintResponse>(
    `/tenant/deletecomplaintById/${complaintId}`
  );
  return data;
};