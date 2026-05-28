import api from "@/config/axios";
import type { AttendanceDay, AttendanceHistory, HolidayCalendar, Holiday, MarkAttendanceForm, CreateHolidayPayload } from "../types/attendance.types";
import {
  mockAttendanceToday,
  mockAttendanceHistory,
  mockHolidayCalendar,
} from "../store/mockData";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const mapHoliday = (item: any): Holiday => ({
  id: item?.id ?? item?._id ?? item?.holiday_id ?? "",
  name: item?.name ?? item?.holidayname ?? item?.holiday_name ?? item?.title ?? "",
  date: item?.date ?? item?.holiday_date ?? item?.start_date ?? "",
  type: (item?.type ?? item?.holiday_type ?? item?.type_name ?? "PUBLIC_HOLIDAY").toUpperCase() as Holiday["type"],
});

const extractHolidaysArray = (data: unknown, depth = 0): any[] => {
  if (depth > 3) return [];

  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const obj = data as Record<string, unknown>;

  const keysToTry = ["data", "holidays", "holiday_list", "result", "records", "items", "list", "response"];
  for (const key of keysToTry) {
    const val = obj[key];
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = extractHolidaysArray(val, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  const values = Object.values(obj);
  for (const v of values) {
    if (Array.isArray(v)) return v;
    if (v && typeof v === "object") {
      const nested = extractHolidaysArray(v, depth + 1);
      if (nested.length > 0) return nested;
    }
  }

  return [];
};

function transformHolidayResponse(raw: any, month: number, year: number): HolidayCalendar {
  const data = raw?.data ?? raw;

  const items = extractHolidaysArray(data);
  const holidays = items.length > 0 ? items.map(mapHoliday) : (data?.holidays ?? []).map(mapHoliday);

  let totalHolidaysThisYear = Number(data?.totalHolidaysThisYear ?? data?.total_holidays ?? data?.total_count ?? 0);
  if (!totalHolidaysThisYear && holidays.length > 0) {
    const uniqueDates = new Set(holidays.map((h: Holiday) => h.date));
    totalHolidaysThisYear = uniqueDates.size;
  }

  return {
    month: MONTHS[month],
    year,
    holidays,
    totalHolidaysThisYear,
    academicYear: data?.academicYear ?? data?.academic_year ?? `${year - 1}-${String(year).slice(2)}`,
  };
}

export const attendanceApi = {
  getAllHolidays: async (month: number, year: number): Promise<HolidayCalendar> => {
    try {
      const { data } = await api.get("/tenant/getallholidays");
      return transformHolidayResponse(data, month, year);
    } catch (err: any) {
      const ctx = err?.response?.data ?? err?.message;
      console.error("getAllHolidays failed", { url: "/tenant/getallholidays", response: ctx });
      const message = ctx?.message ?? ctx?.error ?? "Failed to fetch holidays";
      throw new Error(message);
    }
  },

  getToday: async (): Promise<AttendanceDay> => {
    try {
      const { data } = await api.get<AttendanceDay>("/tenant/attendance/today");
      return data;
    } catch {
      return mockAttendanceToday;
    }
  },

  getHistory: async (_params: {
    dateFrom: string;
    dateTo: string;
    classFilter: string;
  }): Promise<AttendanceHistory> => {
    try {
      const { data } = await api.get<AttendanceHistory>("/tenant/attendance/history", { params: _params });
      return data;
    } catch {
      return mockAttendanceHistory;
    }
  },

  getHolidayCalendar: async (): Promise<HolidayCalendar> => {
    try {
      const { data } = await api.get<HolidayCalendar>("/tenant/attendance/holidays");
      return data;
    } catch {
      return mockHolidayCalendar;
    }
  },

  submitAttendance: async (form: MarkAttendanceForm): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.post<{ success: boolean; message: string }>("/tenant/attendance/submit", form);
      return data;
    } catch (err: any) {
      console.error("submitAttendance failed", { url: "/tenant/attendance/submit", payload: form, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to submit attendance";
      throw new Error(message);
    }
  },

  addHoliday: async (_holiday: {
    name: string;
    date: string;
    type: string;
    repeatAnnually: boolean;
    notes?: string;
    notifyTeachers: boolean;
  }): Promise<{ success: boolean }> => {
    try {
      const { data } = await api.post<{ success: boolean }>("/tenant/attendance/holidays", _holiday);
      return data;
    } catch (err: any) {
      console.error("addHoliday failed", { url: "/tenant/attendance/holidays", payload: _holiday, response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to add holiday";
      throw new Error(message);
    }
  },

  createHolidayProduction: async (payload: CreateHolidayPayload): Promise<{ status: boolean; message: string }> => {
    const { data } = await api.post<{ status: boolean; message: string }>("/tenant/createholidays", payload);
    return data;
  },

  sendReminders: async (): Promise<{ success: boolean; remindersSent: number }> => {
    try {
      const { data } = await api.post<{ success: boolean; remindersSent: number }>("/tenant/attendance/reminders");
      return data;
    } catch (err: any) {
      console.error("sendReminders failed", { url: "/tenant/attendance/reminders", response: err?.response?.data ?? err?.message });
      const message = err?.response?.data?.message ?? JSON.stringify(err?.response?.data) ?? err?.message ?? "Failed to send reminders";
      throw new Error(message);
    }
  },

  exportCSV: async (): Promise<Blob> => {
    try {
      const { data } = await api.get<Blob>("/tenant/attendance/export", { responseType: "blob" });
      return data;
    } catch {
      const csv = "Class,Present,Absent,Method\n6A,32,2,WhatsApp\n6B,30,2,Web Form\n7A,28,2,WhatsApp\n";
      return new Blob([csv], { type: "text/csv" });
    }
  },
};
