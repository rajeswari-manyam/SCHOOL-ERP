import { StatCard } from "@/components/common/StatCard";
import { AttendanceLineChart } from "@/components/charts/AttendanceLineChart";
import { FeeBarChart } from "@/components/charts/FeeBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { useRealtimeDashboard } from "./hooks/useRealtimeDashboard";

const DashboardPage = () => {
  const { data, isLoading } = useDashboardStats();
  useRealtimeDashboard();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={data?.students ?? 0} />
        <StatCard title="Attendance %" value={data?.attendance ?? 0} />
        <StatCard title="Fees Collected" value={data?.fees ?? 0} />
        <StatCard title="Defaulters" value={data?.defaulters ?? 0} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceLineChart data={data?.attendanceTrend ?? []} />
        <FeeBarChart data={data?.feeStats ?? []} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DonutChart data={data?.categoryBreakdown ?? []} />
      </div>
    </div>
  );
};

export default DashboardPage;
