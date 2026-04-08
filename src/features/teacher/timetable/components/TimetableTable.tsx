import type { TimetableEntry } from "../types/timetable.types";

interface TimetableTableProps {
  entries: TimetableEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TimetableTable = ({ entries, onEdit, onDelete }: TimetableTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Day</th>
        <th>Period</th>
        <th>Subject</th>
        <th>Class</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {entries.map((e) => (
        <tr key={e.id}>
          <td>{e.day}</td>
          <td>{e.period}</td>
          <td>{e.subject}</td>
          <td>{e.className}</td>
          <td>{e.startTime}</td>
          <td>{e.endTime}</td>
          <td>
            <button className="text-blue-600 mr-2" onClick={() => onEdit(e.id)}>Edit</button>
            <button className="text-red-600" onClick={() => onDelete(e.id)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
