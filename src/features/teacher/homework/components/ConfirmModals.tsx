import { Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

// ── Confirm Assign Modal (380px) ──────────────────────────────────────────
interface ConfirmAssignProps {
  open: boolean;
  title: string;
  subject: string;
  className: string;
  section: string;
  dueDate: string;
  notifyWhatsApp: boolean;
  totalStudents?: number;
  onConfirm: () => void;
  onBack: () => void;
}

export const ConfirmAssignModal = ({
  open, title, subject, className, section, dueDate, notifyWhatsApp,
  totalStudents = 42, onConfirm, onBack,
}: ConfirmAssignProps) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onBack}
      title="Confirm Homework Assignment"
      description="Please review before assigning"
      size="sm"
      footer={null}
    >
      <div className="flex flex-col gap-3">
        {[
          { label: "Title",    value: title },
          { label: "Subject",  value: subject },
          { label: "Class",    value: `${className} – ${section}` },
          { label: "Due Date", value: dueDate },
          { label: "Students", value: `${totalStudents} students` },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
            <span className="font-semibold text-gray-800">{value}</span>
          </div>
        ))}
        {notifyWhatsApp && (
          <div className="flex items-center gap-2 mt-1 px-3 py-2.5 bg-[#dcfce7] border border-[#bbf7d0] rounded-xl">
            <span className="text-[#25d366] text-base">💬</span>
            <p className="text-xs font-semibold text-[#166534]">
              WhatsApp notification will be sent to {totalStudents} parents
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 mt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="ghost"
          size="sm"
        >
          ← Go Back
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          Confirm & Assign
        </Button>
      </div>
    </Modal>
  );
};

// ── Delete Confirm Modal ───────────────────────────────────────────────────
interface DeleteConfirmProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal = ({ open, title, onConfirm, onCancel }: DeleteConfirmProps) => {
  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Delete Homework?"
      size="sm"
      footer={null}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <Trash2 size={20} className="text-red-500" />
        </div>
        <div>
          <p className="text-base font-extrabold text-gray-900">Delete Homework?</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            "<span className="font-semibold text-gray-600">{title}</span>" will be permanently deleted.
            This action cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-6">
        <Button
          type="button"
          onClick={onConfirm}
          variant="destructive"
          size="sm"
          className="w-full"
        >
          Yes, Delete
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
