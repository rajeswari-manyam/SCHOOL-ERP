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
          <div
            style={{ backgroundColor: '#FFFBEB' }}
            className="flex flex-col gap-2.5 rounded-2xl border border-amber-200 px-4 py-3 sm:flex-row sm:items-center sm:gap-3"
          >

            {/* ── Top row on mobile: icon + text + dismiss ── */}
            <div className="flex items-start gap-2.5 sm:contents">

              {/* Icon */}
              <AlertTriangle
                size={16}
                style={{ color: '#92400E' }}
                className="mt-0.5 shrink-0 sm:mt-0"
              />

              {/* Message — grows to fill */}
              <p className="flex-1 text-xs font-medium leading-snug sm:text-sm" style={{ color: '#92400E' }}>
                <span className="font-semibold">
                  {classes.length} {classes.length === 1 ? 'class' : 'classes'}
                </span>{' '}
                {classes.length === 1 ? "hasn't" : "haven't"} marked attendance yet:{' '}
                <span className="font-semibold">
                  {classes.join(', ')}
                </span>
              </p>

              {/* Dismiss */}
              <button
                onClick={() => setDismissed(true)}
                aria-label="Dismiss alert"
                style={{ color: '#92400E' }}
                className="shrink-0 rounded-lg p-0.5 opacity-60 transition-colors hover:opacity-100 sm:ml-1"
              >
                <X size={15} />
              </button>
            </div>

            {/* ── Action button ── */}
            <button
              onClick={onSendReminder}
              disabled={sending}
              aria-label={sending ? 'Sending reminders' : 'Send WhatsApp reminders'}
              className={cn(
                'flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                'sm:w-auto sm:rounded-lg sm:py-1.5',
                sending && 'cursor-not-allowed opacity-60',
              )}
              style={{ backgroundColor: '#F59E0B', color: '#ffffff' }}
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