import { useState } from "react";
import {
  usePayrolls,
  useCreatePayroll,
  useUpdatePayroll,
  useDeletePayroll,
} from "../hooks/usePayrolls";
import { PayrollTable } from "../components/PayrollTable";
import { PayrollForm } from "../components/PayrollForm";
import { CreatePayrollInput } from "../types/payroll.types";

export default function PayrollPage() {
  const { data: payrolls = [], isLoading } = usePayrolls();
  const createPayroll = useCreatePayroll();
  const updatePayroll = useUpdatePayroll();
  const deletePayroll = useDeletePayroll();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this payroll record?")) {
      deletePayroll.mutate(id);
    }
  };

  const handleFormSubmit = (values: CreatePayrollInput) => {
    if (editingId) {
      updatePayroll.mutate({ id: editingId, input: values });
    } else {
      createPayroll.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingPayroll = payrolls.find((p) => p.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Payroll</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
          }}
        >
          New Payroll
        </button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <PayrollForm
            defaultValues={editingPayroll}
            onSubmit={handleFormSubmit}
            loading={createPayroll.isLoading || updatePayroll.isLoading}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <PayrollTable
          payrolls={payrolls}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
