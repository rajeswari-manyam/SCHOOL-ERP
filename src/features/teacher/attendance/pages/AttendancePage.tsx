import { useState } from "react";
import { useAttendanceRecords, useMarkAttendance, useUpdateAttendance, useDeleteAttendance } from "../hooks/useAttendance";
import { AttendanceTable } from "../components/AttendanceTable";
import { AttendanceForm } from "../components/AttendanceForm";
import type{ MarkAttendanceInput } from "../types/attendance.types";

export default function AttendancePage() {
  const { data: records = [], isLoading } = useAttendanceRecords();
  const markAttendance = useMarkAttendance();
  const updateAttendance = useUpdateAttendance();
  const deleteAttendance = useDeleteAttendance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this attendance record?")) {
      deleteAttendance.mutate(id);
    }
  };

  const handleFormSubmit = (values: MarkAttendanceInput) => {
    if (editingId) {
      updateAttendance.mutate({ id: editingId, input: values });
    } else {
      markAttendance.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingRecord = records.find((r) => r.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <button className="btn btn-primary" onClick={() => { setFormOpen(true); setEditingId(null); }}>Mark Attendance</button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <AttendanceForm
            defaultValues={editingRecord}
            onSubmit={handleFormSubmit}
            loading={markAttendance.isPending || updateAttendance.isPending}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <AttendanceTable records={records} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
