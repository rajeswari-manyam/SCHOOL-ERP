import type{ AttendanceRecord } from "../types/attendance.types";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AttendanceTable = ({ records, onEdit, onDelete }: AttendanceTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Date</th>
        <th>Student</th>
        <th>Status</th>
        <th>Remarks</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {records.map((r) => (
        <tr key={r.id}>
          <td>{new Date(r.date).toLocaleDateString()}</td>
          <td>{r.studentName}</td>
          <td>{r.status}</td>
          <td>{r.remarks || "-"}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(r.id)}>Edit</button>
            <button className="text-red-600" onClick={() => onDelete(r.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
