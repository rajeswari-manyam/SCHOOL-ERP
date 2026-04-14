import {
  useFees,
  useCreateFee,
  useUpdateFee,
  useDeleteFee,
} from "./hooks/useFees";
import { useState } from "react";
import { FeeTable } from "./components/FeeTable";
import { FeeForm } from "./components/FeeForm";
import toast from "react-hot-toast";
const FeesPage = () => {
  const { data } = useFees();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();
  const deleteFee = useDeleteFee();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

const handleDelete = (id: string) => {
  if (window.confirm("Delete this fee record?")) {
    deleteFee.mutate(id, {
      onSuccess: () => toast.success("Fee deleted"),
    });
  }
};
const handleFormSubmit = (values: any) => {
  if (editingId) {
    updateFee.mutate({ id: editingId, input: values }, {
      onSuccess: () => toast.success("Fee updated"),
    });
  } else {
    createFee.mutate(values, {
      onSuccess: () => toast.success("Fee created"),
    });
  }
  setFormOpen(false);
  setEditingId(null);
};

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Fees</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
          }}
        >
          Add Fee
        </button>
      </div>
      <FeeTable
    fees={data ?? []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Fee" : "Add Fee"}
            </h2>
            <FeeForm
              defaultValues={
                editingId
                  ? data?.find((f: any) => f.id === editingId)
                  : {}
              }
              onSubmit={handleFormSubmit}
             loading={createFee.isPending || updateFee.isPending}
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

export default FeesPage;
