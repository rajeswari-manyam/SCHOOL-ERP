import { CronJobStatus } from "../types/dashboard.types";

interface CronStatusCardProps {
  jobs: CronJobStatus[];
}

export const CronStatusCard = ({ jobs }: CronStatusCardProps) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="font-semibold">Cron Jobs</h3>
    </div>
    <div className="divide-y">
      {jobs.map((job) => (
        <div key={job.name} className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">{job.name}</p>
            <p className="text-sm text-gray-500">Last: {new Date(job.lastRun).toLocaleString()}</p>
          </div>
          <span className={`px-2 py-1 rounded text-sm ${
            job.status === "running" ? "bg-blue-100 text-blue-800" :
            job.status === "idle" ? "bg-gray-100 text-gray-800" :
            "bg-red-100 text-red-800"
          }`}>
            {job.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);
