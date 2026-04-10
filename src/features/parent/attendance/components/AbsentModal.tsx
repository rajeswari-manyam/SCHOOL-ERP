import { X, Phone, MessageCircle, Check, ClipboardList } from "lucide-react"

interface AbsentModalProps {
    data: {
        day: number
        label: string
        time: string
    }
    onClose: () => void
}

export default function AbsentModal({ data, onClose }: AbsentModalProps) {
    const timeline = [
        {
            time: "8:47 AM — Attendance marked",
            detail: "Teacher: Priya Reddy ma'am • WhatsApp",
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
            icon: ClipboardList,
        },
        {
            time: `${data.time} — WhatsApp alert sent to you`,
            detail: "+91 98765 43210 (Father — Suresh Kumar)",
            iconBg: "bg-[#006C49]",
            iconColor: "text-white",
            icon: MessageCircle,
        },
        {
            time: "8:53 AM — Alert delivered",
            detail: "WhatsApp delivery confirmed.",
            iconBg: "bg-green-50",
            iconColor: "text-green-600",
            icon: Check,
            isDelivered: true,
        },
    ]

    return (
        <>
            {/* Backdrop — only below navbar */}
            <div
                className="fixed top-[64px] left-0 right-0 bottom-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal container — centered below navbar */}
            <div className="fixed top-[64px] left-0 right-0 bottom-0 z-50 flex items-center justify-center px-4 py-8">
                <div
                className="bg-white border border-gray-200 rounded-2xl w-full max-w-[480px] shadow-2xl flex flex-col transition-all duration-200 hover:border-[#3525CD] hover:shadow-md hover:-translate-y-1"
                    style={{ maxHeight: "calc(100vh - 64px - 64px)" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sticky Header */}
                    <div className="px-6 pt-5 pb-4 flex-shrink-0 border-b border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-[16px] font-semibold text-gray-900">
                                    Absent — {data.day} April 2025
                                </h3>
                                <p className="text-[13px] text-gray-400 mt-0.5">
                                    Ravi Kumar | Class 10A
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                            >
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Body */}
                    <div className="overflow-y-auto flex-1">

                        {/* Timeline Section */}
                        <div className="px-6 pt-5 pb-2">
                            <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase mb-4">
                                What happened
                            </p>

                            <div className="space-y-0">
                                {timeline.map((t, i) => (
                                    <div key={i} className="flex gap-3 items-start relative pb-4">
                                        <div className="relative flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full ${t.iconBg} flex items-center justify-center flex-shrink-0 z-10`}>
                                                <t.icon size={14} className={t.iconColor} strokeWidth={2.5} />
                                            </div>
                                            {i < timeline.length - 1 && (
                                                <div className="absolute top-8 left-1/2 w-px h-full bg-gray-200 -translate-x-1/2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pt-1 pb-2">
                                            <p className="text-[13px] font-semibold text-gray-900 leading-tight">
                                                {t.time}
                                            </p>
                                            <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                                                {t.detail}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp Message Preview — chat bubble style */}
                        <div className="mx-6 mb-5">
                            <p className="text-[10px] font-semibold tracking-wider text-[#006C49] uppercase mb-3">
                                Message you received
                            </p>

                            {/* Bubble with tail */}
                            <div className="relative bg-[#E8F5E9] rounded-2xl rounded-bl-none p-4">

                                {/* Bubble tail */}
                                <div
                                    className="absolute -bottom-2 left-0 w-4 h-4 bg-[#E8F5E9]"
                                    style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
                                />

                                <p className="text-[13px] text-gray-800 leading-relaxed">
                                    Dear Parent, Ravi Kumar was absent from Class 10A today ({data.label}). Please contact school if any queries. — Hanamkonda Public School
                                </p>

                                {/* Timestamp */}
                                <p className="text-[11px] text-gray-400 text-right mt-3 flex items-center justify-end gap-1">
                                    8:53 AM — Delivered
                                    <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
                                        <path d="M1 5.5L4.5 9L10 1" stroke="#4FC3F7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 5.5L11.5 9L17 1" stroke="#4FC3F7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </p>
                            </div>
                        </div>

                        {/* Action Section */}
                        <div className="px-6 pb-6 mt-2">
                            <p className="text-[13px] text-gray-500 text-center mb-4">
                                Need to inform school about this absence?
                            </p>

                            <div className="flex gap-3 mb-3">
                                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 bg-white rounded-lg py-2.5 text-[13px] font-medium text-indigo-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
                                    <Phone size={14} />
                                    Call School
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] rounded-lg py-2.5 text-[13px] font-semibold text-white hover:bg-[#128C7E] transition-all shadow-sm">
                                    <MessageCircle size={14} />
                                    WhatsApp
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full border border-gray-200 rounded-lg py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}