import { X, Phone, MessageCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { AbsentModalProps } from "../types/attendance.types"
import { useAttendanceStore } from "../store/attedance.store"

export default function AbsentModal({ data, onClose }: AbsentModalProps) {
  const selectedRecord   = useAttendanceStore((s) => s.selectedRecord)
  const isLoadingRecord  = useAttendanceStore((s) => s.isLoadingRecord)
  const recordError      = useAttendanceStore((s) => s.recordError)

  // Prefer live record details; fall back to what the caller passed in
  const studentName  = selectedRecord?.studentName  ?? "Student"
  const className    = selectedRecord?.className    ?? ""
  const section      = selectedRecord?.section      ?? ""
  const reason       = selectedRecord?.reason       ?? null
  const updatedAt    = selectedRecord?.updatedAt    ?? null
  const createdAt    = selectedRecord?.createdAt    ?? null

  const formattedTime = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : data.time

  const timeline = [
    {
      time: formattedTime(createdAt),
      title: "Attendance marked",
      sub: reason ? `Reason: ${reason}` : "Marked absent by teacher",
    },
    {
      time: formattedTime(updatedAt ?? createdAt),
      title: "WhatsApp alert sent to you",
      sub: "Parent notification dispatched",
    },
    {
      time: formattedTime(updatedAt ?? createdAt),
      title: "Alert delivered",
      sub: "WhatsApp delivery confirmed.",
      last: true,
    },
  ]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-[64px] inset-0 z-40 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <div className="fixed top-[64px] inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          className="bg-white rounded-2xl w-full max-w-[420px] shadow-xl overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 64px - 32px)" }}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: "spring", duration: 0.35 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex justify-between items-start shrink-0">
            <div>
              <p className="text-[15px] font-semibold text-gray-900">
                Absent — {data.label}
              </p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {isLoadingRecord
                  ? "Loading details…"
                  : `${studentName}${className ? ` | Class ${className}${section ? section : ""}` : ""}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={13} />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 min-h-0">
            {/* Loading state */}
            {isLoadingRecord && (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 size={20} className="animate-spin text-indigo-500" />
                <p className="text-[12px] text-gray-400">Fetching details…</p>
              </div>
            )}

            {/* Error state */}
            {!isLoadingRecord && recordError && (
              <div className="mx-5 mt-5 p-3 rounded-lg bg-red-50 border border-red-100">
                <p className="text-[12px] text-red-600">{recordError}</p>
              </div>
            )}

            {/* Content */}
            {!isLoadingRecord && (
              <>
                {/* Timeline */}
                <div className="px-5 pt-4 pb-3">
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 mb-4">
                    What happened
                  </p>
                  {timeline.map((t, i) => (
                    <motion.div
                      key={i}
                      className="flex gap-3"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.08 }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shrink-0" />
                        {!t.last && (
                          <div className="w-px flex-1 min-h-[24px] mt-1 bg-gray-100" />
                        )}
                      </div>
                      <div className={!t.last ? "pb-4" : ""}>
                        <p className="text-[13px] font-semibold text-gray-900">
                          {t.time} — {t.title}
                        </p>
                        <p className="text-[12px] text-gray-400">{t.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Notification bubble */}
                <div className="mx-5 mb-4 rounded-xl border border-green-100 bg-green-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-green-100">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-green-600">
                      Message you received
                    </p>
                  </div>
                  <div className="p-3">
                    <div className="bg-white rounded-[0_10px_10px_10px] border border-green-50 p-3 inline-block w-full">
                      <p className="text-[12.5px] text-gray-800 leading-relaxed mb-1.5">
                        Dear Parent, {studentName} was absent from Class{" "}
                        {className}
                        {section} today ({data.label}). Please contact school if
                        you have any queries.
                      </p>
                      <p className="text-[11px] text-gray-400 text-right">
                        {data.time} ·{" "}
                        <span className="text-green-500">✓✓ Delivered</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="px-5 pb-4">
                  <p className="text-[12px] text-gray-400 text-center mb-2.5">
                    Need to inform school about this absence?
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      <Phone size={13} />
                      Call School
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] rounded-lg py-2.5 text-[13px] font-medium text-white hover:brightness-105 transition-all">
                      <MessageCircle size={14} strokeWidth={1.8} />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pb-5 pt-3 text-center border-t border-gray-100 shrink-0">
            <button
              onClick={onClose}
              className="text-[13px] text-gray-400 hover:underline"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}