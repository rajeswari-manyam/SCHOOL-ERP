import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search, Trash2 } from 'lucide-react';
import { useSubscriptionPayments, useBillingMutations } from '../hooks/useBilling';
import { useAllSchools } from '@/features/super-admin/schools/hooks/useSchools';
import type { SubscriptionPaymentMode } from '../types/billing.types';

const MODE_LABELS: Record<SubscriptionPaymentMode, string> = {
  RAZORPAY: 'Razorpay',
  BANK_TRANSFER: 'Bank Transfer',
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  UPI: 'UPI',
};

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="py-3.5 px-4">
          <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-white/10" style={{ width: `${40 + (i * 17) % 40}%` }} />
        </td>
      ))}
    </tr>
  );
}

export const SubscriptionPaymentsTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: payments, isLoading } = useSubscriptionPayments();
  const { data: schools } = useAllSchools();
  const { deleteSubscriptionPayment } = useBillingMutations();

  const schoolMap = useMemo(
    () => new Map((schools ?? []).map((s) => [s.id, s])),
    [schools]
  );

  const rows = useMemo(() => {
    const all = (payments ?? []).map((p) => ({
      ...p,
      schoolName: schoolMap.get(p.schoolId)?.name ?? 'Unknown School',
      city: schoolMap.get(p.schoolId)?.city ?? '',
    }));
    const sorted = [...all].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((r) => r.schoolName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q));
  }, [payments, schoolMap, search]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleDelete = (id: string, schoolName: string) => {
    if (!confirm(`Delete this payment record for ${schoolName}? This cannot be undone.`)) return;
    deleteSubscriptionPayment.mutate(id, {
      onSuccess: () => toast.success('Payment record deleted'),
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Failed to delete payment'),
    });
  };

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search school or city..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/10 dark:bg-white/5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-white/10 dark:bg-white/5">
                {['School', 'Amount', 'Payment Date', 'Mode', 'Renewed', 'Description', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                rows.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 dark:hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] font-medium text-gray-900 dark:text-white">{p.schoolName}</p>
                      {p.city && <p className="text-[11px] text-gray-400">{p.city}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] font-semibold text-gray-900 dark:text-white">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500 dark:text-gray-400">
                      {fmtDate(p.paymentDate)}
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-700 dark:text-gray-300">
                      {MODE_LABELS[p.paymentMode] ?? p.paymentMode}
                      {p.razorpayPaymentId && (
                        <p className="text-[11px] text-gray-400">{p.razorpayPaymentId}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        p.renewed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.renewed ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-gray-500 dark:text-gray-400 max-w-[220px] truncate">
                      {p.description || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.schoolName)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label="Delete payment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
