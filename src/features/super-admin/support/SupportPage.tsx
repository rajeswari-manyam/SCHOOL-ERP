import { useState, useMemo } from "react";

import TicketFilterBar from "./components/TicketFilterBar";
import TicketsTable from "./components/TicketsTable";
import TicketDetailDrawer from "./components/TicketDetailDrawer";
import Pagination from "../components/Pagination";
import { StatPill } from "./components/TicketBadges";
import { useAllTicketsQuery, useTicketStats, useTicketFiltering } from "./hooks/useSupport";
import type { TicketFilters } from "./types/support.types";
import type { SupportTicketRecord } from "@/services/support-ticket.api";

const DEFAULT_FILTERS: TicketFilters = {
  search: "", priority: "ALL", status: "ALL", school: "", page: 1, pageSize: 8,
};

const SupportPage = () => {
  const [filters, setFilters]         = useState<TicketFilters>(DEFAULT_FILTERS);
  const [pendingFilters, setPending]  = useState<TicketFilters>(DEFAULT_FILTERS);
  const [selectedTicket, setSelected] = useState<SupportTicketRecord | null>(null);

  const { data: tickets, isLoading, isError } = useAllTicketsQuery();
  const stats = useTicketStats(tickets);
  const { page: pagedTickets, total } = useTicketFiltering(tickets, filters);

  const schoolNames = useMemo(() => {
    const names = new Set<string>();
    (tickets ?? []).forEach((t) => { if (t.school?.school_name) names.add(t.school.school_name); });
    return Array.from(names);
  }, [tickets]);

  const handleApply = () => setFilters({ ...pendingFilters, page: 1 });

  return (
    <div className="flex flex-col gap-0 min-h-full -m-4 md:-m-6">

      {/* Page content */}
      <div className="flex flex-col gap-6 p-4 md:p-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Support Tickets</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {stats.open} open ticket{stats.open === 1 ? "" : "s"} requiring administrative attention
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <StatPill variant="open"       label="Open"           count={stats.open} />
            <StatPill variant="inProgress" label="In Progress"    count={stats.inProgress} />
            <StatPill variant="resolved"   label="Resolved today" count={stats.resolvedToday} />
          </div>
        </div>

        {/* Filter bar */}
        <TicketFilterBar
          filters={pendingFilters}
          schools={schoolNames}
          onChange={(patch) => setPending((p) => ({ ...p, ...patch }))}
          onApply={handleApply}
        />

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {isError ? (
            <div className="py-16 text-center text-sm text-red-500">
              Failed to load support tickets.
            </div>
          ) : (
            <>
              <TicketsTable
                tickets={pagedTickets}
                isLoading={isLoading}
                onView={setSelected}
              />
              <Pagination
                page={filters.page}
                total={total}
                pageSize={filters.pageSize}
                onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                itemLabel="tickets"
              />
            </>
          )}
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
