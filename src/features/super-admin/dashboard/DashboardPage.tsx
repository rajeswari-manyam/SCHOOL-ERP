import { Suspense, lazy } from "react";
import { format } from "date-fns";

import PlatformStatCards from "./components/PlatformStatCards";
import PlatformHealthCard from "./components/PlatformHealthCard";
import RecentSchoolsCard from "./components/RecentSchoolsCard";
import { useDashboard } from "./hooks/useDashboard";
import {
  SkeletonChartCard,
  SkeletonTableCard,
} from "@/components/common/skeletons";

// Lazy load only heavy sections
const SchoolActivityTable = lazy(() => import("./components/SchoolActivityTable"));
const RevenueChart = lazy(() => import("./components/RevenueChart"));
const CriticalTicketsTable = lazy(() => import("./components/CriticalTicketsTable"));

// Mock data for initial render
const MOCK_STATS = {
  totalSchools: 0,
  activeSchools: 0,
  monthlyRevenue: 0,
  usageToday: "0%",
};

const DashboardPage = () => {
  const { data, isLoading } = useDashboard();

  const stats = data?.stats ?? MOCK_STATS;
  const schoolActivity = data?.schoolActivity ?? [];
  const healthItems = data?.healthItems ?? [];
  const cronJobs = data?.cronJobs ?? [];
  const recentSchools = data?.recentSchools ?? [];
  const revenueHistory = data?.revenueHistory ?? [];
  const criticalTickets = data?.criticalTickets ?? [];
  const requiresAction = data?.requiresAction ?? 0;

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Page header */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">
          Platform Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
      </div>

      {/* Stat cards */}
      <PlatformStatCards stats={stats} isLoading={isLoading} />

      {/* Activity + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Suspense fallback={<SkeletonTableCard rows={4} />}>
            <SchoolActivityTable
              rows={schoolActivity}
              isLoading={isLoading}
            />
          </Suspense>
        </div>

        <PlatformHealthCard
          healthItems={healthItems}
          cronJobs={cronJobs}
          isLoading={isLoading}
        />
      </div>

      {/* Revenue + Recent Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Suspense fallback={<SkeletonChartCard height="h-72" />}>
          <RevenueChart
            data={revenueHistory}
            currentMrr={stats.monthlyRevenue}
            isLoading={isLoading}
          />
        </Suspense>

        <RecentSchoolsCard
          schools={recentSchools}
          isLoading={isLoading}
        />
      </div>

      {/* Critical Tickets */}
      <Suspense fallback={<SkeletonTableCard rows={4} />}>
        <CriticalTicketsTable
          tickets={criticalTickets}
          requiresAction={requiresAction}
          isLoading={isLoading}
        />
      </Suspense>
    </div>
  );
};

export default DashboardPage;