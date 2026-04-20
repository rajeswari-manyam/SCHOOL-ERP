import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelLeaveModal = ({ open, onClose, onConfirm }: Props) => {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden"
          style={{ maxWidth: 400 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-500" strokeWidth={2} />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">Cancel Leave Application?</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              This action cannot be undone. Your pending leave application will be cancelled immediately.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Keep it
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelLeaveModal;
