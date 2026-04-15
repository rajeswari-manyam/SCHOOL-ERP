import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PlatformStatCards from "./components/PlatformStatCards";
import SchoolActivityTable from "./components/SchoolActivityTable";
import PlatformHealthCard from "./components/PlatformHealthCard";
import RevenueChart from "./components/RevenueChart";
import RecentSchoolsCard from "./components/RecentSchoolsCard";
import CriticalTicketsTable from "./components/CriticalTicketsTable";
import { useDashboard, useExportDashboard } from "./hooks/useDashboard";
import AddNewSchoolModal from "../schools/components/SchoolModal";
import { Button } from "@/components/ui/button";
// ── Mock data for skeleton fallback ─────────────────────────
const MOCK_STATS = {
  totalSchools: 47, totalSchoolsDelta: 3,
  activeSchools: 41, onTrial: 6,
  mrr: 384000, mrrVsLastMonthPct: 12,
  usageTodayPct: 87, usageTodayCount: 40, usageTodayTotal: 47,
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const { data, isLoading } = useDashboard();
  const { handleExport } = useExportDashboard();

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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm text-gray-400 mt-1">{format(new Date(), "EEEE, d MMMM yyyy")}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
             onClick={handleExport}
           
             className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          
          >
            Export Report
          </Button>
          <Button
            onClick={() => setIsSchoolModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Add School
          </Button>
      
        </div>
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
        <RevenueChart data={revenueHistory} currentMrr={stats.mrr} />
        <RecentSchoolsCard schools={recentSchools} />
      </div>

      {/* Critical Tickets */}
      <CriticalTicketsTable
        tickets={criticalTickets}
        requiresAction={requiresAction}
        isLoading={isLoading}
      />

      {/* FABs */}
      <AddNewSchoolModal
        open={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        onSuccess={() => setIsSchoolModalOpen(false)}
      />
      <Button className="fixed bottom-16 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-indigo-600 text-white text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Quick Support
      </Button>
      <Button className="fixed bottom-4 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg hover:bg-emerald-600 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Helpdesk WhatsApp
      </Button>
    </div>
  );
};

export default DashboardPage;
