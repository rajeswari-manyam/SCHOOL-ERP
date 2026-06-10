import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";

export type ReportFilterValues = {
  dateFrom: string;
  dateTo: string;
  classFilter: string;
  paymentMode: string;
  feeType: string;
};

interface ReportFiltersProps {
  onFilter: (filters: ReportFilterValues) => void;
}

const CLASSES = [
  { label: "All Classes", value: "all" },
  { label: "Class 1", value: "1" },
  { label: "Class 2", value: "2" },
  { label: "Class 3", value: "3" },
  { label: "Class 4", value: "4" },
  { label: "Class 5", value: "5" },
  { label: "Class 6", value: "6" },
  { label: "Class 7", value: "7" },
  { label: "Class 8", value: "8" },
  { label: "Class 9", value: "9" },
  { label: "Class 10", value: "10" },
];

const PAYMENT_MODES = [
  { label: "All Modes", value: "all" },
  { label: "Cash", value: "cash" },
  { label: "UPI", value: "upi" },
  { label: "Cheque", value: "cheque" },
];

const FEE_TYPES = [
  { label: "All", value: "all" },
  { label: "Tuition", value: "tuition" },
  { label: "Transport", value: "transport" },
  { label: "Library", value: "library" },
  { label: "Sports", value: "sports" },
  { label: "Lab", value: "lab" },
  { label: "Hostel", value: "hostel" },
  { label: "Other", value: "other" },
];

export const ReportFilters = ({ onFilter }: ReportFiltersProps) => {
  const [filters, setFilters] = useState<ReportFilterValues>({
    dateFrom: "",
    dateTo: "",
    classFilter: "all",
    paymentMode: "all",
    feeType: "all",
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleChange = (key: keyof ReportFilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilter(filters);
  };

  return (
    <Card className="border border-gray-200 overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:hidden">
          <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#3525CD]" />
            Filters
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[#3525CD]"
            onClick={() => setShowMobileFilters((prev) => !prev)}
          >
            {showMobileFilters ? "Hide" : "Show"}
          </Button>
        </div>

        <div className={`${showMobileFilters ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-start sm:items-end gap-3`}>
          <div className="w-full sm:w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">From Date</label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">To Date</label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Class</label>
            <Select
              options={CLASSES}
              value={filters.classFilter}
              onChange={(e) => handleChange("classFilter", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Payment Mode</label>
            <Select
              options={PAYMENT_MODES}
              value={filters.paymentMode}
              onChange={(e) => handleChange("paymentMode", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="w-full sm:w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Fee Type</label>
            <Select
              options={FEE_TYPES}
              value={filters.feeType}
              onChange={(e) => handleChange("feeType", e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <Button
            onClick={handleApply}
            className="h-9 px-5 bg-[#3525CD] hover:bg-[#2a1eb0] text-white text-sm gap-1.5 w-full sm:w-auto mt-2 sm:mt-0"
          >
            <Search className="w-4 h-4" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
