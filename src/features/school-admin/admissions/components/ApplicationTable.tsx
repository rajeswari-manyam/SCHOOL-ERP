import type { AdmissionApplication } from "../types/Admissions.types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ApplicationTableProps {
  applications: AdmissionApplication[];
  onReview: (id: string) => void;
}

export const ApplicationTable = ({
  applications,
  onReview,
}: ApplicationTableProps) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Student</TableHead>
        <TableHead>Class</TableHead>
        <TableHead>Parent</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Applied At</TableHead>
        <TableHead>Action</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {applications.map((a) => (
        <TableRow key={a.id}>
          <TableCell>{a.studentName}</TableCell>
          <TableCell>{a.class}</TableCell>
          <TableCell>{a.parentName}</TableCell>
          <TableCell>{a.phone}</TableCell>
          <TableCell className="capitalize">{a.status}</TableCell>
          <TableCell>{a.appliedAt}</TableCell>
          <TableCell>
            <Button variant="link" size="sm" onClick={() => onReview(a.id)}>
              Review
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
