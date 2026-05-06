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
import { Card } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../../../components/ui/table";

const classOptions = [
  { label: "All Classes", value: "All Classes" },
  { label: "6A", value: "6A" },
  { label: "6B", value: "6B" },
  { label: "7A", value: "7A" },
  { label: "8A", value: "8A" },
  { label: "9A", value: "9A" },
  { label: "10A", value: "10A" },
];

const severityVariant: Record<string, "red" | "amber" | "orange"> = {
  high: "red",
  medium: "orange",
  low: "amber",
};

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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1">
              Date Range
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={historyDateFrom}
                onChange={(e) => setHistoryDateFrom(e.target.value)}
                className="max-w-[180px]"
              />
              <span className="text-gray-400 text-sm">to</span>
              <Input
                type="date"
                value={historyDateTo}
                onChange={(e) => setHistoryDateTo(e.target.value)}
                className="max-w-[180px]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1">
              Class
            </label>
            <Select
              value={historyClass}
              onValueChange={(value) => setHistoryClass(value)}
              options={classOptions}
            />
          </div>

          <Button className="h-10 px-4">
            <span>⚙</span> Apply Filters
          </Button>
        </div>
      </Card>

      {/* Trend Chart + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
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
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="p-5 flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Monthly Average</p>
            <p className="text-5xl font-black text-gray-900 mt-2">{historyData.monthlyAverage}%</p>
            <p className="text-xs text-gray-500 mt-1">Across all classes</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-green-500 text-xs font-medium">
                ↑ {historyData.improvementFromLastMonth}% improvement from last month
              </span>
            </div>
          </Card>

          {historyData.actionRequired && (
            <Card className="bg-amber-50 border-amber-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600">⚡</span>
                <span className="text-xs font-semibold text-amber-800">Action Required</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                {historyData.actionRequired.message}
              </p>
              <Button variant="outline" className="mt-3 w-full text-amber-700 border-amber-300 hover:bg-amber-100">
                Generate {historyData.actionRequired.className} Detailed Report
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Chronic Absentees */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Chronic Absentees</h2>
          <p className="text-xs text-gray-500 mt-0.5">Students absent more than 5 days this month</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Absent Days</TableHead>
              <TableHead>Last Absent</TableHead>
              <TableHead>Parent Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.chronicAbsentees.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: student.avatarColor }}
                    >
                      {student.initials}
                    </div>
                    <span className="font-medium text-gray-900">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{student.className}</TableCell>
                <TableCell>
                  <Badge variant={severityVariant[student.absentSeverity] ?? "amber"} className="px-2 py-0.5 text-xs font-bold">
                    {student.absentDays} days
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{student.lastAbsent}</TableCell>
                <TableCell className="text-gray-600 font-mono text-xs">{student.parentPhone}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                      📞
                    </Button>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                      💬
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-4 text-center border-t border-gray-100">
          <Button variant="link" className="text-indigo-600 hover:text-indigo-700">
            View All Absentees
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
