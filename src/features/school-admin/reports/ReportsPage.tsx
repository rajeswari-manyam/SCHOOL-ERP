import {
  useReports,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
} from "./hooks/useReports";
import { useState } from "react";
import { ReportTable } from "./components/ReportTable";
import { ReportForm } from "./components/ReportForm";

const ReportsPage = () => {
  const { data, isLoading } = useReports();
  const createReport = useCreateReport();
  const updateReport = useUpdateReport();
  const deleteReport = useDeleteReport();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this report?")) {
      deleteReport.mutate(id);
    }
  };

  const handleFormSubmit = (values: any) => {
    if (editingId) {
      updateReport.mutate({ id: editingId, input: values });
    } else {
      createReport.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Reports</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
          }}
        >
          Add Report
        </button>
      </div>
      <ReportTable
        reports={data?.records ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Report" : "Add Report"}
            </h2>
            <ReportForm
              defaultValues={
                editingId
                  ? data?.records.find((r: any) => r.id === editingId)
                  : {}
              }
              onSubmit={handleFormSubmit}
              loading={createReport.isLoading || updateReport.isLoading}
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

export default ReportsPage;
