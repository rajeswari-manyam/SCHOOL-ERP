import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { ReceiptFilters } from "../components/ReceptFilter";
import { ReceiptDetailModal } from "../components/ReceiptDetailModal";
import { useReceipts } from "../hooks/useReceipts";
import { formatCurrency } from "../utils/recept.utils";

export default function ReceiptsPage() {
  const { data } = useReceipts();
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="space-y-6">

      {/* Filters */}
      <ReceiptFilters />

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Receipts</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Fee Head</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.receiptNo}</TableCell>
                  <TableCell>{r.date}</TableCell>
                  <TableCell>{r.student}</TableCell>
                  <TableCell>{r.className}</TableCell>
                  <TableCell>{r.feeHead}</TableCell>
                  <TableCell>{formatCurrency(r.amount)}</TableCell>
                  <TableCell>{r.mode}</TableCell>
                  <TableCell>
                    {r.sentToParent ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => setSelected(r)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      {selected && (
        <ReceiptDetailModal
          receipt={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}