// teacher/attendance/components/EditAttendanceModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useUpdateStudentAttendance } from "../hooks/useAttendance";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface EditAttendanceTarget {
  studentId: string;
  studentName: string;
  rollNo: string;
  date: string;
  currentStatus: "present" | "absent" | "late";
}

interface EditAttendanceModalProps {
  target: EditAttendanceTarget | null;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { label: "Present", value: "present" },
  { label: "Absent",  value: "absent"  },
  { label: "Late",    value: "late"    },
];

const EditAttendanceModal = ({ target, onClose }: EditAttendanceModalProps) => {
  const { mutate, isPending } = useUpdateStudentAttendance();
  const [status, setStatus] = useState(target?.currentStatus ?? "present");
  const [remarks, setRemarks] = useState("");

  if (!target) return null;

  const handleSubmit = () => {
    mutate(
      { studentId: target.studentId, date: target.date, status, remarks: remarks.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(`Attendance updated to ${STATUS_OPTIONS.find((o) => o.value === status)?.label}.`);
          onClose();
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : "Failed to update attendance.");
        },
      }
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Edit Attendance</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {target.studentName} · Roll No. {target.rollNo}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-lg text-gray-400 hover:text-gray-600" onClick={onClose}>
              <X size={18} className="text-current" />
            </Button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <FormField label="Date">
              <p className="text-sm font-medium text-gray-700">{target.date}</p>
            </FormField>

            <FormField label="Status *">
              <Select
                options={STATUS_OPTIONS}
                value={status}
                onValueChange={(v) => setStatus(v as EditAttendanceTarget["currentStatus"])}
              />
            </FormField>

            <FormField label="Remarks">
              <Textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                placeholder="Optional note about this correction…"
              />
            </FormField>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <Button variant="ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || status === target.currentStatus}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAttendanceModal;
