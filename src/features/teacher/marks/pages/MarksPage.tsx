import { useState } from "react";
import { useMarks, useCreateMarkEntry, useUpdateMarkEntry, useDeleteMarkEntry } from "../hooks/useMarks";
import { MarksTable } from "../components/MarksTable";
import { MarksForm } from "../components/MarksForm";
import type{ CreateMarkEntryInput } from "../types/marks.types";

export default function MarksPage() {
  const { data: marks = [], isLoading } = useMarks();
  const createMark = useCreateMarkEntry();
  const updateMark = useUpdateMarkEntry();
  const deleteMark = useDeleteMarkEntry();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this mark entry?")) {
      deleteMark.mutate(id);
    }
  };

  const handleFormSubmit = (values: CreateMarkEntryInput) => {
    if (editingId) {
      updateMark.mutate({ id: editingId, input: values });
    } else {
      createMark.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingMark = marks.find((m) => m.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Marks</h1>
        <button className="btn btn-primary" onClick={() => { setFormOpen(true); setEditingId(null); }}>New Mark Entry</button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <MarksForm
            defaultValues={editingMark}
            onSubmit={handleFormSubmit}
            loading={createMark.isPending || updateMark.isPending}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <MarksTable marks={marks} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
