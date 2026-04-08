import { useState } from "react";
import {
  useReceipts,
  useCreateReceipt,
  useUpdateReceipt,
  useDeleteReceipt,
} from "../hooks/useReceipts";
import { ReceiptTable } from "../components/ReceiptTable";
import { ReceiptForm } from "../components/ReceiptForm";
import { CreateReceiptInput } from "../types/receipts.types";

export default function ReceiptsPage() {
  const { data: receipts = [], isLoading } = useReceipts();
  const createReceipt = useCreateReceipt();
  const updateReceipt = useUpdateReceipt();
  const deleteReceipt = useDeleteReceipt();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this receipt?")) {
      deleteReceipt.mutate(id);
    }
  };

  const handleFormSubmit = (values: CreateReceiptInput) => {
    if (editingId) {
      updateReceipt.mutate({ id: editingId, input: values });
    } else {
      createReceipt.mutate(values);
    }
    setFormOpen(false);
    setEditingId(null);
  };

  const editingReceipt = receipts.find((r) => r.id === editingId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
          }}
        >
          New Receipt
        </button>
      </div>
      {formOpen && (
        <div className="mb-6">
          <ReceiptForm
            defaultValues={editingReceipt}
            onSubmit={handleFormSubmit}
            loading={createReceipt.isLoading || updateReceipt.isLoading}
          />
        </div>
      )}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ReceiptTable
          receipts={receipts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
