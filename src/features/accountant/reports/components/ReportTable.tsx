import { Report } from "../types/reports.types";

interface ReportTableProps {
  reports: Report[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ReportTable = ({
  reports,
  onEdit,
  onDelete,
}: ReportTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Title</th>
        <th>Type</th>
        <th>Created At</th>
        <th>Created By</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {reports.map((r) => (
        <tr key={r.id}>
          <td>{r.title}</td>
          <td>{r.type}</td>
          <td>{new Date(r.createdAt).toLocaleString()}</td>
          <td>{r.createdBy}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(r.id)}>
              Edit
            </button>
            <button className="text-red-600" onClick={() => onDelete(r.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
