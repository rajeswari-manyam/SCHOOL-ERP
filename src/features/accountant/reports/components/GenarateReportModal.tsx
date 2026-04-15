import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const GenerateReportModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      
      <Card className="w-[480px]">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          <Input placeholder="Report Type" />
          <Input type="date" />
          <Input type="date" />
          <Input placeholder="Class filter" />

          {/* Columns */}
          <div className="space-y-1 text-sm">
            <label><input type="checkbox" /> Include Amount</label>
            <label><input type="checkbox" /> Include Student</label>
            <label><input type="checkbox" /> Include Date</label>
          </div>

          {/* Format */}
          <div className="flex gap-3">
            <Button variant="outline">PDF</Button>
            <Button variant="outline">Excel</Button>
          </div>

          {/* Email */}
          <label className="text-sm">
            <input type="checkbox" /> Send via Email
          </label>

          <div className="flex gap-3">
            <Button onClick={onSubmit}>Generate</Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};