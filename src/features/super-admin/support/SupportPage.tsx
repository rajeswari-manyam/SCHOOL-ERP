import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketFilterBar from "./components/TicketFilterBar";
import TicketsTable from "./components/TicketsTable";
import TicketDetailDrawer from "./components/TicketDetailDrawer";
import Pagination from "./components/Pagination";
import { StatPill } from "./components/TicketBadges";
import { useTickets, useTicketStats } from "./hooks/useSupport";
import type { TicketFilters, SupportTicket } from "./types/support.types";

const DEFAULT_FILTERS: TicketFilters = {
  search: "", priority: "ALL", status: "ALL", school: "", page: 1, pageSize: 8,
};

const SCHOOLS = [
  "Hanamkonda Public","St. Mary's CBSE","Kazipet English",
  "Sri Vidya Mandir","Little Stars School","Global Kids School",
  "Kendriya Modern","Sunrise Academy",
];

const MOCK_STATS = { open: 12, inProgress: 4, resolvedToday: 7 };

const SupportPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters]         = useState<TicketFilters>(DEFAULT_FILTERS);
  const [pendingFilters, setPending]  = useState<TicketFilters>(DEFAULT_FILTERS);
  const [selectedTicket, setSelected] = useState<SupportTicket | null>(null);

  const { data, isLoading } = useTickets(filters);
  const { data: stats }     = useTicketStats();

  const displayStats = stats ?? MOCK_STATS;

  const handleApply = () => setFilters({ ...pendingFilters, page: 1 });

  return (
    <div className="flex flex-col gap-0 min-h-full -m-4 md:-m-6">

      

      {/* Page content */}
      <div className="flex flex-col gap-6 p-4 md:p-6">

       

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support Tickets</h1>
            <p className="text-sm text-gray-500 mt-1">
              {displayStats.open} open tickets requiring administrative attention
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <StatPill variant="open"       label="Open"           count={displayStats.open} />
            <StatPill variant="inProgress" label="In Progress"    count={displayStats.inProgress} />
            <StatPill variant="resolved"   label="Resolved today" count={displayStats.resolvedToday} />
          </div>
        </div>

        {/* Filter bar */}
        <TicketFilterBar
          filters={pendingFilters}
          schools={SCHOOLS}
          onChange={(patch) => setPending((p) => ({ ...p, ...patch }))}
          onApply={handleApply}
        />

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <TicketsTable
            tickets={data?.data ?? []}
            isLoading={isLoading}
            onView={setSelected}
          />
          <Pagination
            page={filters.page}
            total={data?.total ?? 0}
            pageSize={filters.pageSize}
            onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        </div>
      </div>

      {/* Detail drawer */}
      <TicketDetailDrawer
        ticket={selectedTicket}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};

export default SupportPage;
