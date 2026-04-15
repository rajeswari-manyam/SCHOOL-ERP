import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const FilterBar = () => {
  return (
    <div className="flex gap-3 flex-wrap">
      <Input placeholder="Search student..." />
      <Input type="date" />
      <Input type="date" />

      <Button variant="outline">Export CSV</Button>
      <Button variant="outline">Export PDF</Button>
    </div>
  );
};