import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SuspendModalProps {
  schoolId: string;
  schoolName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const SuspendModal = ({  schoolName, onConfirm, onClose }: SuspendModalProps) => {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-bold mb-4">Suspend School</h3>
        <p className="mb-4">Are you sure you want to suspend <strong>{schoolName}</strong>?</p>
        <div className="mb-4">
          <Label>Reason (optional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Enter reason for suspension"
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Suspend</Button>
        </div>
      </div>
    </div>
  );
};
