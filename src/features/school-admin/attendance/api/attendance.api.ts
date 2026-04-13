import type { AttendancePageData } from "../types/attendance.types";
import { MOCK_ATTENDANCE_DATA } from "../utils/constants";

export async function fetchAttendanceData(): Promise<AttendancePageData> {
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase.rpc("get_attendance_today", { school_id });
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_ATTENDANCE_DATA;
}

export async function sendReminderToUnmarked(classIds: string[]): Promise<void> {
  console.info("[API] sendReminderToUnmarked →", classIds);
  await new Promise((r) => setTimeout(r, 300));
}

export async function exportAttendanceCSV(date: string): Promise<void> {
  console.info("[API] exportAttendanceCSV →", date);
  await new Promise((r) => setTimeout(r, 300));
}