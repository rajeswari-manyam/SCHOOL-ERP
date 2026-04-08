import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "./hooks/useStudents";
import { useState } from "react";
import { StudentTable } from "./components/StudentTable";
import { StudentForm } from "./components/StudentForm";
import { StudentImportModal } from "./components/StudentImportModal";

const StudentsPage = () => {
  const { data, isLoading } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this student?")) {
      deleteStudent.mutate(id);
    }
  };

  const handleFormSubmit = (values: any) => {
    if (editingId) {
      updateStudent.mutate({ id: editingId, input: values });
    } else {
      createStudent.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Students</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setFormOpen(true);
              setEditingId(null);
            }}
          >
            Add Student
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded"
            onClick={() => setImportOpen(true)}
          >
            Import CSV
          </button>
        </div>
      </div>
      <StudentTable
        students={data?.records ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Student" : "Add Student"}
            </h2>
            <StudentForm
              defaultValues={
                editingId
                  ? data?.records.find((s: any) => s.id === editingId)
                  : {}
              }
              onSubmit={handleFormSubmit}
              loading={createStudent.isLoading || updateStudent.isLoading}
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
      <StudentImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </div>
  );
};

export default StudentsPage;
