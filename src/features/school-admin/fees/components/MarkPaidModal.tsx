import { useState } from "react";

interface MarkPaidModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (paidAt: string) => void;
}

export const MarkPaidModal = ({
  open,
  onClose,
  onSubmit,
}: MarkPaidModalProps) => {
  const [paidAt, setPaidAt] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded shadow p-6 w-80">
        <h2 className="font-semibold mb-4">Mark Fee as Paid</h2>
        <input
          type="date"
          value={paidAt}
          onChange={(e) => setPaidAt(e.target.value)}
          className="border rounded px-2 py-1 w-full mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => onSubmit(paidAt)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
