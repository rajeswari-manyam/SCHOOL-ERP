import { Suspense, lazy } from "react";
import { format } from "date-fns";

import PlatformStatCards from "./components/PlatformStatCards";
import PlatformHealthCard from "./components/PlatformHealthCard";
import RecentSchoolsCard from "./components/RecentSchoolsCard";
import { useDashboard } from "./hooks/useDashboard";

// Lazy load only heavy sections
const SchoolActivityTable = lazy(() => import("./components/SchoolActivityTable"));
const RevenueChart = lazy(() => import("./components/RevenueChart"));
const CriticalTicketsTable = lazy(() => import("./components/CriticalTicketsTable"));

// Skeletons
const SectionSkeleton = () => (
  <div className="rounded-2xl border bg-white p-5 space-y-3">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="h-10 rounded bg-slate-100 animate-pulse"
      />
    ))}
  </div>
);

const ChartSkeleton = () => (
  <div className="rounded-2xl border bg-white p-5">
    <div className="h-72 rounded bg-slate-100 animate-pulse" />
  </div>
);

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
          <Suspense fallback={<SectionSkeleton />}>
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
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart
            data={revenueHistory}
            currentMrr={stats.monthlyRevenue}
          />
        </Suspense>

        <RecentSchoolsCard
          schools={recentSchools}
          isLoading={isLoading}
        />
      </div>

      {/* Critical Tickets */}
      <Suspense fallback={<SectionSkeleton />}>
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