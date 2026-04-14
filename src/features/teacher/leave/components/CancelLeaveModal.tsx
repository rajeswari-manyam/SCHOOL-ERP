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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
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
