import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type StaffImportModalProps = {
  open: boolean;
  onClose: () => void;
};

export const StaffImportModal = ({ open, onClose }: StaffImportModalProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogTitle>Import Staff CSV</DialogTitle>
      <div className="my-4">CSV import coming soon.</div>
      <button className="btn" onClick={onClose}>
        Close
      </button>
    </DialogContent>
  </Dialog>
);
