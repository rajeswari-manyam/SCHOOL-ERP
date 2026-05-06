import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

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

const StudentFilterBar = ({
  search,
  setSearch,
  classFilter,
  setClassFilter,
  sectionFilter,
  setSectionFilter,
  statusFilter,
  setStatusFilter,
}: StudentFilterBarProps) => (
  <div className="w-full overflow-x-auto">
    <div className="flex items-center gap-3 min-w-max">

      {/* Search */}
      <div className="w-[260px] flex-shrink-0">
        <Input
          placeholder="Search by name or admission no."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Class */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-gray-400 font-medium">Class</span>
        <div className="w-[110px]">
          <Select
            value={classFilter}
            onValueChange={setClassFilter}
            options={CLASSES}
          />
        </div>
      </div>

      {/* Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-gray-400 font-medium">Section</span>
        <div className="w-[110px]">
          <Select
            value={sectionFilter}
            onValueChange={setSectionFilter}
            options={SECTIONS}
          />
        </div>
      </div>

      {/* Status */}
      <div className="w-[140px] flex-shrink-0">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={STATUSES}
        />
      </div>

      {/* Button */}
      <Button
        variant="outline"
        size="sm"
        className="text-xs text-indigo-600 font-semibold flex items-center gap-1 whitespace-nowrap flex-shrink-0"
      >
        <Filter className="h-3 w-3" />
        Advanced Filters
      </Button>
    </div>
  </div>
);

export default StudentFilterBar;