import { useState } from "react";

interface Props {
  studentName: string;
  onClose: () => void;
  onConfirm: (date: string, time: string) => Promise<void>;
}

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50";

const ScheduleInterviewModal = ({ studentName, onClose, onConfirm }: Props) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if (!date || !time) return;
    setSaving(true);
    try {
      await onConfirm(date, time);
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
            <h2 className="text-base font-extrabold text-gray-900">Schedule Interview</h2>
            <p className="text-xs text-gray-400 mt-0.5">{studentName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Interview Date <span className="text-red-500">*</span></label>
            <input type="date" className={inputCls} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Interview Time <span className="text-red-500">*</span></label>
            <input type="time" className={inputCls} value={time} onChange={e => setTime(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!date || !time || saving}
            className="px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Confirm Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInterviewModal;