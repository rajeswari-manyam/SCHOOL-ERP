import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus } from "lucide-react";
import SchoolFilterBar from "./components/SchoolFilterBar";
import SchoolTable from "./components/SchoolTable";
import Pagination from "../components/Pagination";
import { useSchools, useSchoolMutations } from "./hooks/useSchools";
import type { SchoolFilters } from "./types/school.types";
import AddNewSchoolModal from "./components/SchoolModal";
import { Button } from "@/components/ui/button";
const DEFAULT_FILTERS: SchoolFilters = {
  search: "",
  plan: "ALL",
  status: "ALL",
  city: "",
  page: 1,
  pageSize: 8,
};

// Static city list — in production, fetch from API
const CITIES = ["Hanamkonda", "Warangal", "Kazipet", "Khammam"];

const SchoolsPage = () => {
  const navigate = useNavigate();
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [filters, setFilters] = useState<SchoolFilters>(DEFAULT_FILTERS);

  const { data, isLoading } = useSchools(filters);
  const { importCsv } = useSchoolMutations();
const [openModal, setOpenModal] = useState(false);
  const patchFilters = (patch: Partial<SchoolFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importCsv.mutate(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">

     

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Schools
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {data?.total ?? 0} schools on platform
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Import CSV */}
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleCsvImport}
          />
          <Button
            onClick={() => csvInputRef.current?.click()}
            disabled={importCsv.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm disabled:opacity-60"
          >
            <Upload className="w-4 h-4" />
            {importCsv.isPending ? "Importing…" : "Import CSV"}
          </Button>

          {/* Add School */}
          <Button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add School
          </Button>
         
        </div>
      </div>

      {/* Filters */}
      <SchoolFilterBar
        filters={filters}
        cities={CITIES}
        onChange={patchFilters}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />



<AddNewSchoolModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSuccess={({ school, billing, admin }) => {
    console.log("New school payload:", { school, billing, admin });
    // POST to your API here

  }}
/>
      {/* Table */}
      <SchoolTable
        schools={data?.data ?? []}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {data && (
        <Pagination
          page={filters.page}
          total={data.total}
          pageSize={filters.pageSize}
          onChange={(p) => patchFilters({ page: p })}
          itemLabel="schools"
          showPageNumbers
        />
      )}
    </div>
  );
};

export default SchoolsPage;