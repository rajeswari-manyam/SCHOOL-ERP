import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ProcessPayrollModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      
      <Card className="w-[640px]">
        
        <CardHeader>
          <CardTitle>Process Payroll</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div>Total Staff: 10</div>
            <div>Total Gross: ₹3,00,000</div>
            <div>Total Net: ₹2,80,000</div>
          </div>

          {/* Payment Mode */}
          <div className="flex gap-3">
            <Button variant="outline">Bank</Button>
            <Button variant="outline">Cash</Button>
          </div>

          {/* Date */}
          <Input type="date" />

          {/* Notes */}
          <Input placeholder="Approval note..." />

          {/* Confirmations */}
          <div className="space-y-2">
            <label>
              <input type="checkbox" /> I confirm payroll accuracy
            </label>
            <label>
              <input type="checkbox" /> I approve payment
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onSubmit}>
              Process Payroll ₹2,80,000
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};