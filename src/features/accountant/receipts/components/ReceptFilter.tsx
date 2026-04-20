import { useState } from "react";
import { Search, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const classes = ["All Classes", "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
const modes = ["All Modes", "CASH", "UPI", "CHEQUE"];

export const ReceiptFilters = () => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedMode, setSelectedMode] = useState("All Modes");

  return (
    <div className="flex items-center gap-3 flex-wrap bg-white p-4 rounded-lg border border-gray-200">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by receipt no. or student name..."
          className="w-full pl-9 pr-3 h-9 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
        />
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white">
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="mm/dd/yyyy"
          className="border-none outline-none text-xs bg-transparent w-20"
        />
        <span className="text-gray-400">—</span>
        <input
          type="text"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="mm/dd/yyyy"
          className="border-none outline-none text-xs bg-transparent w-20"
        />
      </div>

      {/* Class Dropdown */}
      <div className="relative">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          {classes.map((c) => (
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
          className="h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
        >
          {modes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Search Button */}
      <Button
        size="sm"
        className="h-9 px-4 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
      >
        Search
      </Button>
    </div>
  );
};