import type { HealthItem, CronJob, CronStatus, SystemHealth } from "../types/dashboard.types";

const healthColor: Record<SystemHealth, string> = {
  HEALTHY: "text-emerald-600",
  WARNING: "text-amber-500",
  DOWN:    "text-red-500",
  PENDING: "text-amber-500",
};

const cronDot: Record<CronStatus, string> = {
  OK:      "bg-emerald-500",
  PENDING: "bg-amber-400",
  ERROR:   "bg-red-500",
};

interface PlatformHealthCardProps {
  healthItems: HealthItem[];
  cronJobs: CronJob[];
}

const PlatformHealthCard = ({ healthItems, cronJobs }: PlatformHealthCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
    <div>
      <h2 className="text-sm font-extrabold text-gray-900 mb-1">Platform Health</h2>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        All systems operational
      </span>
    </div>

    {/* Health items */}
    <div className="flex flex-col gap-2">
      {healthItems.map((item) => (
        <div key={item.label} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
          <span className="text-sm text-gray-700">{item.label}</span>
          <span className={`text-xs font-bold uppercase tracking-wide ${
            item.status === "PENDING" ? "text-amber-500" : healthColor[item.status as SystemHealth]
          }`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>

    {/* Cron jobs */}
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">Cron Jobs Status</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {cronJobs.map((job) => (
          <span key={job.label} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className={`w-2 h-2 rounded-full ${cronDot[job.status]}`} />
            {job.label}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default PlatformHealthCard;
