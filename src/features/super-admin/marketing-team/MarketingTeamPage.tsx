import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MarketingStatCards from "./components/MarketingStatCards";
import MarketingTabs from "./components/MarketingTabs";
import TeamOverviewTab from "./components/TeamOverviewTab";
import AttendanceTab from "./components/AttendanceTab";
import TargetsTab from "./components/TargetsTab";
import PayoutsTab from "./components/PayoutsTab";
import AddRepModal from "./components/AddRepModal";
import { useReps, useMarketingStats, useMarketingMutations } from "./hooks/useMarketing";
import type { MarketingTab, RepFilters } from "./types/marketing.types";
import { Button } from "@/components/ui/button";
const MOCK_STATS = { totalReps: 8, presentToday: 6, presentPct: 75, demosThisMonth: 34, demosTarget: 48, schoolsClosed: 12, schoolsClosedDelta: 2 };

const DEFAULT_FILTERS: RepFilters = { search: "", territory: "", status: "ALL", page: 1, pageSize: 6 };

const MarketingTeamPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MarketingTab>("team-overview");
  const [filters, setFilters]     = useState<RepFilters>(DEFAULT_FILTERS);
  const [addOpen, setAddOpen]     = useState(false);

  const { data, isLoading }   = useReps(filters);
  const { data: stats }       = useMarketingStats();
  const { exportReport }      = useMarketingMutations();

  const displayStats = stats ?? MOCK_STATS;

  return (
    <div className="flex flex-col gap-0 min-h-full -m-4 md:-m-6">

     

      {/* Page content */}
      <div className="flex flex-col gap-6 p-4 md:p-6">
       

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Marketing Team</h1>
            <p className="text-sm text-gray-500 mt-1">{displayStats.totalReps} field representatives across 4 districts</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={() => exportReport.mutate()}
              disabled={exportReport.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </Button>
            <Button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Rep
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <MarketingStatCards stats={displayStats} />

        {/* Tabs */}
        <MarketingTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        {activeTab === "team-overview" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <TeamOverviewTab
              reps={data?.data ?? []}
              isLoading={isLoading}
              total={data?.total ?? 0}
              page={filters.page}
              pageSize={filters.pageSize}
              onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
              onView={() => {}}
            />
          </div>
        )}

        {activeTab === "attendance" && <AttendanceTab reps={data?.data ?? []} />}

        {activeTab === "targets" && (
          <TargetsTab reps={data?.data ?? []} stats={displayStats} />
        )}

        {activeTab === "payouts" && <PayoutsTab reps={data?.data ?? []} />}
      </div>

      {/* Quick Message FAB */}
      <button className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg hover:bg-emerald-600 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Quick Message
      </button>

      <AddRepModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default MarketingTeamPage;
