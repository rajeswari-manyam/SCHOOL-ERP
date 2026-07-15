import api from "@/config/axios";

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
  // The backend always expands from_date..to_date into one record per day and
  // returns them as an array under `data` (with a `count`) — even for a
  // single-day holiday — never a lone HolidayFromApi object.
  const { data } = await api.post(`/tenant/createholidays`, payload);
  return data;
};

export const updateHolidayById = async (
  id: string,
  payload: UpdateHolidayPayload
): Promise<HolidayActionResponse> => {
  const { data } = await api.put(`/tenant/updateholidayById/${id}`, payload);
  return data;
};

export const deleteHolidayById = async (
  id: string
): Promise<HolidayActionResponse> => {
  const { data } = await api.delete(`/tenant/deleteholidayById/${id}`);
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
