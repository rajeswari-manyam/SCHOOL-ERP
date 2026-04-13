import { format, parseISO } from "date-fns";
import ActionBadge from "./ActionBadge";
import type { AuditLog } from "../types/audit-logs.types";

interface AuditLogDetailDrawerProps {
  log: AuditLog | null;
  onClose: () => void;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-1 py-3 border-b border-gray-50 last:border-0">
    <span className="text-[11px] font-bold tracking-widest uppercase text-gray-400">{label}</span>
    <span className="text-sm text-gray-800">{value}</span>
  </div>
);

const AuditLogDetailDrawer = ({ log, onClose }: AuditLogDetailDrawerProps) => {
  if (!log) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900">Log Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Row label="Log ID"       value={<span className="font-mono text-xs text-gray-500">{log.id}</span>} />
          <Row label="Timestamp"    value={format(parseISO(log.timestamp), "dd MMM yyyy, hh:mm:ss a")} />
          <Row label="Actor"        value={
            <div>
              <p className="font-semibold text-gray-900">{log.actor}</p>
              {log.actorRole && <p className="text-xs text-gray-400 mt-0.5">{log.actorRole}</p>}
            </div>
          } />
          <Row label="Action"       value={<ActionBadge action={log.action} />} />
          <Row label="School"       value={log.school ?? <span className="text-gray-300">—</span>} />
          <Row label="IP Address"   value={
            <span className={log.ipAddress === "internal" ? "italic text-gray-400" : "font-mono text-xs"}>
              {log.ipAddress}
            </span>
          } />

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-2">Metadata</p>
              <pre className="text-xs bg-gray-50 rounded-xl p-4 text-gray-600 overflow-x-auto border border-gray-100 leading-relaxed">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuditLogDetailDrawer;
