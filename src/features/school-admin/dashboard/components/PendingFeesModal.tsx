import { useEffect, useState } from 'react';
import { X, Loader2, AlertCircle, IndianRupee } from 'lucide-react';
import { getAllPendingFees } from '@/services/fee.api';
import type { AllPendingFeesEntry } from '@/services/fee.api';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-amber-50 text-amber-600 border-amber-200',
  OVERDUE:   'bg-red-50 text-red-600 border-red-200',
  PARTIAL:   'bg-blue-50 text-blue-600 border-blue-200',
  PAID:      'bg-emerald-50 text-emerald-600 border-emerald-200',
};

interface Props {
  onClose: () => void;
}

export function PendingFeesModal({ onClose }: Props) {
  const [entries, setEntries]   = useState<AllPendingFeesEntry[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllPendingFees()
      .then((res) => {
        if (res?.status) setEntries(res.data ?? []);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const totalDue = entries.reduce((s, e) => s + (e.summary?.totalDue ?? 0), 0);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full sm:max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pending Fee Students</h2>
            {!loading && !error && (
              <p className="text-xs text-slate-400 mt-0.5">
                {entries.length} student{entries.length !== 1 ? 's' : ''} · Total due: <span className="font-semibold text-red-500">{fmt(totalDue)}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">

          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <p className="text-sm">Loading pending fees…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-sm">Failed to load data. Please try again.</p>
            </div>
          )}

          {!loading && !error && entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <IndianRupee className="w-6 h-6 text-emerald-400" />
              <p className="text-sm font-semibold">No pending fees!</p>
              <p className="text-xs">All students are up to date.</p>
            </div>
          )}

          {!loading && !error && entries.length > 0 && (
            <div className="space-y-3">
              {entries.map((entry) => {
                const name    = entry.student?.name ?? '—';
                const summary = entry.summary;
                const status  = summary?.overallStatus ?? 'PENDING';
                const due     = summary?.totalDue ?? 0;
                const paid    = summary?.totalPaid ?? 0;
                const total   = summary?.totalFinal ?? (due + paid);
                const paidPct = total > 0 ? Math.round((paid / total) * 100) : 0;

                return (
                  <div
                    key={entry.student?.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {getInitials(name)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{name}</p>
                        <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_STYLES[status] ?? STATUS_STYLES['PENDING']}`}>
                          {status}
                        </span>
                      </div>
                      {/* Mini progress bar */}
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${paidPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                        <span>{fmt(paid)} paid</span>
                        <span>{paidPct}%</span>
                      </div>
                    </div>

                    {/* Amount due */}
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-red-500">{fmt(due)}</p>
                      <p className="text-[10px] text-slate-400">due</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
