
interface Props {
  whatsappNumber: string;
  onDismiss: () => void;
}

export function WhatsAppBanner({ whatsappNumber, onDismiss }: Props) {
  return (
    <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6">
      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white text-base">
        💬
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-indigo-800">
          Teachers mark attendance by sending WhatsApp to{" "}
          <span className="text-indigo-600 font-bold">{whatsappNumber}</span>
        </p>
        <p className="text-xs text-indigo-500 mt-0.5">
          Format: <span className="font-mono">7A Absent: Student Name1, Student Name2</span>
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss banner"
        className="text-indigo-300 hover:text-indigo-500 text-xl leading-none shrink-0 transition-colors"
      >
        ×
      </button>
    </div>
  );
}
