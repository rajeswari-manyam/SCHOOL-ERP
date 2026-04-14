import { useState } from "react";
import { useSendBroadcast } from "../hooks/useSADashboard";

interface SendBroadcastModalProps { open: boolean; onClose: () => void; }

const SendBroadcastModal = ({ open, onClose }: SendBroadcastModalProps) => {
  const [message, setMessage] = useState("");
  const [target, setTarget]   = useState("ALL_PARENTS");
  const { mutate, isPending }  = useSendBroadcast();

  if (!open) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    mutate({ message, target }, { onSuccess: () => { setMessage(""); onClose(); } });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Send Broadcast</h2>
              <p className="text-sm text-gray-400 mt-0.5">Send a WhatsApp message to all parents</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5">Target Audience</label>
              <div className="relative">
                <select value={target} onChange={(e) => setTarget(e.target.value)}
                  className="w-full h-10 px-3 pr-8 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer">
                  <option value="ALL_PARENTS">All Parents (342)</option>
                  <option value="CLASS_10">Class 10 Parents</option>
                  <option value="CLASS_9">Class 9 Parents</option>
                  <option value="FEE_DEFAULTERS">Fee Defaulters</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5">Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Type your broadcast message here..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/500</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
              <button
                onClick={handleSend}
                disabled={isPending || !message.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {isPending ? "Sending…" : "Send Broadcast"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SendBroadcastModal;
