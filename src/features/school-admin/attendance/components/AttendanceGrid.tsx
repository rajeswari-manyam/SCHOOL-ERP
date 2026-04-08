import type{ AttendanceRecord } from "../types/attendance.types";

interface AttendanceGridProps {
  records: AttendanceRecord[];
}

export const AttendanceGrid = ({ records }: AttendanceGridProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2">Student</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Remarks</th>
        </tr>
      </thead>
      <tbody>
        {records.map((rec) => (
          <tr key={rec.id}>
            <td className="px-4 py-2">{rec.studentName}</td>
            <td className="px-4 py-2 capitalize">{rec.status}</td>
            <td className="px-4 py-2">{rec.remarks ?? "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
