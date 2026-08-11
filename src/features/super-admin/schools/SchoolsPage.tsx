import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Plus } from "lucide-react";
import SchoolFilterBar from "./components/SchoolFilterBar";
import SchoolTable from "./components/SchoolTable";
import Pagination from "../components/Pagination";
import { useSchools, useAllSchools } from "./hooks/useSchools";
import type { SchoolFilters } from "./types/school.types";
import SchoolDetailModal from "./components/SchoolDetailModal";
import { Button } from "@/components/ui/button";
const DEFAULT_FILTERS: SchoolFilters = {
  search: "",
  plan: "ALL",
  status: "ALL",
  city: "",
  page: 1,
  pageSize: 8,
};

const SchoolsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SchoolFilters>(DEFAULT_FILTERS);

  const { data, isLoading } = useSchools(filters);
  const { data: allSchools } = useAllSchools();
  const cities = useMemo(
    () => Array.from(new Set((allSchools ?? []).map((s) => s.city).filter(Boolean))).sort(),
    [allSchools]
  );
  const [viewSchoolId, setViewSchoolId] = useState<string | null>(null);
  const patchFilters = (patch: Partial<SchoolFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="flex flex-col gap-6 min-h-full">

     

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
            Schools
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {data?.total ?? 0} schools on platform
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Add School */}
          <Button
            onClick={() => navigate("/superadmin/schools/add")}
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
        cities={cities}
        onChange={patchFilters}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* Table */}
      <SchoolTable
        schools={data?.data ?? []}
        isLoading={isLoading}
        onView={setViewSchoolId}
        onEdit={(id) => navigate(`/superadmin/schools/edit/${id}`)}
      />

      <SchoolDetailModal
        schoolId={viewSchoolId}
        onClose={() => setViewSchoolId(null)}
        onEdit={(id) => { setViewSchoolId(null); navigate(`/superadmin/schools/edit/${id}`); }}
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