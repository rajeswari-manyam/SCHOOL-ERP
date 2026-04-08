import { useState } from "react";

interface SuspendModalProps {
  schoolId: string;
  schoolName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const SuspendModal = ({ schoolId, schoolName, onConfirm, onClose }: SuspendModalProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-bold mb-4">Suspend School</h3>
        <p className="mb-4">Are you sure you want to suspend <strong>{schoolName}</strong>?</p>
        <div className="mb-4">
          <label>Reason (optional)</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input w-full"
            rows={3}
            placeholder="Enter reason for suspension"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Suspend</button>
        </div>
      </div>
    </div>
  );
};
