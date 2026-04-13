import type { NotificationPref } from "../types/profile.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import typography from "@/styles/typography";

const ICONS: Record<string, { icon: React.ReactNode; bg: string }> = {
  attendance: {
    bg: "#EFF4FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="18" rx="3" stroke="#3525CD" strokeWidth="1.6" />
        <path d="M16 2v4M8 2v4M3 10h18" stroke="#3525CD" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M8 14l2.5 2.5L16 13" stroke="#3525CD" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  fees: {
    bg: "#FFF4ED",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="#F97316" strokeWidth="1.6" />
        <path d="M3 10h18" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7 15h4M7 12.5h6" stroke="#F97316" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  homework: {
    bg: "#F0FDF4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 4a2 2 0 012-2h8a2 2 0 012 2v16l-6-3-6 3V4z" stroke="#16A34A" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 8h6M9 11h4" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  browser: {
    bg: "#F5F3FF",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="14" rx="3" stroke="#6366F1" strokeWidth="1.6" />
        <path d="M3 9h18" stroke="#6366F1" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="7" cy="6.5" r="1" fill="#6366F1" />
        <circle cx="10.5" cy="6.5" r="1" fill="#6366F1" />
      </svg>
    ),
  },
};

// Small message/bell icon for subtitle prefix
function SubIcon({ color }: { color: string }) {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ display: "block", flexShrink: 0 }}>
      <path
        d="M2 5a2 2 0 012-2h8a2 2 0 012 2v5a2 2 0 01-2 2H5l-3 2V5z"
        stroke={color}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props {
  notifications: NotificationPref[];
  onToggle: (id: string) => void;
  onSave: () => void;
}

export function NotificationPreferences({ notifications, onToggle, onSave }: Props) {
  return (
    <Card className="rounded-2xl border border-[#E8EBF2] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#3525CD] hover:border-1 transition-all duration-300">
      <CardContent className="p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <span className={typography.form.label + " text-[#0B1C30]"}>
            Notification Preferences
          </span>
          <Button
            onClick={onSave}
            className="bg-white border border-[#E8EBF2] text-[#0B1C30] text-[13px] font-semibold px-5 py-2 rounded-xl hover:bg-[#F4F6FB] shadow-none transition-all duration-200"
          >
            Save Preferences
          </Button>
        </div>

        {/* LIST */}
        <div className="flex flex-col divide-y divide-[#F1F4F9]">
          {notifications.map((n) => {
            const meta = ICONS[n.id] ?? { bg: "#F4F6FB", icon: null };
            return (
              <div
                key={n.id}
                className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  {/* Icon badge */}
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: meta.bg }}
                  >
                    {meta.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <p className={typography.form.label + " text-[#0B1C30]"}>
                      {n.label}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <SubIcon color="#006C49" />
                    <p className="text-[11px] text-[#006C49]/80 leading-snug">
  {n.description}
</p>
                    </div>
                  </div>
                </div>

                {/* TOGGLE — 44×24px matching Figma */}
                <button
                  onClick={() => onToggle(n.id)}
                  className={`
                    w-[44px] h-[24px] rounded-full relative flex-shrink-0
                    transition-all duration-200
                    ${n.enabled ? "bg-[#006C49]" : "bg-[#E8EBF2]"}
                  `}
                >
                  <span
                    className={`
                      absolute top-[4px] w-[16px] h-[16px] rounded-full bg-white shadow-sm
                      transition-all duration-200
                      ${n.enabled ? "left-[24px]" : "left-[4px]"}
                    `}
                  />
                </button>
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}