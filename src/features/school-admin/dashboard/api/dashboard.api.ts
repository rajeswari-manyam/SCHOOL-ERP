
import type { DashboardData } from "../types/dashboard.types";
import { MOCK_DASHBOARD_DATA } from "../utils/constants";

/**
 * Fetches the full dashboard snapshot for today.
 *
 * TODO: Replace the mock return with a real Supabase / REST call, e.g.
 *
 *   const { data, error } = await supabase
 *     .rpc("get_dashboard_snapshot", { school_id: schoolId });
 *   if (error) throw error;
 *   return data as DashboardData;
 */
export async function fetchDashboardData(
  // schoolId: string   ← add real params when wiring up
): Promise<DashboardData> {
  // Simulate network latency in dev
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_DASHBOARD_DATA;
}

/**
 * Sends a WhatsApp reminder to teachers of the supplied classes.
 *
 * TODO: Replace with real API call:
 *   POST /api/whatsapp/remind  { classes }
 */
export async function sendAttendanceReminder(classes: string[]): Promise<void> {
  console.info("[API] sendAttendanceReminder →", classes);
  await new Promise((r) => setTimeout(r, 300));
}

/**
 * Triggers a broadcast message to all parents.
 *
 * TODO: Replace with real API call.
 */
export async function sendBroadcast(message: string): Promise<void> {
  console.info("[API] sendBroadcast →", message);
  await new Promise((r) => setTimeout(r, 300));
}