import type { PlatformStats } from "../types/dashboard.types";

interface PlatformStatsGridProps {
  stats: PlatformStats;
}

export const PlatformStatsGrid = ({ stats }: PlatformStatsGridProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">Total Schools</p>
      <p className="text-2xl font-bold">{stats.totalSchools}</p>
      <p className="text-green-600 text-sm">{stats.activeSchools} active</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">Total Students</p>
      <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">Total Teachers</p>
      <p className="text-2xl font-bold">{stats.totalTeachers.toLocaleString()}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-gray-500 text-sm">Monthly Revenue</p>
      <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
    </div>
  </div>
);
