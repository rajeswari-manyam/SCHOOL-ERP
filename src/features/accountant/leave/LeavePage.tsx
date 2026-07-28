// The leave workflow (apply, balances, history, calendar) is staff-generic —
// it resolves the logged-in user's own staff id and isn't teacher-specific,
// so the accountant portal reuses it directly rather than duplicating it.
export { default } from "@/features/teacher/leave/LeavePage";
