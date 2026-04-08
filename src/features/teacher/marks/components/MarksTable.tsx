import type{ MarkEntry } from "../types/marks.types";

interface MarksTableProps {
  marks: MarkEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MarksTable = ({ marks, onEdit, onDelete }: MarksTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Student</th>
        <th>Subject</th>
        <th>Exam</th>
        <th>Marks</th>
        <th>Max Marks</th>
        <th>Remarks</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {marks.map((m) => (
        <tr key={m.id}>
          <td>{m.studentName}</td>
          <td>{m.subject}</td>
          <td>{m.exam}</td>
          <td>{m.marks}</td>
          <td>{m.maxMarks}</td>
          <td>{m.remarks || "-"}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(m.id)}>Edit</button>
            <button className="text-red-600" onClick={() => onDelete(m.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
