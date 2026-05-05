import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface StudentFilterBarProps {
  search: string;
  setSearch: (v: string) => void;
  classFilter: string;
  setClassFilter: (v: string) => void;
  sectionFilter: string;
  setSectionFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

const CLASSES = [
  { value: "All", label: "All Classes" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
];
const SECTIONS = [
  { value: "All", label: "All Sections" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
];
const STATUSES = [
  { value: "All", label: "All Status" },
  { value: "Active", label: "Active" },
  { value: "Transferred", label: "Transferred" },
];

const StudentFilterBar = ({ search, setSearch, classFilter, setClassFilter, sectionFilter, setSectionFilter, statusFilter, setStatusFilter }: StudentFilterBarProps) => (
  <div className="flex flex-wrap gap-3 items-center">
    <div className="flex-1 min-w-[200px]">
      <Input
        placeholder="Search by name or admission no."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 font-medium">Class</span>
      <Select 
        value={classFilter} 
        onValueChange={setClassFilter} 
        options={CLASSES}
      />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 font-medium">Section</span>
      <Select 
        value={sectionFilter} 
        onValueChange={setSectionFilter} 
        options={SECTIONS}
      />
    </div>
    <Select 
      value={statusFilter} 
      onValueChange={setStatusFilter} 
      options={STATUSES}
    />
    <Button 
      variant="outline" 
      size="sm"
      className="text-xs text-indigo-600 font-semibold flex items-center gap-1"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      Advanced Filters
    </Button>
  </div>
);

export default StudentFilterBar;