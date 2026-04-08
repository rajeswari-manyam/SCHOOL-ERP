import { useState } from "react";
import { useTimetable, useCreateTimetableEntry, useUpdateTimetableEntry, useDeleteTimetableEntry } from "../hooks/useTimetable";
import { TimetableTable } from "../components/TimetableTable";
import { TimetableForm } from "../components/TimetableForm";
import type{ CreateTimetableEntryInput } from "../types/timetable.types";

export default function TimetablePage() {
  const { data: entries = [], isLoading } = useTimetable();
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

  const handleFormSubmit = (values: CreateTimetableEntryInput) => {
    if (editingId) {
      updateEntry.mutate({ id: editingId, input: values });
    } else {
      createEntry.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingEntry = entries.find((e) => e.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Timetable</h1>
        <button className="btn btn-primary" onClick={() => { setFormOpen(true); setEditingId(null); }}>Add Entry</button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <TimetableForm
            defaultValues={editingEntry}
            onSubmit={handleFormSubmit}
            loading={createEntry.isPending || updateEntry.isPending}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TimetableTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
