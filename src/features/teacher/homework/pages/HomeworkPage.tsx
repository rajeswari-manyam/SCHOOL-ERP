import { useState } from "react";
import { useHomework, useCreateHomework, useUpdateHomework, useDeleteHomework } from "../hooks/useHomework";
import { HomeworkTable } from "../components/HomeworkTable";
import { HomeworkForm } from "../components/HomeworkForm";
import type{ CreateHomeworkInput } from "../types/homework.types";

export default function HomeworkPage() {
  const { data: homework = [], isLoading } = useHomework();
  const createHomework = useCreateHomework();
  const updateHomework = useUpdateHomework();
  const deleteHomework = useDeleteHomework();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this homework?")) {
      deleteHomework.mutate(id);
    }
  };

  const handleFormSubmit = (values: CreateHomeworkInput) => {
    if (editingId) {
      updateHomework.mutate({ id: editingId, input: values });
    } else {
      createHomework.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingHomework = homework.find((h) => h.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Homework</h1>
        <button className="btn btn-primary" onClick={() => { setFormOpen(true); setEditingId(null); }}>New Homework</button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <HomeworkForm
            defaultValues={editingHomework}
            onSubmit={handleFormSubmit}
            loading={createHomework.isPending || updateHomework.isPending}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <HomeworkTable homework={homework} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
