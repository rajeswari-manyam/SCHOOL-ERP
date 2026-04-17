import { useState } from "react";
import { Upload, UserPlus, MessageSquare } from "lucide-react";
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
              <Upload size={14} />
              Export Report
            </Button>
            <Button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <UserPlus size={14} />
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

        {activeTab === "attendance" && <AttendanceTab />}

        {activeTab === "targets" && (
          <TargetsTab reps={data?.data ?? []} stats={displayStats} />
        )}

        {activeTab === "payouts" && <PayoutsTab reps={data?.data ?? []} />}
      </div>

      {/* Quick Message FAB */}
      <button className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg hover:bg-emerald-600 transition-colors">
        <MessageSquare size={16} />
        Quick Message
      </button>

      <AddRepModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default MarketingTeamPage;
