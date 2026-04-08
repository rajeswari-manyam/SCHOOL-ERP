import { Student } from "../types/student.types";

interface StudentTableProps {
  students: Student[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const StudentTable = ({
  students,
  onEdit,
  onDelete,
}: StudentTableProps) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Class</th>
          <th className="px-4 py-2">Section</th>
          <th className="px-4 py-2">Roll No</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((s) => (
          <tr key={s.id}>
            <td className="px-4 py-2">{s.name}</td>
            <td className="px-4 py-2">{s.class}</td>
            <td className="px-4 py-2">{s.section}</td>
            <td className="px-4 py-2">{s.rollNo}</td>
            <td className="px-4 py-2">{s.phone}</td>
            <td className="px-4 py-2">
              <button
                className="text-blue-600 mr-2"
                onClick={() => onEdit(s.id)}
              >
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
  </div>
);
