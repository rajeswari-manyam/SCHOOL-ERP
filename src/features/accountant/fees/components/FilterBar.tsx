import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const classes = ["All Classes", "1A", "1B", "2A", "2B", "3A", "3B", "4A", "4B", "5A", "5B", "6A", "6B", "7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"];
const modes = ["All Modes", "CASH", "UPI", "CHEQUE"];

export const FilterBar = () => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("2025-04-01");
  const [dateTo, setDateTo] = useState("2025-04-07");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedMode, setSelectedMode] = useState("All Modes");

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by receipt no. or student..."
          className="w-full pl-9 pr-3 h-9 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white whitespace-nowrap">
        <span>📅</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border-none outline-none text-xs bg-transparent"
        />
        <span className="text-gray-400">—</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border-none outline-none text-xs bg-transparent"
        />
      </div>

      {/* All Classes */}
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        {classes.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* All Modes */}
      <select
        value={selectedMode}
        onChange={(e) => setSelectedMode(e.target.value)}
        className="h-9 px-3 rounded-lg border border-gray-200 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        {modes.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      {/* Search Button */}
      <Button
        size="sm"
        className="h-9 px-5 text-xs bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
      >
        Search
      </Button>
    </div>
  );
};