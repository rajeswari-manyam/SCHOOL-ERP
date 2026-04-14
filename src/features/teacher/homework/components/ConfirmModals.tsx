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
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onBack} />
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <h2 className="text-base font-extrabold text-gray-900">Confirm Homework Assignment</h2>
            <p className="text-xs text-gray-400 mt-0.5">Please review before assigning</p>
          </div>
          <div className="px-6 py-4 flex flex-col gap-3">
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
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Confirm & Assign
            </button>
          </div>
        </div>
      </div>
    </>
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
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <div>
              <p className="text-base font-extrabold text-gray-900">Delete Homework?</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                "<span className="font-semibold text-gray-600">{title}</span>" will be permanently deleted.
                This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="px-6 pb-5 flex flex-col gap-2">
            <button
              onClick={onConfirm}
              className="w-full h-10 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
            >
              Yes, Delete
            </button>
            <button
              onClick={onCancel}
              className="w-full h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
