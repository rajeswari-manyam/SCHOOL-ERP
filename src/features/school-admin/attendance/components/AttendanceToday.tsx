import { useAttendanceStore } from "../store";

const AttendanceToday = () => {
  const { todayData, } = useAttendanceStore();
  const { summary, classes } = todayData;

  return (
    <div className="space-y-6">
      {/* WhatsApp Banner */}
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 relative">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">
            Teachers mark attendance by sending WhatsApp to{" "}
            <span className="font-bold">+91 90000 12345</span>
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Format: 7A Absent: Student Name1, Student Name2
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Present */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Present</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{summary.totalPresent}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">
            ↑ {summary.totalPresentChange}%
          </p>
        </div>

        {/* Total Absent */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Absent</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{summary.totalAbsent}</p>
          <p className="text-xs text-red-500 mt-1 font-medium">
            ↑ {summary.totalAbsentChange}%
          </p>
        </div>

        {/* Classes Marked */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Classes Marked</p>
          <div className="flex items-end gap-1 mt-2">
            <p className="text-3xl font-bold text-gray-900">{summary.classesMarked}</p>
            <p className="text-lg text-gray-400 mb-1">/{summary.classesTotal}</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1 mt-2">
            <div
              className="bg-indigo-600 h-1 rounded-full"
              style={{ width: `${(summary.classesMarked / summary.classesTotal) * 100}%` }}
            />
          </div>
        </div>

        {/* Alerts Sent */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Alerts Sent</p>
          <div className="flex items-end gap-1 mt-2">
            <p className="text-3xl font-bold text-gray-900">{summary.alertsSent}</p>
            <p className="text-lg text-gray-400 mb-1">/{summary.alertsTotal}</p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">✓</span>
            </div>
            <span className="text-xs text-green-600 font-medium">All sent</span>
          </div>
        </div>
      </div>

      {/* Class-wise Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Class-wise Attendance — Today</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              7 April 2025 · ↺ Auto-refreshing every 60s
            </p>
          </div>
          {/* Teacher avatars */}
          <div className="flex items-center -space-x-2">
            {["#6366F1", "#10B981", "#F59E0B", "#EF4444"].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                T
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold ml-1">
              +12
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Class / Sec
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Class Teacher
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Present
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Absent
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Method
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Alerts
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">{row.classSec}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: row.teacherColor }}
                      >
                        {row.teacherInitials}
                      </div>
                      <span className="text-gray-700">{row.teacherName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{row.total}</td>
                  <td className="py-4 px-4">
                    {row.present !== null ? (
                      <span className="text-green-600 font-semibold">{row.present}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {row.absent !== null ? (
                      <span className="text-red-500 font-medium">{row.absent}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {row.status === "MARKED" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                        ● MARKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                        ● NOT MARKED
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {row.method ? (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          row.method === "WhatsApp"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-purple-50 text-purple-700 border border-purple-200"
                        }`}
                      >
                        {row.method === "WhatsApp" ? "📱" : "🌐"} {row.method}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600">
                    {row.alertsTotal > 0 ? (
                      `${row.alertsSent}/${row.alertsTotal}`
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Send Reminder Button */}
        <div className="p-4">
          <button className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
            <span>🔔</span>
            Send Reminder to All Unmarked Classes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceToday;
