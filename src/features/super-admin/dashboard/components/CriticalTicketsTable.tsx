import { useNavigate } from "react-router-dom";
import type { CriticalTicket } from "../types/dashboard.types";

const priorityStyle = (priority?: string) => {
  const p = (priority ?? "").toLowerCase();
  if (p === "urgent") return "border border-red-400 text-red-500";
  if (p === "high") return "border border-amber-400 text-amber-600";
  if (p === "low") return "bg-gray-100 text-gray-500";
  return "bg-indigo-50 text-indigo-500 border border-indigo-200";
};

const statusStyle = (status?: string) => {
  const s = (status ?? "").toLowerCase();
  if (s.includes("progress")) return { text: "text-amber-500", dot: "bg-amber-400" };
  if (s.includes("resolved") || s.includes("closed")) return { text: "text-emerald-600", dot: "bg-emerald-500" };
  return { text: "text-red-500", dot: "bg-red-500" };
};

const timeAgo = (iso?: string) => {
  if (!iso) return "—";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const COL = "text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-4 py-2 text-left";

interface CriticalTicketsTableProps {
  tickets: CriticalTicket[];
  requiresAction: number;
  isLoading: boolean;
}

const CriticalTicketsTable = ({ tickets, requiresAction, isLoading }: CriticalTicketsTableProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-3 border-b border-gray-50">
        <h2 className="text-[13px] font-extrabold text-gray-900">Critical Support Tickets</h2>
        {requiresAction > 0 && (
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">
            {requiresAction} REQUIRES ACTION
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="divide-y divide-gray-50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-3 w-24 rounded bg-gray-100" />
              <div className="h-3 flex-1 rounded bg-gray-100" />
              <div className="h-5 w-14 rounded-full bg-gray-100" />
              <div className="h-3 w-16 rounded bg-gray-100" />
              <div className="h-3 w-14 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="py-10 text-center text-sm text-gray-400">No critical tickets right now.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-full table-auto">
          <thead>
            <tr className="bg-[#EFF4FF] border-b border-gray-50">
              <th className={COL}>Ticket ID</th>
              <th className={COL}>School</th>
              <th className={COL}>Subject</th>
              <th className={COL}>Priority</th>
              <th className={COL}>Status</th>
              <th className={COL}>Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tickets.map((t, i) => {
              const s = statusStyle(t.status);
              return (
                <tr key={t.id ?? i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => navigate(`/super-admin/support?ticket=${t.id ?? ""}`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {t.ticketId ?? t.id?.slice(0, 8).toUpperCase() ?? "—"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-900">{t.school ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[220px]">{t.subject ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${priorityStyle(t.priority)}`}>
                      {t.priority ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${s.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {t.status ?? "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{timeAgo(t.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default CriticalTicketsTable;
