import React, { useMemo, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ChevronDown, Bell, Check, Download } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { billingApi } from '@/services/billing.api';
import { billingKeys, useAllSubscriptions, useSchoolSubscriptionDetail, useSubscriptionPaymentsBySchool, useBillingMutations } from '../hooks/useBilling';
import { RecordPaymentModal } from './RecordPaymentModal';
import type { SchoolSubscriptionStatus, SubscriptionStatusFilter, Subscription } from '../types/billing.types';

const STATUSES: SubscriptionStatusFilter[] = ["TRIAL", "PENDING", "PAID", "DUE", "OVERDUE", "SUSPENDED", "CANCELLED"];

const statusLabel = (s: SubscriptionStatusFilter) => s.charAt(0) + s.slice(1).toLowerCase();

const STATUS_BADGE: Record<SubscriptionStatusFilter, string> = {
  TRIAL: "bg-indigo-100 text-indigo-700",
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  DUE: "bg-yellow-100 text-yellow-700",
  OVERDUE: "bg-red-100 text-red-700",
  SUSPENDED: "bg-gray-200 text-gray-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const FEATURE_LABELS: Record<string, string> = {
  attendance: "Attendance",
  feeManagement: "Fee Management",
  reports: "Reports",
  broadcast: "Broadcast",
  admission: "Admission",
  parentApp: "Parent App",
  onlinePayment: "Online Payment",
};

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const daysUntil = (iso: string | null) => {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - new Date().setHours(0, 0, 0, 0)) / 86_400_000);
};

interface MergedRow extends SchoolSubscriptionStatus {
  amount: number | null;
}

