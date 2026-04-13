import { useState } from "react";
import TemplateStatCards from "./components/TemplateStatCards";
import TemplateTabs from "./components/TemplateTabs";
import TemplateFilterBar from "./components/TemplateFilterBar";
import TemplatesTable from "./components/TemplatesTable";
import AddEditTemplateModal from "./components/AddEditTemplateModal";
import Pagination from "./components/Pagination";
import { useTemplates, useTemplateStats, useTemplateMutations } from "./hooks/useTemplates";
import type { TemplateFilters, TemplateTab, WhatsAppTemplate } from "./types/templates.types";
import { Button } from "@/components/ui/button";

const DEFAULT_FILTERS: TemplateFilters = {
  search: "", category: "ALL", language: "ALL", status: "ALL",
  tab: "all", page: 1, pageSize: 10,
};

const MOCK_STATS = { approved: 7, approvedWeekDelta: 2, pendingApproval: 1, rejected: 0, schoolsUsingWA: 41 };

const WhatsAppTemplatesPage = () => {
  const [filters, setFilters]         = useState<TemplateFilters>(DEFAULT_FILTERS);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTemplate, setEditTemplate] = useState<WhatsAppTemplate | null>(null);

  const { data, isLoading }   = useTemplates(filters);
  const { data: stats }       = useTemplateStats();
  const { submitToMeta }      = useTemplateMutations();

  const patchFilters = (patch: Partial<TemplateFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const handleTabChange = (tab: TemplateTab) => {
    const statusMap: Record<TemplateTab, TemplateFilters["status"]> = {
      all: "ALL", pending: "PENDING", rejected: "REJECTED", "by-school": "ALL",
    };
    patchFilters({ tab, status: statusMap[tab], page: 1 });
  };

  const handleEdit = (t: WhatsAppTemplate) => {
    setEditTemplate(t);
    setModalOpen(true);
  };

  const displayStats = stats ?? MOCK_STATS;

  return (
    <div className="flex flex-col gap-0 min-h-full -m-4 md:-m-6">

      

      {/* Page content */}
      <div className="flex flex-col gap-6 p-4 md:p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">WhatsApp Templates</h1>
            <p className="text-sm text-gray-500 mt-1">Manage Meta-approved templates across all schools</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              onClick={() => submitToMeta.mutate([])}
              disabled={submitToMeta.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Submit to Meta
            </Button>
            <Button
              onClick={() => { setEditTemplate(null); setModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Template
            </Button>
          </div>
        </div>

        {/* Stat cards */}
        <TemplateStatCards stats={displayStats} />

        {/* Tabs */}
        <TemplateTabs activeTab={filters.tab} onChange={handleTabChange} />

        {/* Filter bar */}
        <TemplateFilterBar filters={filters} onChange={patchFilters} />

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <TemplatesTable
            templates={data?.data ?? []}
            isLoading={isLoading}
            onEdit={handleEdit}
          />
          <Pagination
            page={filters.page}
            total={data?.total ?? 0}
            pageSize={filters.pageSize}
            onChange={(p) => patchFilters({ page: p })}
          />
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AddEditTemplateModal
        open={modalOpen}
        template={editTemplate}
        onClose={() => { setModalOpen(false); setEditTemplate(null); }}
      />
    </div>
  );
};

export default WhatsAppTemplatesPage;
