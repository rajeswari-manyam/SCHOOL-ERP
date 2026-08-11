import type { PlatformHealthStatus, ScheduledJobStatus } from "../types/dashboard.types";

const OK_STATUSES = new Set(["operational", "connected", "active", "healthy", "ok"]);

const statusColor = (status: string) => {
  const s = status.toLowerCase();
  if (OK_STATUSES.has(s)) return "text-emerald-600";
  if (s.includes("pending") || s.includes("warn")) return "text-amber-500";
  return "text-red-500";
};

const dotColor = (status: string) => {
  const s = status.toLowerCase();
  if (OK_STATUSES.has(s)) return "bg-emerald-500";
  if (s.includes("pending") || s.includes("warn")) return "bg-amber-400";
  return "bg-red-500";
};

const allOperational = (items: PlatformHealthStatus[]) =>
  items.every((i) => OK_STATUSES.has(i.status.toLowerCase()));

interface PlatformHealthCardProps {
  healthItems: PlatformHealthStatus[];
  cronJobs: ScheduledJobStatus[];
  isLoading?: boolean;
}

const PlatformHealthCard = ({ healthItems, cronJobs, isLoading = false }: PlatformHealthCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
    <div>
      <h2 className="text-[13px] font-extrabold text-gray-900 mb-1">Platform Health</h2>
      {isLoading ? (
        <div className="h-3 w-40 rounded bg-gray-100 animate-pulse" />
      ) : (
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${allOperational(healthItems) ? "text-emerald-600" : "text-amber-600"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${allOperational(healthItems) ? "bg-emerald-500" : "bg-amber-400"}`} />
          {allOperational(healthItems) ? "All systems operational" : "Some systems need attention"}
        </span>
      )}
    </div>

    {/* Health items */}
    <div className="flex flex-col gap-1.5">
      {isLoading ? (
        [1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-xl">
            <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
          </div>
        ))
      ) : (
        healthItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between px-3 py-1.5 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-700">{item.label}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${statusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
        ))
      )}
    </div>

    {/* Scheduled jobs */}
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Cron Jobs Status</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
          ))
        ) : (
          cronJobs.map((job) => (
            <span key={job.label} className="flex items-center gap-1.5 text-[11px] text-gray-600">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor(job.status)}`} />
              {job.label}
            </span>
          ))
        )}
      </div>
    </div>
  </div>
);

export default PlatformHealthCard;
