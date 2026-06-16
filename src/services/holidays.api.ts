import api from "@/config/axios";

/* ================= TYPES ================= */

export interface HolidayFromApi {
  id: string;
  holidayname: string;
  date: string;
  type: string;
  note: string;
  school_code: string;
  academicYearId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHolidayPayload {
  holidayname: string;
  date: string;
  type: string;
  note: string;
  school_code: string;
  academicYearId: string;
}

export interface UpdateHolidayPayload {
  holidayname?: string;
  date?: string;
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
): Promise<HolidayActionResponse> => {
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
