import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface AttendanceTableRecord {
  id: string;
  date: string;
  studentName: string;
  status: string;
  remarks?: string | null;
}

interface AttendanceTableProps {
  records: AttendanceTableRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AttendanceTable = ({ records, onEdit, onDelete }: AttendanceTableProps) => (
  <Table className="bg-white shadow-sm rounded-2xl">
    <TableHeader>
      <TableRow>
        <TableHead>Date</TableHead>
        <TableHead>Student</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Remarks</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {records.map((record) => (
        <TableRow key={record.id}>
          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
          <TableCell>{record.studentName}</TableCell>
          <TableCell>{record.status}</TableCell>
          <TableCell>{record.remarks || "-"}</TableCell>
          <TableCell className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
              onClick={() => onEdit(record.id)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(record.id)}
            >
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
