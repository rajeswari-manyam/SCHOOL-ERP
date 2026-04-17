


import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, RefreshCcw, Search } from "lucide-react";
import AddNewTemplateModal from "./AddNewTemplateModal";
import AssignModal from "./AssignModal";
import { useConfigTemplates, useConfigMutations } from "../hooks/useConfig";
import type { ConfigTemplate } from "../types/config.types";

const CategoryBadge = ({ cat }: { cat: ConfigTemplate["category"] }) => {
  const s =
    cat === "Marketing"
      ? "bg-orange-100 text-orange-600"
      : "bg-indigo-50 text-indigo-600";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s}`}>
      {cat}
    </span>
  );
};

const MetaBadge = ({ status }: { status: ConfigTemplate["metaStatus"] }) => {
  const colorMap: Record<ConfigTemplate["metaStatus"], string> = {
    Approved: "text-emerald-600",
    Pending: "text-amber-500",
    Rejected: "text-red-500",
  };
  const dotMap: Record<ConfigTemplate["metaStatus"], string> = {
    Approved: "bg-emerald-500",
    Pending: "bg-amber-400",
    Rejected: "bg-red-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${colorMap[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotMap[status]}`} />
      {status}
    </span>
  );
};

const COL =
  "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left";

const WATemplatesTab = () => {
  const [search, setSearch] = useState("");
  const [showAddTemplate, setShowAddTemplate] = useState(false);
  const [assignTemplate, setAssignTemplate] = useState<ConfigTemplate | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const query = useConfigTemplates();
  const { isLoading } = query;
  const { syncTemplates } = useConfigMutations();

  const templatesData = query.data as
    | ConfigTemplate[]
    | { data: ConfigTemplate[] }
    | undefined;

  const templates = Array.isArray(templatesData)
    ? templatesData
    : templatesData?.data ?? [];

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Actions bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          onClick={() => syncTemplates.mutate()}
          disabled={syncTemplates.isPending}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-60"
        >
          <RefreshCcw className="w-4 h-4" />
          {syncTemplates.isPending ? "Syncing…" : "Sync from Meta"}
        </button>
        <button
          onClick={() => setShowAddTemplate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Template
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 px-5 py-4 border-b border-gray-50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <h3 className="font-extrabold text-gray-900">
              WhatsApp Template Manager
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
              {filtered.length} TEMPLATES
            </span>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 px-9 pr-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-400 animate-pulse">
            Loading templates…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            No templates found{search ? ` for "${search}"` : ""}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50">
                  <th className={COL}>Template Name</th>
                  <th className={COL}>Category</th>
                  <th className={COL}>Language</th>
                  <th className={COL}>Meta Status</th>
                  <th className={COL}>Used By</th>
                  <th className={COL}>Last Submitted</th>
                  <th className={COL}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm font-bold text-gray-900 font-mono">
                      {t.name}
                    </td>
                    <td className="px-4 py-4">
                      <CategoryBadge cat={t.category} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {t.language}
                    </td>
                    <td className="px-4 py-4">
                      <MetaBadge status={t.metaStatus} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {t.usedBy} schools
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {t.lastSubmitted}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                          Edit
                        </button>
                        {t.metaStatus === "Pending" && (
                          <>
                            <span className="text-gray-200">|</span>
                            <button className="text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors">
                              Resubmit
                            </button>
                          </>
                        )}
                        {t.metaStatus === "Approved" && (
                          <>
                            <span className="text-gray-200">|</span>
                            <button
                              className="text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                              onClick={() => {
                                setAssignTemplate(t);
                                setShowAssignModal(true);
                              }}
                            >
                              Assign
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Showing {filtered.length} of {templates.length} total templates
                synced with WhatsApp Cloud API
              </p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AddNewTemplateModal open={showAddTemplate} onClose={() => setShowAddTemplate(false)} />
      <AssignModal
        open={showAssignModal}
        template={assignTemplate}
        onClose={() => {
          setShowAssignModal(false);
          setAssignTemplate(null);
        }}
      />

      {/* Meta Approval Guidelines */}
      <div className="bg-amber-50 rounded-2xl border border-amber-100 px-5 py-4">
        <div className="flex items-start gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeLinecap="round"
            className="flex-shrink-0 mt-0.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-sm font-bold text-amber-700 mb-1">
              Meta Approval Guidelines
            </p>
            <p className="text-sm text-amber-600 leading-relaxed">
              Meta approval takes 24–72 hours. Templates must be utility or
              marketing category. Avoid promotional language in utility templates
              to prevent rejection. Ensure placeholders (e.g.,{" "}
              <code className="text-xs bg-amber-100 px-1 rounded">{"{{1}}"}</code>
              ) are correctly mapped.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WATemplatesTab;