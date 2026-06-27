import api from "@/config/axios";

export interface LedgerEntryRecord {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paidVia: string;
  reference?: string | null;
  notes?: string | null;
  attachment?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LedgerEntryResponse {
  status: boolean;
  message: string;
  data: LedgerEntryRecord;
}

interface GetAllLedgerEntriesResponse {
  status: boolean;
  message: string;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  data: LedgerEntryRecord[];
}

interface DeleteLedgerEntryResponse {
  status: boolean;
  message: string;
}

export const getAllLedgerEntries = async (
  month?: number,
  year?: number
): Promise<GetAllLedgerEntriesResponse> => {
  const { data } = await api.get<GetAllLedgerEntriesResponse>("/tenant/getalledgerentries", {
    params: month && year ? { month, year } : undefined,
  });
  return data;
};

export const createLedgerEntry = async (formData: FormData): Promise<LedgerEntryResponse> => {
  const { data } = await api.post<LedgerEntryResponse>("/tenant/createledgerentry", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const updateLedgerEntryById = async (
  id: string,
  formData: FormData
): Promise<LedgerEntryResponse> => {
  const { data } = await api.put<LedgerEntryResponse>(
    `/tenant/updateledgerentryById/${id}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const getLedgerEntryById = async (id: string): Promise<LedgerEntryResponse> => {
  const { data } = await api.get<LedgerEntryResponse>(`/tenant/getledgerentryById/${id}`);
  return data;
};

export const deleteLedgerEntryById = async (id: string): Promise<DeleteLedgerEntryResponse> => {
  const { data } = await api.delete<DeleteLedgerEntryResponse>(
    `/tenant/deleteledgerentryById/${id}`
  );
  return data;
};
