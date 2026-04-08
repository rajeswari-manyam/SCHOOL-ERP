import { StatsCards } from "../components/StatsCards";
import { useTeacherDashboardStats } from "../hooks/useTeacherDashboard";

export default function DashboardPage() {
  const { data, isLoading } = useTeacherDashboardStats();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : data ? (
        <StatsCards stats={data} />
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
}