export function SchoolDetailPanel({ schoolId }: { schoolId: string }) {
  const { data: detail, isLoading, isError } = useSchoolSubscriptionDetail(schoolId, true);
  const { data: payments, isLoading: paymentsLoading } = useSubscriptionPaymentsBySchool(schoolId);
  const { downloadPaymentReceipt } = useBillingMutations();

  if (isLoading) return <p className="text-sm text-gray-400 py-4">Loading subscription detail…</p>;
  if (isError || !detail) return <p className="text-sm text-red-500 py-4">Failed to load subscription detail.</p>;

  const activeFeatures = Object.entries(detail.subscription?.featureFlags ?? {}).filter(([, v]) => v);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-3">Contact & Billing</p>
        <div className="grid grid-cols-2 gap-y-2 text-xs">
          <p className="text-gray-400">Email</p><p className="text-gray-700 dark:text-gray-300">{detail.email}</p>
          <p className="text-gray-400">Phone</p><p className="text-gray-700 dark:text-gray-300">{detail.phone}</p>
          <p className="text-gray-400">Location</p><p className="text-gray-700 dark:text-gray-300">{[detail.city, detail.state].filter(Boolean).join(', ')}</p>
          <p className="text-gray-400">Grace Period</p><p className="text-gray-700 dark:text-gray-300">{detail.grace_period_days ? `${detail.grace_period_days} days` : '—'}</p>
          <p className="text-gray-400">Locked</p>
          <p className={detail.locked_at ? "text-red-500 font-medium" : "text-gray-700 dark:text-gray-300"}>
            {detail.locked_at ? (detail.locked_reason ?? "Yes") : "No"}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{detail.subscription?.name ?? "Plan"}</p>
          <p className="text-[#5b52f5] font-extrabold text-sm">
            ₹{detail.subscription?.annualPrice.toLocaleString()}
            <span className="text-[10px] font-normal text-gray-400">/yr</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-y-2 text-xs mb-3">
          <p className="text-gray-400">Monthly</p><p className="text-gray-700 dark:text-gray-300">₹{detail.subscription?.monthlyPrice.toLocaleString()}</p>
          <p className="text-gray-400">Student Limit</p><p className="text-gray-700 dark:text-gray-300">{detail.subscription?.studentLimit.toLocaleString()}</p>
          <p className="text-gray-400">Pilot Fee</p><p className="text-gray-700 dark:text-gray-300">₹{detail.subscription?.pilotFee.toLocaleString()}</p>
        </div>
        {activeFeatures.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-gray-200 dark:border-white/10 pt-2">
            {activeFeatures.map(([key]) => (
              <div key={key} className="flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-[10px] text-gray-500">{FEATURE_LABELS[key] ?? key}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 sm:col-span-2">
        <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-3">Payment History</p>
        {paymentsLoading ? (
          <p className="text-xs text-gray-400">Loading payments…</p>
        ) : !payments || payments.length === 0 ? (
          <p className="text-xs text-gray-400">No payments recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white dark:bg-white/5 rounded-lg px-3 py-2">
                <div className="flex items-center gap-4 text-xs">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">₹{p.amount.toLocaleString()}</span>
                  <span className="text-gray-500 dark:text-gray-400">{fmtDate(p.paymentDate)}</span>
                  <span className="text-gray-400">{p.paymentMode}</span>
                  {p.renewed && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Renewed</span>}
                </div>
                <button
                  onClick={() => downloadPaymentReceipt.mutate(p.id)}
                  disabled={downloadPaymentReceipt.isPending}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-50"
                  aria-label="Download receipt"
                  title="Download receipt"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const SchoolsByStatusTable: React.FC = () => {
  const [filter, setFilter] = useState<SubscriptionStatusFilter | "ALL">("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAllRenewals, setShowAllRenewals] = useState(false);
  const [collectSchoolId, setCollectSchoolId] = useState<string | null>(null);

  const statusQueries = useQueries({
    queries: STATUSES.map((status) => ({
      queryKey: billingKeys.schoolsByStatus(status),
      queryFn: () => billingApi.getSchoolsBySubscriptionStatus(status),
      staleTime: 30_000,
    })),
  });

  const { data: subsData } = useAllSubscriptions();
  const subscriptions: Subscription[] = Array.isArray(subsData?.data)
    ? subsData.data
    : subsData?.data ? [subsData.data] : [];
  const planMap = useMemo(() => new Map(subscriptions.map((s) => [s.name, s])), [subscriptions]);

  const isLoading = statusQueries.some((q) => q.isLoading);
  const isError = statusQueries.some((q) => q.isError);

  const allRows: MergedRow[] = useMemo(() => {
    const merged = statusQueries.flatMap((q) => q.data ?? []);
    return merged.map((s) => {
      const plan = planMap.get(s.planName);
      const amount = plan ? (s.billingCycle === 'MONTHLY' ? plan.monthlyPrice : plan.annualPrice) : null;
      return { ...s, amount };
    });
  }, [statusQueries, planMap]);

  const rows = filter === "ALL" ? allRows : allRows.filter((r) => r.subscriptionStatus === filter);

  const renewals = useMemo(() => {
    return allRows
      .map((r) => ({ row: r, days: daysUntil(r.nextDueDate) }))
      .filter((r) => r.row.isActive && r.days !== null && r.days >= 0)
      .sort((a, b) => (a.days ?? 0) - (b.days ?? 0));
  }, [allRows]);

  const toggleExpanded = (schoolId: string) => setExpandedId((prev) => (prev === schoolId ? null : schoolId));

  const handleAction = (row: MergedRow) => {
    if (row.subscriptionStatus === "OVERDUE" || row.subscriptionStatus === "DUE" || row.subscriptionStatus === "SUSPENDED") {
      setCollectSchoolId(row.schoolId);
    } else {
      toast.info(`Reminder queued for ${row.schoolName}`);
    }
  };

  const actionLabel = (status: SubscriptionStatusFilter) => {
    if (status === "TRIAL" || status === "PENDING") return "Convert";
    if (status === "DUE") return "Follow Up";
    if (status === "OVERDUE" || status === "SUSPENDED") return "Collect";
    return null;
  };
  const actionStyle = (status: SubscriptionStatusFilter) => {
    if (status === "TRIAL" || status === "PENDING") return "bg-indigo-600 text-white hover:bg-indigo-700";
    if (status === "DUE") return "bg-amber-500 text-white hover:bg-amber-600";
    return "bg-red-600 text-white hover:bg-red-700";
  };

  const visibleRenewals = showAllRenewals ? renewals : renewals.slice(0, 3);

  return (
    <div className="space-y-5">
      {/* Active Subscriptions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Subscriptions</h3>
          <div className="w-40">
            <Select
              value={filter}
              onChange={(e) => { setFilter(e.target.value as SubscriptionStatusFilter | "ALL"); setExpandedId(null); }}
              options={[{ label: "All Statuses", value: "ALL" }, ...STATUSES.map((s) => ({ label: statusLabel(s), value: s }))]}
              className="h-9 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                {['School', 'Plan', 'Billing Cycle', 'Amount', 'Status', 'Period End', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="py-3.5 px-4">
                        <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-white/10" style={{ width: `${40 + (j * 17) % 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-red-500">Failed to load subscriptions.</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-gray-400">No schools found.</td></tr>
              ) : (
                rows.map((row) => {
                  const isExpanded = expandedId === row.schoolId;
                  const label = actionLabel(row.subscriptionStatus);
                  return (
                    <React.Fragment key={row.schoolId}>
                      <tr
                        onClick={() => toggleExpanded(row.schoolId)}
                        className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3.5">
                          <p className="text-[13px] font-medium text-gray-900 dark:text-white">{row.schoolName}</p>
                          <p className="text-[11px] text-gray-400">{row.city.trim()}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-violet-100 text-violet-700">
                            {row.planName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-500 dark:text-gray-400">
                          {row.billingCycle === 'MONTHLY' ? 'Monthly' : 'Annual'}
                        </td>
                        <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 dark:text-white">
                          {row.amount != null ? `₹${row.amount.toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${STATUS_BADGE[row.subscriptionStatus]}`}>
                            {statusLabel(row.subscriptionStatus)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-gray-500 dark:text-gray-400">{fmtDate(row.nextDueDate)}</td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2 justify-end">
                            {label && (
                              <button
                                onClick={() => handleAction(row)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${actionStyle(row.subscriptionStatus)}`}
                              >
                                {label}
                              </button>
                            )}
                            <button onClick={() => toggleExpanded(row.schoolId)} className="p-1">
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-4 border-t border-gray-100 dark:border-white/10 bg-gray-50/40 dark:bg-white/[0.02]">
                            <SchoolDetailPanel schoolId={row.schoolId} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewing soon */}
      {renewals.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 dark:bg-amber-900/10 dark:border-amber-900/30">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
              {renewals.length} School{renewals.length > 1 ? 's' : ''} Renewing Soon
            </p>
          </div>
          <div className="space-y-2">
            {visibleRenewals.map(({ row, days }) => (
              <div key={row.schoolId} className="flex items-center justify-between bg-white dark:bg-white/5 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{row.schoolName}</p>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                    {days} DAY{days === 1 ? '' : 'S'}
                  </span>
                </div>
                <button
                  onClick={() => toast.info(`Reminder sent to ${row.schoolName}`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-amber-300 text-amber-700 bg-white hover:bg-amber-50 transition-colors"
                >
                  Send Reminder
                </button>
              </div>
            ))}
          </div>
          {renewals.length > 3 && (
            <button
              onClick={() => setShowAllRenewals((p) => !p)}
              className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-800"
            >
              {showAllRenewals ? 'Show less' : `View All ${renewals.length} →`}
            </button>
          )}
        </div>
      )}

      <RecordPaymentModal
        open={!!collectSchoolId}
        onClose={() => setCollectSchoolId(null)}
        preselectedSchoolId={collectSchoolId ?? undefined}
      />
    </div>
  );
};
