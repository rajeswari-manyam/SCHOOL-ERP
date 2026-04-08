import { TimetableEntry } from "../types/timetable.types";

interface TimetableTableProps {
  entries: TimetableEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TimetableTable = ({
  entries,
  onEdit,
  onDelete,
}: TimetableTableProps) => (
  <table className="min-w-full bg-white">
    <thead>
      <tr>
        <th>Class</th>
        <th>Section</th>
        <th>Subject</th>
        <th>Teacher</th>
        <th>Day</th>
        <th>Start Time</th>
        <th>End Time</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {entries.map((entry) => (
        <tr key={entry.id}>
          <td>{entry.class}</td>
          <td>{entry.section}</td>
          <td>{entry.subject}</td>
          <td>{entry.teacher}</td>
          <td>{entry.day}</td>
          <td>{entry.startTime}</td>
          <td>{entry.endTime}</td>
          <td>
            <button
              className="text-blue-600 mr-2"
              onClick={() => onEdit(entry.id)}
            >
              Edit
            </button>
            <button className="text-red-600" onClick={() => onDelete(entry.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
