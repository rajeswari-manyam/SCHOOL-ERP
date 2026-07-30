import { useState, useMemo } from "react";

import { toast } from "sonner";
import { Plus } from "lucide-react";
import SchoolFilterBar from "./components/SchoolFilterBar";
import SchoolTable from "./components/SchoolTable";
import Pagination from "../components/Pagination";
import { useSchools, useAllSchools, useSchoolMutations, useSchoolDetail } from "./hooks/useSchools";
import type { SchoolFilters } from "./types/school.types";
import AddNewSchoolModal from "./components/SchoolModal";
import SchoolDetailModal from "./components/SchoolDetailModal";
import { mapSchoolDetailToFormValues, buildSchoolUpdatePayload } from "./utils/school.utils";
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
  const [filters, setFilters] = useState<SchoolFilters>(DEFAULT_FILTERS);

  const { data, isLoading } = useSchools(filters);
  const { data: allSchools } = useAllSchools();
  const cities = useMemo(
    () => Array.from(new Set((allSchools ?? []).map((s) => s.city).filter(Boolean))).sort(),
    [allSchools]
  );
  const { createSchool, updateSchool } = useSchoolMutations();
  const [openModal, setOpenModal] = useState(false);
  const [viewSchoolId, setViewSchoolId] = useState<string | null>(null);
  const [editSchoolId, setEditSchoolId] = useState<string | null>(null);
  const { data: editDetail, isLoading: editLoading } = useSchoolDetail(editSchoolId ?? "");
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
        cities={cities}
        onChange={patchFilters}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />



<AddNewSchoolModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSubmit={(payload) =>
    new Promise<boolean>((resolve) => {
      createSchool.mutate(payload, {
        onSuccess: () => {
          toast.success(`${payload.school_name} has been added to the platform`);
          resolve(true);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : "Failed to register school");
          resolve(false);
        },
      });
    })
  }
/>
      {/* Table */}
      <SchoolTable
        schools={data?.data ?? []}
        isLoading={isLoading}
        onView={setViewSchoolId}
        onEdit={setEditSchoolId}
      />

      <SchoolDetailModal
        schoolId={viewSchoolId}
        onClose={() => setViewSchoolId(null)}
        onEdit={(id) => { setViewSchoolId(null); setEditSchoolId(id); }}
      />

      {editSchoolId && editDetail && (
        <AddNewSchoolModal
          key={editSchoolId}
          open
          mode="edit"
          onClose={() => setEditSchoolId(null)}
          initialValues={mapSchoolDetailToFormValues(editDetail)}
          existingPhotos={{ image: editDetail.image, logo: editDetail.logo, principalPhoto: editDetail.principalphoto }}
          onSubmit={(payload) =>
            new Promise<boolean>((resolve) => {
              updateSchool.mutate(
                { id: editSchoolId, payload: buildSchoolUpdatePayload(payload) },
                {
                  onSuccess: () => {
                    toast.success(`${payload.school_name} has been updated`);
                    resolve(true);
                  },
                  onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to update school");
                    resolve(false);
                  },
                }
              );
            })
          }
        />
      )}
      {editSchoolId && editLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <p className="text-sm font-medium text-white">Loading school details…</p>
        </div>
      )}

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