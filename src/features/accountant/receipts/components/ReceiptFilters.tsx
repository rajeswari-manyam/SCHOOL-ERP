import { useState } from "react";
import { Search, Calendar, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CLASSES = [
  "All Classes",
  "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B",
  "5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B",
  "9A", "9B", "10A", "10B",
];

const MODES = ["All Modes", "CASH", "UPI", "CHEQUE"];

interface ReceiptFiltersProps {
  onSearch?: (filters: {
    search: string;
    dateFrom: string;
    dateTo: string;
    selectedClass: string;
    selectedMode: string;
  }) => void;
}

export const ReceiptFilters = ({ onSearch }: ReceiptFiltersProps) => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSearch = () => {
    onSearch?.({ search, dateFrom, dateTo, selectedClass, selectedMode });
  };

  const activeFilterCount = [
    selectedClass !== "All Classes",
    selectedMode !== "All Modes",
    dateFrom !== "",
    dateTo !== "",
  ].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Mobile: Search + Filter Toggle */}
      <div className="flex items-center gap-2 sm:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search receipts..."
            className="w-full pl-9 pr-3 h-10 text-sm rounded-lg border border-gray-200 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD]"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="h-10 px-3 relative border-gray-200"
        >
          <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#3525CD] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile: Expandable Filter Panel */}
      {showMobileFilters && (
        <div className="sm:hidden bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Filters</span>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date Range</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-gray-200 bg-[#EFF4FF]">
                <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border-none outline-none text-xs w-full bg-transparent text-gray-600"
                />
              </div>
              <span className="text-gray-300 text-xs">—</span>
              <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-lg border border-gray-200 bg-[#EFF4FF]">
                <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border-none outline-none text-xs w-full bg-transparent text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Class */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Class</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD] appearance-none cursor-pointer"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Mode</label>
            <div className="relative">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 text-sm text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD] appearance-none cursor-pointer"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedClass("All Classes");
                setSelectedMode("All Modes");
                setDateFrom("");
                setDateTo("");
              }}
              className="flex-1 h-10 text-xs border-gray-200"
            >
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleSearch();
                setShowMobileFilters(false);
              }}
              className="flex-1 h-10 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Desktop: Full Filter Bar */}
      <div className="hidden sm:flex items-center gap-3 flex-wrap bg-white p-4 rounded-lg border border-gray-200">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by receipt no. or student name..."
            className="w-full pl-9 pr-3 h-9 text-xs rounded-lg border border-gray-200 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD]"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white">
          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border-none outline-none text-xs w-32 bg-transparent text-gray-600"
          />
          <span className="text-gray-300 text-xs">—</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border-none outline-none text-xs w-32 bg-transparent text-gray-600"
          />
        </div>

        {/* Class Dropdown */}
        <div className="relative">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-xs text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD] appearance-none cursor-pointer"
          >
            {CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Mode Dropdown */}
        <div className="relative">
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-xs text-gray-700 bg-[#EFF4FF] focus:outline-none focus:ring-2 focus:ring-[#3525CD]/30 focus:border-[#3525CD] appearance-none cursor-pointer"
          >
            {MODES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Search Button */}
        <Button
          size="sm"
          onClick={handleSearch}
          className="h-9 px-4 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
        >
          Search
        </Button>
      </div>
    </div>
  );
};