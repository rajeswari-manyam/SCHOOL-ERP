import type { AlertBanner } from "../types/sa-dashboard.types";
import { useSendWAReminders } from "../hooks/useSADashboard";

interface AlertBannerStripProps {
  banner: AlertBanner;
  onDismiss: () => void;
}

const AlertBannerStrip = ({ banner, onDismiss }: AlertBannerStripProps) => {
  const { mutate, isPending } = useSendWAReminders();

  if (!banner.count) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <p className="flex-1 text-sm font-semibold text-amber-700">
        {banner.count} {banner.count === 1 ? "class hasn't" : "classes haven't"} marked attendance yet:{" "}
        <span className="font-bold">{banner.unmmarkedClasses.join(", ")}</span>
      </p>
      <button
        onClick={() => mutate(banner.unmmarkedClasses)}
        disabled={isPending}
        className="flex-shrink-0 px-4 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send WhatsApp Reminders"}
      </button>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
};

export default AlertBannerStrip;
