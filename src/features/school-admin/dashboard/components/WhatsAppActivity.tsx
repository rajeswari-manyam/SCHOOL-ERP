import { motion } from "framer-motion";
import {
  MessageSquare,
  Camera,
  Megaphone,
  Bell,
} from "lucide-react";

import type { WhatsAppActivity } from "../types";

const typeConfig = {
  alert: {
    icon: MessageSquare,
    bg: "bg-green-500",
  },
  fee: {
    icon: Camera,
    bg: "bg-green-500",
  },
  broadcast: {
    icon: Megaphone,
    bg: "bg-green-500",
  },
  staff: {
    icon: Bell,
    bg: "bg-green-300",
  },
};

interface WhatsAppActivityFeedProps {
  activities: WhatsAppActivity[];
}

export function WhatsAppActivityFeed({
  activities,
}: WhatsAppActivityFeedProps) {
  return (
    <div className="bg-[#f5f6f8] rounded-[32px] p-5 sm:p-6 md:p-7 shadow-sm min-h-[420px]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 leading-tight">
          Recent WhatsApp Activity
        </h2>

        <div className="flex items-center gap-2 bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-gray-200" />

        <div className="flex flex-col gap-5">
          {activities.map((a, i) => {
            const cfg = typeConfig[a.type];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 relative"
              >
                {/* Icon */}
                <div
                  className={`
                    relative z-10
                    w-9 h-9 sm:w-10 sm:h-10
                    rounded-full
                    flex items-center justify-center
                    ${cfg.bg}
                    text-white
                    shadow-sm
                  `}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-gray-800 leading-snug line-clamp-2">
                    {a.message}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">
                    {a.time}
                    {a.delivered && ` — ${a.delivered}`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}