import {
  useTimetable,
  useCreateTimetableEntry,
  useUpdateTimetableEntry,
  useDeleteTimetableEntry,
} from "./hooks/useTimetable";
import { useState } from "react";
import { TimetableTable } from "./components/TimetableTable";
import { TimetableForm } from "./components/TimetableForm";

const TimetablePage = () => {
  const { data, isLoading } = useTimetable();
  const createEntry = useCreateTimetableEntry();
  const updateEntry = useUpdateTimetableEntry();
  const deleteEntry = useDeleteTimetableEntry();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this timetable entry?")) {
      deleteEntry.mutate(id);
    }
  };

  const handleFormSubmit = (values: any) => {
    if (editingId) {
      updateEntry.mutate({ id: editingId, input: values });
    } else {
      createEntry.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Timetable</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
          }}
        >
          Add Entry
        </button>
      </div>
      <TimetableTable
        entries={data?.records ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Entry" : "Add Entry"}
            </h2>
            <TimetableForm
              defaultValues={
                editingId
                  ? data?.records.find((e: any) => e.id === editingId)
                  : {}
              }
              onSubmit={handleFormSubmit}
              loading={createEntry.isLoading || updateEntry.isLoading}
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
    </div>
  );
};

export default TimetablePage;
