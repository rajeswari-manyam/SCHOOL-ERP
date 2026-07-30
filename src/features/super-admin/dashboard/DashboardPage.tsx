import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PlatformStatCards from "./components/PlatformStatCards";
import SchoolActivityTable from "./components/SchoolActivityTable";
import PlatformHealthCard from "./components/PlatformHealthCard";
import RevenueChart from "./components/RevenueChart";
import RecentSchoolsCard from "./components/RecentSchoolsCard";
import CriticalTicketsTable from "./components/CriticalTicketsTable";
import { useDashboard } from "./hooks/useDashboard";
// ── Mock data for skeleton fallback ─────────────────────────
const MOCK_STATS = {
  totalSchools: 0,
  activeSchools: 0,
  monthlyRevenue: 0,
  usageToday: "0%",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboard();

  const stats          = data?.stats ?? MOCK_STATS;
  const schoolActivity = data?.schoolActivity ?? [];
  const healthItems    = data?.healthItems ?? [];
  const cronJobs       = data?.cronJobs ?? [];
  const recentSchools  = data?.recentSchools ?? [];
  const revenueHistory = data?.revenueHistory ?? [];
  const criticalTickets = data?.criticalTickets ?? [];
  const requiresAction  = data?.requiresAction ?? 0;

  return (
    <div className="flex flex-col gap-6 min-h-full">

      

      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Platform Overview</h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
      </div>

      {/* Stat cards */}
      <PlatformStatCards stats={stats} />

      {/* Activity + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SchoolActivityTable
            rows={schoolActivity}
            isLoading={isLoading}
            onViewAll={() => navigate("/super-admin/schools")}
          />
        </div>
        <PlatformHealthCard healthItems={healthItems} cronJobs={cronJobs} />
      </div>

      {/* Revenue + Recent Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RevenueChart data={revenueHistory} currentMrr={stats.monthlyRevenue} />
        <RecentSchoolsCard schools={recentSchools} />
      </div>

      {/* Critical Tickets */}
      <CriticalTicketsTable
        tickets={criticalTickets}
        requiresAction={requiresAction}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPage;
