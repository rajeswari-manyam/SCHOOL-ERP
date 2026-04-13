import { useState } from "react";
import type { WhatsAppTemplate } from "../types/templates.types";
import { CategoryBadge, MetaStatusBadge } from "./TemplateBadges";
import { useTemplateMutations } from "../hooks/useTemplates";

interface TemplatesTableProps {
  templates: WhatsAppTemplate[];
  isLoading: boolean;
  onEdit: (t: WhatsAppTemplate) => void;
}

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-3 text-left";

const TemplatesTable = ({ templates, isLoading, onEdit }: TemplatesTableProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { deleteTemplate } = useTemplateMutations();

  const toggleAll = () =>
    setSelectedIds(selectedIds.size === templates.length ? new Set() : new Set(templates.map((t) => t.id)));
  const toggleOne = (id: string) =>
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (isLoading) {
    return (
      <div className="divide-y divide-gray-50">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 animate-pulse">
            <div className="w-4 h-4 rounded bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-36 rounded bg-gray-100" />
            </div>
            <div className="h-3 w-40 rounded bg-gray-100" />
            <div className="h-5 w-20 rounded bg-gray-100" />
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="h-4 w-20 rounded bg-gray-100" />
            <div className="h-3 w-16 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm font-semibold text-gray-400">No templates found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={selectedIds.size === templates.length && templates.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
              />
            </th>
            <th className={COL}>Template Name</th>
            <th className={COL}>Preview</th>
            <th className={COL}>Category</th>
            <th className={COL}>Language</th>
            <th className={COL}>Meta Status</th>
            <th className={COL}>Schools</th>
            <th className={COL}></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {templates.map((t) => (
            <tr
              key={t.id}
              className={`hover:bg-gray-50/60 transition-colors ${selectedIds.has(t.id) ? "bg-indigo-50/30" : ""}`}
            >
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(t.id)}
                  onChange={() => toggleOne(t.id)}
                  className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
                />
              </td>

              {/* Name */}
              <td className="px-4 py-4">
                <span className="text-sm font-bold text-gray-900 font-mono">{t.name}</span>
              </td>

              {/* Preview */}
              <td className="px-4 py-4 max-w-[180px]">
                <span className="text-sm text-gray-400 italic truncate block">{t.preview}</span>
              </td>

              {/* Category */}
              <td className="px-4 py-4">
                <CategoryBadge category={t.category} />
              </td>

              {/* Language */}
              <td className="px-4 py-4 text-sm text-gray-600">{t.language}</td>

              {/* Meta Status */}
              <td className="px-4 py-4">
                <MetaStatusBadge status={t.metaStatus} />
              </td>

              {/* Schools */}
              <td className="px-4 py-4">
                <span className={`text-sm font-semibold ${t.schools === 0 ? "text-gray-300" : "text-gray-700"}`}>
                  {t.schools === 0 ? "0" : t.schools}{" "}
                  <span className={`font-normal ${t.schools === 0 ? "text-gray-300" : "text-gray-400"}`}>
                    schools
                  </span>
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(t)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Edit
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={() => confirm(`Delete "${t.name}"?`) && deleteTemplate.mutate(t.id)}
                    className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplatesTable;
