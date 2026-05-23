import type { LeaveApplication } from "../types/leave.types";
import { LEAVE_TYPE_META, LEAVE_STATUS_META, formatDisplayDate } from "../hooks/useLeave";

interface Props {
  applications: LeaveApplication[];
  onCancel: (id: string) => void;
}

const LeaveHistoryTable = ({ applications, onCancel }: Props) => {
  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
        <p className="text-sm font-semibold text-gray-400">No leave applications yet</p>
        <p className="text-xs text-gray-300 mt-1">Apply for leave using the button above</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-gray-900">Leave History</h3>
        <span className="text-xs text-gray-400">{applications.length} applications</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 680 }}>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Leave Type", "From", "To", "Days", "Reason", "Status", "Applied On", "Action"].map(h => (
                <th key={h}
                  className="px-5 py-3 text-left text-[11px] font-extrabold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((app, i) => {
              const tm  = LEAVE_TYPE_META[app.type];
              const sm  = LEAVE_STATUS_META[app.status];
              const canCancel = app.status === "PENDING";

              return (
                <tr key={app.id}
                  className={`border-b border-gray-50 last:border-0 transition-colors hover:bg-gray-50/50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/20"}`}>

                  {/* Leave Type */}
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${tm.bg} ${tm.color} ${tm.border}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tm.dot}`} />
                      {tm.shortLabel}
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{formatDisplayDate(app.fromDate)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-gray-800">{formatDisplayDate(app.toDate)}</p>
                  </td>

                  {/* Days */}
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-bold text-gray-700">{app.totalDays}d</span>
                  </td>

                  {/* Reason */}
                  <td className="px-5 py-3.5 max-w-[220px]">
                    <p className="text-sm text-gray-600 truncate" title={app.reason}>{app.reason}</p>
                    {app.medicalCertUrl && (
                      <a href={app.medicalCertUrl} target="_blank" rel="noreferrer"
                        className="text-[10px] text-indigo-600 font-semibold hover:underline mt-0.5 inline-block">
                        📄 Medical cert
                      </a>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <div>
                      <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full ${sm.classes}`}>
                        {sm.label}
                      </span>
                      {app.reviewedBy && (
                        <p className="text-[10px] text-gray-400 mt-1">by {app.reviewedBy}</p>
                      )}
                      {app.rejectionReason && (
                        <p className="text-[10px] text-red-400 mt-0.5 truncate max-w-[120px]" title={app.rejectionReason}>
                          {app.rejectionReason}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Applied On */}
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-gray-500">{formatDisplayDate(app.appliedOn)}</p>
                  </td>

                  {/* Action */}
                  <td className="px-5 py-3.5">
                    {canCancel ? (
                      <button
                        onClick={() => onCancel(app.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveHistoryTable;
