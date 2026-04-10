import type { TeacherDashboardStats } from "../types/dashboard.types";

const MOCK_TEACHER_STATS: TeacherDashboardStats = {
  totalStudents:    142,
  totalClasses:     6,
  totalAssignments: 24,
  upcomingEvents:   3,
};

export const fetchTeacherDashboardStats = async (): Promise<TeacherDashboardStats> => {
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_TEACHER_STATS;
};
