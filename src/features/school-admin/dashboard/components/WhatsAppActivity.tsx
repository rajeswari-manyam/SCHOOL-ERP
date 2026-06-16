import { motion } from 'framer-motion';
import { MessageSquare, Receipt, Megaphone, Bell } from 'lucide-react';
import type { WhatsAppActivity } from '../types';

const typeConfig: Record<string, { icon: typeof MessageSquare; bg: string; ring: string }> = {
  alert:     { icon: Bell,          bg: 'bg-emerald-500', ring: 'ring-emerald-200' },
  fee:       { icon: Receipt,       bg: 'bg-emerald-500', ring: 'ring-emerald-200' },
  broadcast: { icon: Megaphone,     bg: 'bg-indigo-500',  ring: 'ring-indigo-200'  },
  staff:     { icon: MessageSquare, bg: 'bg-emerald-400', ring: 'ring-emerald-100' },
};

interface WhatsAppActivityFeedProps {
  activities: WhatsAppActivity[];
}

export function WhatsAppActivityFeed({ activities }: WhatsAppActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          Recent WhatsApp Activity
        </h2>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-emerald-700 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-3 bottom-3 w-px bg-gray-100" />

        <div className="flex flex-col gap-5">
          {activities.map((a, i) => {
            const cfg  = typeConfig[a.type] ?? typeConfig.staff;
            const Icon = cfg.icon;

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.25 }}
                className="flex items-start gap-4 relative"
              >
                {/* Icon bubble */}
                <div className={`relative z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ring-4 ${cfg.bg} ${cfg.ring} text-white shadow-sm`}>
                  <Icon size={15} strokeWidth={2} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
                    {a.message}
                  </p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                    {a.time}{a.delivered && ` · ${a.delivered}`}
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
