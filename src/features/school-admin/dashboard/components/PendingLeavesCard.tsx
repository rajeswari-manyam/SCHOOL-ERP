import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { approveLeave, rejectLeave } from '@/services/staff.api';
import { useQueryClient } from '@tanstack/react-query';
import { DASHBOARD_QUERY_KEY } from '../hooks/index';

const LEAVE_TYPE_STYLE: Record<string, string> = {
  casual:    'bg-sky-50 text-sky-700 border-sky-200',
  sick:      'bg-rose-50 text-rose-700 border-rose-200',
  personal:  'bg-violet-50 text-violet-700 border-violet-200',
  emergency: 'bg-amber-50 text-amber-700 border-amber-200',
};

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-pink-100 text-pink-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length];

const fmt = (d: string) =>
  d ? new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

interface PendingLeave {
  id: string;
  staff_id: string;
  staff_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  staff?: { name: string; email?: string; phone?: string };
}

interface Props {
  leaves: PendingLeave[];
  isLoading?: boolean;
}

export function PendingLeavesCard({ leaves, isLoading }: Props) {
  const qc = useQueryClient();
  const [processing, setProcessing] = useState<Record<string, 'approving' | 'rejecting'>>({});

  const handleApprove = async (id: string) => {
    setProcessing(p => ({ ...p, [id]: 'approving' }));
    try {
      await approveLeave(id);
      toast.success('Leave approved');
      qc.invalidateQueries({ queryKey: [...DASHBOARD_QUERY_KEY, 'pending-leaves'] });
    } catch {
      toast.error('Failed to approve leave');
    } finally {
      setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  const handleReject = async (id: string) => {
    setProcessing(p => ({ ...p, [id]: 'rejecting' }));
    try {
      await rejectLeave(id);
      toast.success('Leave rejected');
      qc.invalidateQueries({ queryKey: [...DASHBOARD_QUERY_KEY, 'pending-leaves'] });
    } catch {
      toast.error('Failed to reject leave');
    } finally {
      setProcessing(p => { const n = { ...p }; delete n[id]; return n; });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-amber-500" strokeWidth={2} />
          <h3 className="text-sm font-bold text-gray-900">Pending Leave Requests</h3>
          {!isLoading && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
              {leaves.length}
            </span>
          )}
        </div>
        <Clock size={14} className="text-gray-300" />
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="divide-y divide-gray-50">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 px-5 py-4 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-28 rounded bg-gray-100" />
                <div className="h-2.5 w-40 rounded bg-gray-100" />
              </div>
              <div className="h-7 w-20 rounded-lg bg-gray-100" />
            </div>
          ))}
        </div>
      ) : leaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
          <CheckCircle2 size={28} className="text-emerald-300" strokeWidth={1.5} />
          <p className="text-xs font-medium">No pending leave requests</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50 max-h-[340px] overflow-y-auto">
          {leaves.map(leave => {
            const name = leave.staff?.name ?? leave.staff_name ?? '?';
            const typeStyle = LEAVE_TYPE_STYLE[leave.leave_type?.toLowerCase()] ?? 'bg-gray-50 text-gray-600 border-gray-200';
            const busy = !!processing[leave.id];
            return (
              <div key={leave.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(name)}`}>
                  {name.slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-gray-900 truncate">{name}</p>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-bold uppercase ${typeStyle}`}>
                      {leave.leave_type}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {fmt(leave.start_date)} → {fmt(leave.end_date)}
                    <span className="ml-1 font-semibold text-gray-500">· {leave.total_days}d</span>
                  </p>
                  {leave.reason && (
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{leave.reason}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    disabled={busy}
                    onClick={() => handleApprove(leave.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold border border-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                    {processing[leave.id] === 'approving' ? '…' : 'Approve'}
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => handleReject(leave.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle size={12} strokeWidth={2.5} />
                    {processing[leave.id] === 'rejecting' ? '…' : 'Reject'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
