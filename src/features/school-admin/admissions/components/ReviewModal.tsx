import { useUpdateApplicationStatus } from "../hooks/useAdmissions";
import { useState } from "react";

interface ReviewModalProps {
  open: boolean;
  applicationId: string;
  onClose: () => void;
}

export const ReviewModal = ({
  open,
  applicationId,
  onClose,
}: ReviewModalProps) => {
  const [remarks, setRemarks] = useState("");
  const { mutate } = useUpdateApplicationStatus();

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded shadow p-6 w-96">
        <h2 className="font-semibold mb-4">Review Application</h2>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks (optional)"
          className="border rounded px-2 py-1 w-full mb-4"
        />
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1" onClick={onClose}>
            Cancel
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => {
              mutate({ id: applicationId, status: "approved", remarks });
              onClose();
            }}
          >
            Approve
          </button>
          <button
            className="bg-red-600 text-white px-3 py-1 rounded"
            onClick={() => {
              mutate({ id: applicationId, status: "rejected", remarks });
              onClose();
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};
