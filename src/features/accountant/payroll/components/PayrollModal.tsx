import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  onClose: () => void;
  onSubmit: () => void;
}

export const ProcessPayrollModal = ({ onClose, onSubmit }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <Card className="relative w-full max-w-[640px] mx-4">
        <CardHeader className="flex justify-between">
          <CardTitle>Process Payroll</CardTitle>
          <button onClick={onClose}>
            <X />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>Total Staff: 28</div>
            <div>Total Gross: ₹3,64,280</div>
            <div>Total Net: ₹3,47,280</div>
          </div>

          <div className="flex gap-3">
            <Button>Bank Transfer</Button>
            <Button variant="outline">Cash</Button>
            <Button variant="outline">Cheque</Button>
          </div>

          <input type="date" className="w-full border p-2 rounded" />
          <input placeholder="Approval note..." className="w-full border p-2 rounded" />

          <div className="space-y-2">
            <label><input type="checkbox" /> Confirm payroll accuracy</label>
            <label><input type="checkbox" /> Approve payment</label>
          </div>

          <div className="flex gap-3">
            <Button onClick={onSubmit} className="flex-1">
              Process Payroll ₹3,47,280
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