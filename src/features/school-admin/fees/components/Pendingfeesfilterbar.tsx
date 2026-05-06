
import type { FeeStatusFilter, SortOption } from "../types/fees.types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PendingFeesFilterBarProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  classFilter: string;
  onClassChange: (v: string) => void;
  sectionFilter: string;
  onSectionChange: (v: string) => void;
  statusFilter: FeeStatusFilter;
  onStatusChange: (v: FeeStatusFilter) => void;
  feeHeadFilter: string;
  onFeeHeadChange: (v: string) => void;
  sortOption: SortOption;
  onSortChange: (v: SortOption) => void;
}

const STATUS_OPTIONS: FeeStatusFilter[] = ["All", "3-Day Warning", "Due Today", "Overdue", "Severely Overdue"];
const CLASSES = ["All Classes", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
const SECTIONS = ["All Sections", "Section A", "Section B", "Section C"];
const FEE_HEADS = ["All Fee Heads", "Tuition Fee", "Exam Fee", "Transport Fee", "Activity Fee", "Library Fee"];
const SORT_OPTIONS: SortOption[] = ["Days Overdue", "Amount", "Name", "Due Date"];

export function PendingFeesFilterBar({
  searchQuery, onSearchChange,
  classFilter, onClassChange,
  sectionFilter, onSectionChange,
  statusFilter, onStatusChange,
  feeHeadFilter, onFeeHeadChange,
  sortOption, onSortChange,
}: PendingFeesFilterBarProps) {
  return (
    <div className="space-y-3 mb-4">
      {/* Search + dropdowns */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <Input
            placeholder="Search student/adm no."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <Select
          value={classFilter}
          onChange={(e) => onClassChange(e.target.value)}
          className="text-sm"
        >
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </Select>
        <Select
          value={sectionFilter}
          onChange={(e) => onSectionChange(e.target.value)}
          className="text-sm"
        >
          {SECTIONS.map((s) => <option key={s}>{s}</option>)}
        </Select>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium">STATUS:</span>
        {STATUS_OPTIONS.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusChange(s)}
            className={`text-xs px-3 py-1.5 font-medium transition-colors ${
              statusFilter === s
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300"
            }`}
          >
            {s}
          </Button>
        ))}
      </div>

      {/* Fee head + sort */}
      <div className="flex gap-2 flex-wrap">
        <Select
          value={feeHeadFilter}
          onChange={(e) => onFeeHeadChange(e.target.value)}
          className="text-sm"
        >
          {FEE_HEADS.map((f) => <option key={f}>{f}</option>)}
        </Select>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">SORT:</span>
          <Select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-sm"
          >
            {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </div>
      </div>
    </div>
  );
}