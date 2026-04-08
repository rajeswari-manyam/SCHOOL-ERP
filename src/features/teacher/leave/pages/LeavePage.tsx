import { useState } from "react";
import { useLeaveRequests, useCreateLeaveRequest, useUpdateLeaveRequest, useDeleteLeaveRequest } from "../hooks/useLeave";
import { LeaveTable } from "../components/LeaveTable";
import { LeaveForm } from "../components/LeaveForm";
import { CreateLeaveRequestInput } from "../types/leave.types";

export default function LeavePage() {
  const { data: requests = [], isLoading } = useLeaveRequests();
  const createLeave = useCreateLeaveRequest();
  const updateLeave = useUpdateLeaveRequest();
  const deleteLeave = useDeleteLeaveRequest();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this leave request?")) {
      deleteLeave.mutate(id);
    }
  };

  const handleFormSubmit = (values: CreateLeaveRequestInput) => {
    if (editingId) {
      updateLeave.mutate({ id: editingId, input: values });
    } else {
      createLeave.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingRequest = requests.find((r) => r.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <button className="btn btn-primary" onClick={() => { setFormOpen(true); setEditingId(null); }}>New Leave Request</button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <LeaveForm
            defaultValues={editingRequest}
            onSubmit={handleFormSubmit}
            loading={createLeave.isLoading || updateLeave.isLoading}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <LeaveTable requests={requests} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
