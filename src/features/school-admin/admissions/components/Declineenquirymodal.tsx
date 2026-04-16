import { useState } from "react";

const REASONS = [
  "Relocated to another city",
  "Age criteria not met",
  "Seats unavailable",
  "Parent withdrew application",
  "Fee structure not acceptable",
  "Other",
];

interface Props {
  studentName: string;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
}

const DeclineEnquiryModal = ({ studentName, onClose, onConfirm }: Props) => {
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);

  const reason = selected === "Other" ? custom : selected;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    setSaving(true);
    try {
      await onConfirm(reason.trim());
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Decline Enquiry</h2>
            <p className="text-xs text-gray-400 mt-0.5">{studentName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Select Reason</p>
          {REASONS.map(r => (
            <button
              key={r}
              onClick={() => setSelected(r)}
              className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                selected === r
                  ? "border-red-400 bg-red-50 text-red-700 font-semibold"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {r}
            </button>
          ))}
          {selected === "Other" && (
            <textarea
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200 bg-gray-50 resize-none"
              rows={2}
              placeholder="Enter custom reason..."
              value={custom}
              onChange={e => setCustom(e.target.value)}
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim() || saving}
            className="px-5 py-2.5 text-sm font-bold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Decline Enquiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineEnquiryModal;