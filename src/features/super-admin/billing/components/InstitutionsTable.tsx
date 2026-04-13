import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { PlanBadge, StatusBadge } from './BillingBadges';
import { BillingFilterBar } from './BillingFilterBar';
import { InstitutionActionsMenu } from './InstitutionActionsMenu';
import { Pagination } from './Pagination';
import { useInstitutions, useBillingMutations } from '../hooks/useBilling';
import type { InstitutionFilters, Institution } from '../types/billing.types';

const COLS = ['', 'Institution', 'City', 'Plan', 'MRR', 'Status', 'Renewal', 'Outstanding', ''];

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 9 }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-white/10" style={{ width: `${40 + (i * 17) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

interface InstitutionsTableProps {
  onViewInstitution?: (inst: Institution) => void;
  onEditInstitution?: (inst: Institution) => void;
}

export const InstitutionsTable: React.FC<InstitutionsTableProps> = ({
  onViewInstitution,
  onEditInstitution,
}) => {
  const [filters, setFilters] = useState<InstitutionFilters>({
    page: 1,
    pageSize: 10,
    sortBy: 'mrr',
    sortOrder: 'desc',
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, isFetching } = useInstitutions(filters);
  const { exportCsv, recordPayment } = useBillingMutations();

  const rows = data?.data ?? [];
  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected((s) => { const n = new Set(s); rows.forEach((r) => n.delete(r.id)); return n; });
    } else {
      setSelected((s) => { const n = new Set(s); rows.forEach((r) => n.add(r.id)); return n; });
    }
  };

  const toggleOne = (id: string) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleExport = () => exportCsv.mutate(filters);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const renewalColor = (iso: string) => {
    const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
    if (days < 0) return 'text-red-500 dark:text-red-400';
    if (days <= 14) return 'text-orange-500 dark:text-orange-400';
    if (days <= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BillingFilterBar filters={filters} onChange={setFilters} />
        <button
          onClick={handleExport}
          disabled={exportCsv.isPending}
          className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-2.5 dark:bg-indigo-900/20">
          <span className="text-[13px] font-medium text-indigo-700 dark:text-indigo-300">
            {selected.size} selected
          </span>
          <button className="rounded-lg bg-red-100 px-3 py-1 text-[12px] font-semibold text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
            Delete selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className={`overflow-hidden rounded-2xl border border-gray-100 bg-white transition-opacity dark:border-white/10 dark:bg-white/5 ${isFetching && !isLoading ? 'opacity-70' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/10 dark:bg-white/5">
                <th className="w-10 py-3 pl-4 pr-2">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 rounded border-gray-300 accent-indigo-600"
                  />
                </th>
                {COLS.slice(1).map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : rows.map((inst) => (
                    <tr
                      key={inst.id}
                      className={`group transition-colors hover:bg-gray-50/80 dark:hover:bg-white/5 ${selected.has(inst.id) ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                    >
                      <td className="py-3.5 pl-4 pr-2">
                        <input
                          type="checkbox"
                          checked={selected.has(inst.id)}
                          onChange={() => toggleOne(inst.id)}
                          className="h-3.5 w-3.5 rounded border-gray-300 accent-indigo-600"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-[11px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            {inst.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900 dark:text-white">
                              {inst.name}
                            </p>
                            <p className="text-[11px] text-gray-400">{inst.adminEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[13px] text-gray-500 dark:text-gray-400">
                        {inst.city}
                      </td>
                      <td className="px-4 py-3.5">
                        <PlanBadge plan={inst.plan} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 dark:text-white">
                        ₹{inst.mrr.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={inst.status} />
                      </td>
                      <td className={`px-4 py-3.5 text-[12px] font-medium ${renewalColor(inst.subscriptionEnd)}`}>
                        {fmtDate(inst.subscriptionEnd)}
                      </td>
                      <td className="px-4 py-3.5 text-[13px]">
                        {inst.outstandingAmount > 0 ? (
                          <span className="font-semibold text-red-500">
                            ₹{inst.outstandingAmount.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 pr-4">
                        <InstitutionActionsMenu
                          institution={inst}
                          onView={onViewInstitution ?? (() => {})}
                          onEdit={onEditInstitution ?? (() => {})}
                          onSuspend={() => {}}
                          onDelete={() => {}}
                          onRecordPayment={(i) =>
                            recordPayment.mutate({
                              institutionId: i.id,
                              amount: i.outstandingAmount,
                              paymentDate: new Date().toISOString(),
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
          />
        )}
      </div>
    </div>
  );
};
