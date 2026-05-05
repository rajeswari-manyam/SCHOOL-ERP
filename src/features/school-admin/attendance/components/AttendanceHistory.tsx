import { useAttendanceStore } from "../store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const AttendanceHistory = () => {
  const {
    historyData,
    historyDateFrom,
    historyDateTo,
    historyClass,
    setHistoryDateFrom,
    setHistoryDateTo,
    setHistoryClass,
  } = useAttendanceStore();

  const severityColors: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={historyDateFrom}
                onChange={(e) => setHistoryDateFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <span className="text-gray-400 text-sm">to</span>
              <input
                type="date"
                value={historyDateTo}
                onChange={(e) => setHistoryDateTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1">
              Class
            </label>
            <select
              value={historyClass}
              onChange={(e) => setHistoryClass(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>All Classes</option>
              <option>6A</option>
              <option>6B</option>
              <option>7A</option>
              <option>8A</option>
              <option>9A</option>
              <option>10A</option>
            </select>
          </div>

          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <span>⚙</span> Apply Filters
          </button>
        </div>
      </div>

      {/* Trend Chart + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Attendance Trend — Last 30 Days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={historyData.trendData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
              <Tooltip
                contentStyle={{ fontSize: "12px", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              <Line
                type="monotone"
                dataKey="class6A"
                stroke="#6366F1"
                strokeWidth={2}
                dot={false}
                name="6A"
              />
              <Line
                type="monotone"
                dataKey="class7A"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                name="7A"
              />
              <Line
                type="monotone"
                dataKey="class8A"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="8A"
              />
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#9CA3AF"
                strokeWidth={1.5}
                strokeDasharray="5 5"
                dot={false}
                name="AVG"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stats + Action */}
        <div className="flex flex-col gap-4">
          {/* Monthly Average */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Monthly Average</p>
            <p className="text-5xl font-black text-gray-900 mt-2">{historyData.monthlyAverage}%</p>
            <p className="text-xs text-gray-500 mt-1">Across all classes</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-green-500 text-xs font-medium">
                ↑ {historyData.improvementFromLastMonth}% improvement from last month
              </span>
            </div>
          </div>

          {/* Action Required */}
          {historyData.actionRequired && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600">⚡</span>
                <span className="text-xs font-semibold text-amber-800">Action Required</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                {historyData.actionRequired.message}
              </p>
              <button className="mt-3 w-full py-2 px-3 border border-amber-300 text-amber-700 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors">
                Generate {historyData.actionRequired.className} Detailed Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chronic Absentees */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Chronic Absentees</h2>
          <p className="text-xs text-gray-500 mt-0.5">Students absent more than 5 days this month</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Class</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Absent Days</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Absent</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Parent Contact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyData.chronicAbsentees.map((student) => (
                <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: student.avatarColor }}
                      >
                        {student.initials}
                      </div>
                      <span className="font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{student.className}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${severityColors[student.absentSeverity]}`}>
                      {student.absentDays} days
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{student.lastAbsent}</td>
                  <td className="py-4 px-4 text-gray-600 font-mono text-xs">{student.parentPhone}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button className="w-7 h-7 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors text-xs">
                        📞
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors text-xs">
                        💬
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center border-t border-gray-100">
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
            View All Absentees
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
