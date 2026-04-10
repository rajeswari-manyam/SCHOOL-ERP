import { StatCard } from "../../../components/ui/statcard";
import { AttendanceLineChart } from "@/components/charts/AttendanceLineChart";
import { FeeBarChart } from "@/components/charts/FeeBarChart";
import { DonutChart } from "@/components/charts/DonutChart";
import { useRealtimeDashboard } from "./hooks/useRealtimeDashboard";

const MOCK_SCHOOL_ADMIN_STATS = {
  students: 1250,
  attendance: 94.5,
  fees: 520000,
  defaulters: 45,
  attendanceTrend: [
    { date: "Mon", attendance: 1200 },
    { date: "Tue", attendance: 1210 },
    { date: "Wed", attendance: 1195 },
    { date: "Thu", attendance: 1205 },
    { date: "Fri", attendance: 1180 },
  ],
  feeStats: [
    { month: "Jan", fees: 40000 },
    { month: "Feb", fees: 50000 },
  ],
  categoryBreakdown: [
    { name: "Primary", value: 500 },
    { name: "Middle", value: 450 },
    { name: "High", value: 300 },
  ],
};

const DashboardPage = () => {
  const data = MOCK_SCHOOL_ADMIN_STATS;
  useRealtimeDashboard();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={data?.students ?? 0} />
        <StatCard label="Attendance %" value={data?.attendance ?? 0} />
        <StatCard label="Fees Collected" value={data?.fees ?? 0} />
        <StatCard label="Defaulters" value={data?.defaulters ?? 0} />
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
