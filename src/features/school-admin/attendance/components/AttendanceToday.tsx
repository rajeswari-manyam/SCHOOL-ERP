import { Bell, MessageCircle, X } from "lucide-react";
import { useAttendanceStore } from "../store";
import { Card } from "../../../../components/ui/card";
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

const AttendanceToday = () => {
  const { todayData } = useAttendanceStore();
  const { summary, classes } = todayData;

  return (
    <div className="space-y-6">
      {/* WhatsApp Banner */}
      <Card className="flex items-start gap-3 bg-green-50 border-green-200 p-4">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0">
          <MessageCircle className="w-4 h-4" />
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
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600 p-1">
          <X size={16} />
        </Button>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Present</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{summary.totalPresent}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">↑ {summary.totalPresentChange}%</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Absent</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{summary.totalAbsent}</p>
          <p className="text-xs text-red-500 mt-1 font-medium">↑ {summary.totalAbsentChange}%</p>
        </Card>

        <Card className="p-4">
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
        </Card>

        <Card className="p-4">
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
        </Card>
      </div>

      {/* Class-wise Attendance Table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Class-wise Attendance — Today</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              7 April 2025 · ↺ Auto-refreshing every 60s
            </p>
          </div>
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class / Sec</TableHead>
              <TableHead>Class Teacher</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Present</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Alerts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((row, i) => (
              <TableRow key={i}>
                <TableCell className="font-bold text-gray-900">{row.classSec}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: row.teacherColor }}
                    >
                      {row.teacherInitials}
                    </div>
                    <span className="text-gray-700">{row.teacherName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{row.total}</TableCell>
                <TableCell>
                  {row.present !== null ? (
                    <span className="text-green-600 font-semibold">{row.present}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.absent !== null ? (
                    <span className="text-red-500 font-medium">{row.absent}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {row.status === "MARKED" ? (
                    <Badge variant="green" className="uppercase text-xs px-2 py-1">
                      ● Marked
                    </Badge>
                  ) : (
                    <Badge variant="red" className="uppercase text-xs px-2 py-1">
                      ● Not Marked
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {row.method ? (
                    <Badge
                      variant={row.method === "WhatsApp" ? "green" : "purple"}
                      className="uppercase text-xs px-2 py-1"
                    >
                      {row.method === "WhatsApp" ? "📱" : "🌐"} {row.method}
                    </Badge>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">
                  {row.alertsTotal > 0 ? `${row.alertsSent}/${row.alertsTotal}` : <span className="text-gray-300">—</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Send Reminder Button */}
        <div className="p-4">
          <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white">
            <Bell className="w-4 h-4" />
            Send Reminder to All Unmarked Classes
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceToday;
