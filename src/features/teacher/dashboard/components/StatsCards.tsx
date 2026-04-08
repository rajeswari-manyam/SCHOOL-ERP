import type{ TeacherDashboardStats } from "../types/dashboard.types";

interface StatsCardsProps {
  stats: TeacherDashboardStats;
}

export const StatsCards = ({ stats }: StatsCardsProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div className="card bg-blue-100 p-4">
      <div className="text-lg font-bold">{stats.totalStudents}</div>
      <div className="text-gray-600">Students</div>
    </div>
    <div className="card bg-green-100 p-4">
      <div className="text-lg font-bold">{stats.totalClasses}</div>
      <div className="text-gray-600">Classes</div>
    </div>
    <div className="card bg-yellow-100 p-4">
      <div className="text-lg font-bold">{stats.totalAssignments}</div>
      <div className="text-gray-600">Assignments</div>
    </div>
    <div className="card bg-purple-100 p-4">
      <div className="text-lg font-bold">{stats.upcomingEvents}</div>
      <div className="text-gray-600">Upcoming Events</div>
    </div>
  </div>
);
