import { useState } from "react";
import {
  useReports,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
} from "../hooks/useReports";
import { ReportTable } from "../components/ReportTable";
import { ReportForm } from "../components/ReportForm";
import { ReportCreateInput } from "../types/reports.types";

export default function ReportsPage() {
  const { data: reports = [], isLoading } = useReports();
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

  const handleFormSubmit = (values: ReportCreateInput) => {
    if (editingId) {
      updateReport.mutate({ id: editingId, input: values });
    } else {
      createReport.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingReport = reports.find((r) => r.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Reports</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
          }}
        >
          New Report
        </button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <ReportForm
            defaultValues={editingReport}
            onSubmit={handleFormSubmit}
            loading={createReport.isLoading || updateReport.isLoading}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ReportTable
          reports={reports}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
