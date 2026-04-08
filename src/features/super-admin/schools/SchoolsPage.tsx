import { useState } from "react";
import { useSchools, useCreateSchool, useUpdateSchool, useSuspendSchool, useActivateSchool, useDeleteSchool } from "../hooks/useSchools";
import { SchoolTable, SchoolForm, SuspendModal } from "../components";
import { CreateSchoolInput, SchoolFilters } from "../types/school.types";

export default function SchoolsPage() {
  const [filters, setFilters] = useState<SchoolFilters>({});
  const { data: schools = [], isLoading } = useSchools(filters);
  const createSchool = useCreateSchool();
  const updateSchool = useUpdateSchool();
  const suspendSchool = useSuspendSchool();
  const activateSchool = useActivateSchool();
  const deleteSchool = useDeleteSchool();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [suspendModal, setSuspendModal] = useState<{ id: string; name: string } | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleView = (id: string) => {
    window.location.href = `/super-admin/schools/${id}`;
  };

  const handleSuspend = (id: string) => {
    const school = schools.find((s) => s.id === id);
    if (school) setSuspendModal({ id, name: school.name });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this school?")) {
      deleteSchool.mutate(id);
    }
  };

  const handleFormSubmit = (values: CreateSchoolInput) => {
    if (editingId) {
      updateSchool.mutate({ id: editingId, input: values });
    } else {
      createSchool.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingSchool = schools.find((s) => s.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schools</h1>
        <button className="btn btn-primary" onClick={() => { setFormOpen(true); setEditingId(null); }}>Add School</button>
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search schools..."
          className="input w-64"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
        />
        <select
          className="input w-40"
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: e.target.value as "active" | "suspended" | "pending" | undefined })}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {formOpen && (
        <div className="mb-6 bg-white p-4 rounded-lg">
          <SchoolForm
            defaultValues={editingSchool}
            onSubmit={handleFormSubmit}
            loading={createSchool.isLoading || updateSchool.isLoading}
          />
        </div>
      )}

      {isLoading ? <div>Loading...</div> : (
        <SchoolTable
          schools={schools}
          onEdit={handleEdit}
          onView={handleView}
          onSuspend={handleSuspend}
          onDelete={handleDelete}
        />
      )}

      {suspendModal && (
        <SuspendModal
          schoolId={suspendModal.id}
          schoolName={suspendModal.name}
          onConfirm={() => { suspendSchool.mutate(suspendModal.id); setSuspendModal(null); }}
          onClose={() => setSuspendModal(null)}
        />
      )}
    </div>
  );
}
