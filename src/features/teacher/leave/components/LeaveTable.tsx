import { LeaveRequest } from "../types/leave.types";

interface LeaveTableProps {
  requests: LeaveRequest[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LeaveTable = ({ requests, onEdit, onDelete }: LeaveTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Reason</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {requests.map((r) => (
        <tr key={r.id}>
          <td>{new Date(r.startDate).toLocaleDateString()}</td>
          <td>{new Date(r.endDate).toLocaleDateString()}</td>
          <td>{r.reason}</td>
          <td>{r.status}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(r.id)}>Edit</button>
            <button className="text-red-600" onClick={() => onDelete(r.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
