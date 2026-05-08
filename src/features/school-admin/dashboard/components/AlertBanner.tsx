import { useState } from 'react';
import { AlertTriangle, X, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../../utils/cn';

interface AlertBannerProps {
  classes: string[];
  onSendReminder?: () => void;
  sending?: boolean;
}

export function AlertBanner({ classes, onSendReminder, sending }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -12, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="flex flex-col gap-2.5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.08] px-4 py-3 text-amber-300 sm:flex-row sm:items-center sm:gap-3">

            {/* ── Top row on mobile: icon + text + dismiss ── */}
            <div className="flex items-start gap-2.5 sm:contents">

              {/* Icon */}
              <AlertTriangle
                size={16}
                className="mt-0.5 shrink-0 text-amber-400 sm:mt-0"
              />

              {/* Message — grows to fill */}
              <p className="flex-1 text-xs font-medium leading-snug text-amber-300 sm:text-sm">
                <span className="font-semibold text-amber-200">
                  {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                </span>{' '}
                {classes.length === 1 ? "hasn't" : "haven't"} marked attendance yet:{' '}
                <span className="font-semibold text-amber-200">
                  {classes.join(', ')}
                </span>
              </p>

              {/* Dismiss — top-right on mobile, far right on desktop */}
              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss alert"
                className="shrink-0 rounded-lg p-0.5 text-amber-400/60 transition-colors hover:text-amber-300 sm:ml-1"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Action button — full width on mobile, auto on desktop ── */}
            <button
              onClick={onSendReminder}
              disabled={sending}
              aria-label={sending ? 'Sending reminders' : 'Send WhatsApp reminders'}
              className={cn(
                'flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                'bg-amber-500 text-amber-950 hover:bg-amber-400 active:scale-[0.98]',
                'sm:w-auto sm:rounded-lg sm:py-1.5',
                sending && 'cursor-not-allowed opacity-60',
              )}
            >
              {sending ? (
                <>
                  <Loader2 size={12} className="animate-spin shrink-0" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <MessageCircle size={12} className="shrink-0" />
                  {/* Short label on mobile, full on sm+ */}
                  <span className="sm:hidden">Send Reminders</span>
                  <span className="hidden sm:inline">Send WhatsApp Reminders</span>
                </>
              )}
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}