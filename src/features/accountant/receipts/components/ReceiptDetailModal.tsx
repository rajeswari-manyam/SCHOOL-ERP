import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Receipt } from "../types/receipts.types";
import { formatCurrency } from "../utils/recept.utils";

export const ReceiptDetailModal = ({
  receipt,
  onClose,
}: {
  receipt: Receipt;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <Card className="w-[480px] max-h-[90vh] overflow-y-auto">
        
        <CardHeader>
          <CardTitle>Receipt Preview</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          
          {/* School Header */}
          <div className="text-center border-b pb-2">
            <h2 className="font-bold text-lg">ABC School</h2>
            <p className="text-gray-500">Fee Receipt</p>
          </div>

          {/* Details */}
          <div className="space-y-1">
            <p><b>Receipt No:</b> {receipt.receiptNo}</p>
            <p><b>Date:</b> {receipt.date}</p>
            <p><b>Student:</b> {receipt.student}</p>
            <p><b>Class:</b> {receipt.className}</p>
            <p><b>Fee Head:</b> {receipt.feeHead}</p>
            <p><b>Amount:</b> {formatCurrency(receipt.amount)}</p>
            <p><b>Mode:</b> {receipt.mode}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button>Download PDF</Button>
            <Button variant="outline">Print</Button>
            <Button variant="outline">Send WA</Button>
            <Button variant="outline">Send Email</Button>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};