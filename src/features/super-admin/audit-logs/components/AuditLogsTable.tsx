import { format, parseISO } from "date-fns";
import type { AuditLog } from "../types/audit-logs.types";
import ActionBadge from "./ActionBadge";
import { Table } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLogsTableProps {
  logs: AuditLog[];
  isLoading: boolean;
  onView: (log: AuditLog) => void;
}

const COL = "text-[11px] font-semibold uppercase tracking-widest text-gray-400 py-3 px-4 text-left";

const AuditLogsTable = ({ logs, isLoading, onView }: AuditLogsTableProps) => {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-50">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 animate-pulse">
            <div className="h-3 w-36 rounded bg-gray-100" />
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="h-6 w-28 rounded-full bg-gray-100" />
            <div className="h-3 w-32 rounded bg-gray-100 flex-1" />
            <div className="h-3 w-24 rounded bg-gray-100" />
            <div className="h-3 w-8 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-500">No logs found</p>
        <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
     
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={COL}>Timestamp</th>
            <th className={COL}>Actor</th>
            <th className={COL}>Action</th>
            <th className={COL}>School</th>
            <th className={COL}>IP Address</th>
            <th className={COL}>Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-gray-50/60 transition-colors group">
              {/* Timestamp */}
              <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                {format(parseISO(log.timestamp), "dd MMM yyyy hh:mm a")}
              </td>

              {/* Actor */}
              <td className="px-4 py-4">
                <p className="text-sm font-semibold text-gray-900 leading-tight">{log.actor}</p>
                {log.actorRole && (
                  <p className="text-xs text-gray-400 mt-0.5">{log.actorRole}</p>
                )}
              </td>

              {/* Action */}
              <td className="px-4 py-4">
                <ActionBadge action={log.action} />
              </td>

              {/* School */}
              <td className="px-4 py-4 text-sm text-gray-600">
                {log.school ?? <span className="text-gray-300 select-none">—</span>}
              </td>

              {/* IP Address */}
              <td className="px-4 py-4">
                {log.ipAddress === "internal" ? (
                  <span className="text-sm italic text-gray-400">internal</span>
                ) : (
                  <span className="text-sm font-mono text-gray-500">{log.ipAddress}</span>
                )}
              </td>

              {/* View */}
              <td className="px-4 py-4">
                <Button
                  onClick={() => onView(log)}
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogsTable;
