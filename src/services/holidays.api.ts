import api from "@/config/axios";
import { getAuthToken } from "@/store/authStore";
import type { HolidayImportResponse } from "@/features/school-admin/attendance/types/holidayImport.types";

/* ================= TYPES ================= */

export interface HolidayFromApi {
  id: string;
  holidayname: string;
  from_date?: string;
  to_date?: string;
  date?: string;
  type: string;
  note: string;
  school_code: string;
  academicYearId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHolidayPayload {
  holidayname: string;
  from_date: string;
  to_date: string;
  type: string;
  note: string;
  school_code: string;
  academicYearId: string;
}

export interface UpdateHolidayPayload {
  holidayname?: string;
  from_date?: string;
  to_date?: string;
  type?: string;
  note?: string;
}

export interface GetAllHolidaysResponse {
  status: boolean;
  message?: string;
  data?: HolidayFromApi[] | { holidays: HolidayFromApi[]; totalHolidaysThisYear?: number; academicYear?: string };
  holidays?: HolidayFromApi[];
  totalHolidaysThisYear?: number;
  academicYear?: string;
}

export interface HolidayActionResponse {
  status: boolean;
  message: string;
  data?: HolidayFromApi;
}

export interface BulkAddHolidaysResponse {
  status: boolean;
  message: string;
  count: number;
  data: HolidayFromApi[];
}

/* ================= APIs ================= */

export const getAllHolidays = async (): Promise<GetAllHolidaysResponse> => {
  const { data } = await api.get(`/tenant/getallholidays`);
  return data;
};

export const getHolidayById = async (
  id: string
): Promise<HolidayActionResponse> => {
  const { data } = await api.get(`/tenant/getholidayById/${id}`);
  return data;
};

export const createHoliday = async (
  payload: CreateHolidayPayload
): Promise<BulkAddHolidaysResponse> => {
  const { data } = await api.post(`/tenant/createholidays`, payload);
  if (data?.status === false) {
    throw new Error(data.message ?? "Failed to create holiday");
  }
  return data;
};

export const updateHolidayById = async (
  id: string,
  payload: UpdateHolidayPayload
): Promise<HolidayActionResponse> => {
  const { data } = await api.put(`/tenant/updateholidayById/${id}`, payload);
  if (data?.status === false) {
    throw new Error(data.message ?? "Failed to update holiday");
  }
  return data;
};

export const deleteHolidayById = async (
  id: string
): Promise<HolidayActionResponse> => {
  const { data } = await api.delete(`/tenant/deleteholidayById/${id}`);
  if (data?.status === false) {
    throw new Error(data.message ?? "Failed to delete holiday");
  }
  return data;
};

export const bulkAddHolidays = async (
  holidays: CreateHolidayPayload[]
): Promise<BulkAddHolidaysResponse> => {
  try {
    const { data } = await api.post<BulkAddHolidaysResponse>(
      "/tenant/bulkaddholidays",
      { holidays }
    );
    if (!data?.status) throw new Error(data?.message ?? "Bulk add failed");
    return data;
  } catch (err: any) {
    const message = err?.response?.data?.message ?? err?.message ?? "Bulk add failed";
    throw new Error(message);
  }
};

/**
 * ⚠️ PENDING BACKEND INTEGRATION — UI-only per request.
 *
 * There is no confirmed Holiday Excel Import API yet (endpoint, method, and
 * response shape are all unconfirmed). This intentionally throws so the
 * Import UI (useHolidayImport → ImportHolidaysExcelPage) shows a clear
 * "not connected yet" state instead of pretending to succeed or silently
 * reusing bulkAddHolidays' different (non-file) contract.
 *
 * When a real Excel import endpoint is provided, replace this body — it
 * must resolve to a HolidayImportResponse. Do not change the Import UI
 * itself; it already renders whatever this returns.
 */
export const importHolidaysFromExcel = async (
  _file: File
): Promise<HolidayImportResponse> => {
  throw new Error(
    "Holiday Excel import is not connected to a backend API yet. The import screen is fully built — " +
    "it will start working as soon as importHolidaysFromExcel() is wired to the real endpoint."
  );
};

export const downloadHolidays = async (): Promise<Blob> => {
  const token = getAuthToken();
  const response = await api.get(`/tenant/holidaysdownload`, {
    responseType: "blob",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
};
