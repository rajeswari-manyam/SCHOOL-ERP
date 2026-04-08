import type{ Homework } from "../types/homework.types";

interface HomeworkTableProps {
  homework: Homework[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HomeworkTable = ({ homework, onEdit, onDelete }: HomeworkTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Title</th>
        <th>Class</th>
        <th>Due Date</th>
        <th>Description</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {homework.map((h) => (
        <tr key={h.id}>
          <td>{h.title}</td>
          <td>{h.className}</td>
          <td>{new Date(h.dueDate).toLocaleDateString()}</td>
          <td>{h.description}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(h.id)}>Edit</button>
            <button className="text-red-600" onClick={() => onDelete(h.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
