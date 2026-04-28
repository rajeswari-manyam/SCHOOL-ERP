import type { NotificationPref } from "../types/profile.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import typography from "@/styles/typography";
import { CalendarCheck, CreditCard, BookMarked, Monitor, MessageCircle } from "lucide-react";

const ICONS: { [key: string]: { icon: React.ReactNode; bg: string } } = {
  attendance: {
    bg: "#EFF4FF",
    icon: <CalendarCheck size={20} strokeWidth={1.6} color="#3525CD" />,
  },
  fees: {
    bg: "#FFF4ED",
    icon: <CreditCard size={20} strokeWidth={1.6} color="#F97316" />,
  },
  homework: {
    bg: "#F0FDF4",
    icon: <BookMarked size={20} strokeWidth={1.6} color="#16A34A" />,
  },
  browser: {
    bg: "#F5F3FF",
    icon: <Monitor size={20} strokeWidth={1.6} color="#6366F1" />,
  },
};

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
                      <MessageCircle size={11} strokeWidth={1.3} color="#006C49" style={{ flexShrink: 0 }} />
                      <p className="text-[11px] text-[#006C49]/80 leading-snug">
                        {n.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TOGGLE */}
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