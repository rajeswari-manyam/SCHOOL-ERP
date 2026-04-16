import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import typography from "@/styles/typography";

export const FilterBar = () => {
  return (
    <div className="bg-[#EFF4FF] rounded-lg px-4 py-3 space-y-3">

      {/* 🔍 Row 1: Search + Filters */}
      <div className="flex gap-2.5 items-center flex-wrap">
        <Input
          placeholder="Search student name or admission no..."
          className={`h-8 w-56 ${typography.body.xs}`}
        />

        <Select
          className={`h-10 w-32 ${typography.body.xs}`}
          placeholder="All Classes"
          options={[
            { label: "All Classes", value: "all" },
            { label: "9-C", value: "9c" },
            { label: "10-A", value: "10a" },
            { label: "12-B", value: "12b" },
            { label: "8-A", value: "8a" },
          ]}
        />

        <Select
          className={`h-10 w-32 ${typography.body.xs}`}
          placeholder="All Sections"
          options={[
            { label: "All Sections", value: "all" },
            { label: "Section A", value: "a" },
            { label: "Section B", value: "b" },
          ]}
        />

        <Select
          className={`h-10 w-36 ${typography.body.xs}`}
          placeholder="All Fee Heads"
          options={[
            { label: "All Fee Heads", value: "all" },
            { label: "Tuition", value: "tuition" },
            { label: "Library", value: "library" },
            { label: "Sports", value: "sports" },
            { label: "Bus Fee", value: "bus" },
          ]}
        />
      </div>

      {/* 🏷️ Row 2: Status Chips + Sort */}
      <div className="flex items-center flex-wrap gap-2">

        <span className={`text-[11px] text-gray-500 font-medium ${typography.body.xs}`}>
          DUE STATUS:
        </span>

        {/* Status Buttons */}
        <button className="px-3 py-1 text-xs rounded-full bg-[#3525CD] text-white">
          All
        </button>

        <button className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          3-Day Warning
        </button>

        <button className="px-3 py-1 text-xs rounded-full bg-[#FEE2E2]">
          Due Today
        </button>

        <button className="px-3 py-1 text-xs rounded-full bg-[#FECACA]">
          Overdue
        </button>

        <button className="px-3 py-1 text-xs rounded-full bg-[#7F1D1D]/80">
          Severely Overdue
        </button>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2 h-10">
          <span className={`text-[8px] text-gray-500 ${typography.body.xs}`}>
            Sort:
          </span>


          <Select
            className={`h-10 w-32 ${typography.body.xs}`}
            options={[
              { label: "Newest First", value: "new" },
              { label: "Oldest First", value: "old" },
            ]}
          />

          <Button variant="ghost" size="sm" className="text-xs">
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};