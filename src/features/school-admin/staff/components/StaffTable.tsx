import { Staff } from "../types/staff.types";

interface StaffTableProps {
  staff: Staff[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StaffTable = ({ staff, onEdit, onDelete }: StaffTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Role</th>
        <th>Department</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {staff.map((s) => (
        <tr key={s.id}>
          <td>{s.name}</td>
          <td>{s.email}</td>
          <td>{s.phone}</td>
          <td>{s.role}</td>
          <td>{s.department}</td>
          <td>{s.status}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(s.id)}>
              Edit
            </button>
            <button className="text-red-600" onClick={() => onDelete(s.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
