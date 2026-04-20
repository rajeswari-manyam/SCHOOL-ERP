import { useState } from "react";
import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import typography from "@/styles/typography";

interface Props {
  onClose: () => void;
  studentName?: string;
  studentClass?: string;
  amountOverdue?: number;
  daysPastDue?: number;
  remindersSent?: number;
  fatherPhone?: string;
  motherPhone?: string;
}

export function SendFeeReminderModal({
  onClose,
  studentName = "Ravi Teja",
  studentClass = "Class 10A",
  amountOverdue = 8500,
  daysPastDue = 15,
  remindersSent = 3,
  fatherPhone = "+91 98765 43210",
  motherPhone = "+91 87654 32109",
}: Props) {
  const [sendToFather, setSendToFather] = useState(true);
  const [sendToMother, setSendToMother] = useState(false);

  const messagePreview = `Dear Parent, This is a reminder that ${studentName}'s fee of Rs.${amountOverdue.toLocaleString()} (Tuition — April 2025) is overdue by ${daysPastDue} days. Please pay at the school counter at the earliest. — Hanamkonda Public School`;

  const handleSend = () => {
    // handle send logic
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <Card className="relative z-10 w-[440px] max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="px-5 py-4 flex items-start justify-between border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Send Fee Reminder</h2>
            <p className={`${typography.body.small} text-slate-500 mt-0.5`}>
              {studentName} — {studentClass}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 mt-0.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-4 space-y-4">

          {/* Overdue summary pill */}
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <span className="bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
              Rs.{amountOverdue.toLocaleString()} overdue
            </span>
            <span className="text-slate-400 flex items-center">|</span>
            <span className="bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
              {daysPastDue} days past due
            </span>
            <span className="text-slate-400 flex items-center">|</span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {remindersSent} reminders already sent
            </span>
          </div>

          {/* Message Preview */}
          <div className="rounded-xl border border-green-200 bg-green-50 overflow-hidden">
            <div className="px-3 py-2 bg-green-100 border-b border-green-200">
              <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">
                Message Preview
              </span>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-slate-700 leading-relaxed">{messagePreview}</p>
              <p className="text-[10px] text-slate-400 text-right mt-2">10:45 AM</p>
            </div>
          </div>

          {/* Sending to */}
          <div>
            <label className={`${typography.body.small} font-semibold text-slate-400 uppercase tracking-widest mb-2 block`}>
              Sending to:
            </label>
            <div className="space-y-2">
              {/* Father */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToFather}
                  onChange={() => setSendToFather((v) => !v)}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span className="text-xs text-slate-700">
                  <span className="font-semibold">{fatherPhone}</span>
                  <span className="text-slate-400"> (Father — Suresh Kumar)</span>
                </span>
              </label>
              {/* Mother */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sendToMother}
                  onChange={() => setSendToMother((v) => !v)}
                  className="w-4 h-4 accent-green-600 rounded"
                />
                <span className="text-xs text-slate-700">
                  <span className="font-semibold">{motherPhone}</span>
                  <span className="text-slate-400"> (Mother) Also send to mother</span>
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 ${typography.body.small} font-semibold hover:bg-slate-50 transition-colors`}
            >
              Cancel
            </button>
            <Button
              onClick={handleSend}
              disabled={!sendToFather && !sendToMother}
              className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
              </svg>
              Send WhatsApp Reminder
            </Button>
          </div>

        </div>
      </Card>
    </div>
  );
}