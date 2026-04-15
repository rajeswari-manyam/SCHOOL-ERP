import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { Report } from "../types/reports.types";

export const RecentReportsTable = ({
  data,
}: {
  data: Report[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Generated At</TableHead>
          <TableHead>Format</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.generatedAt}</TableCell>
            <TableCell>{r.format}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};