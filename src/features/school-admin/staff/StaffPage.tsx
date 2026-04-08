import {
  useStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "./hooks/useStaff";
import { useState } from "react";
import { StaffTable } from "./components/StaffTable";
import { StaffForm } from "./components/StaffForm";
import { StaffImportModal } from "./components/StaffImportModal";

const StaffPage = () => {
  const { data, isLoading } = useStaff();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this staff member?")) {
      deleteStaff.mutate(id);
    }
  };

  const handleFormSubmit = (values: any) => {
    if (editingId) {
      updateStaff.mutate({ id: editingId, input: values });
    } else {
      createStaff.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Staff</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setFormOpen(true);
              setEditingId(null);
            }}
          >
            Add Staff
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => setImportOpen(true)}
          >
            Import CSV
          </button>
        </div>
      </div>
      <StaffTable
        staff={data?.records ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Staff" : "Add Staff"}
            </h2>
            <StaffForm
              defaultValues={
                editingId
                  ? data?.records.find((s: any) => s.id === editingId)
                  : {}
              }
              onSubmit={handleFormSubmit}
              loading={createStaff.isLoading || updateStaff.isLoading}
            />
            <button
              className="mt-4 px-3 py-1"
              onClick={() => {
                setFormOpen(false);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <StaffImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </div>
  );
};

export default StaffPage;
