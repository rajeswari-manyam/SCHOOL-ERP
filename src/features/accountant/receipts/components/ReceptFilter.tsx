import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ReceiptFilters = () => {
  return (
    <div className="flex gap-3 flex-wrap">
      <Input placeholder="Search receipt or student..." />
      <Input type="date" />
      <Input type="date" />
      <Input placeholder="Class" />
      <Input placeholder="Payment Mode" />

      <Button variant="outline">Export All</Button>
    </div>
  );
};