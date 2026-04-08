import { usePlatformStats, useSchoolHealthList, useRevenueData, useCronStatus } from "../hooks/usePlatformStats";
import { PlatformStatsGrid, SchoolHealthList, RevenueWidget, CronStatusCard } from "../components";

export default function DashboardPage() {
  const { data: stats } = usePlatformStats();
  const { data: schoolHealth = [] } = useSchoolHealthList();
  const { data: revenue = [] } = useRevenueData();
  const { data: cronJobs = [] } = useCronStatus();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Platform Dashboard</h1>
      
      {stats && <PlatformStatsGrid stats={stats} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SchoolHealthList schools={schoolHealth} />
        <CronStatusCard jobs={cronJobs} />
      </div>
      
      <div className="mt-6">
        <RevenueWidget data={revenue} />
      </div>
    </div>
  );
}
