import { useState } from 'react';
import { AlertTriangle, X, MessageCircle } from 'lucide-react';
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
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 text-amber-300">
            <AlertTriangle size={16} className="flex-shrink-0 text-amber-400" />
            <p className="text-sm font-medium flex-1">
              {classes.length} classes haven't marked attendance yet:{' '}
              <span className="font-semibold text-amber-200">{classes.join(', ')}</span>
            </p>
            <button
              onClick={onSendReminder}
              disabled={sending}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                'bg-amber-500 text-amber-950 hover:bg-amber-400 active:scale-95',
                sending && 'opacity-60 cursor-not-allowed'
              )}
            >
              <MessageCircle size={12} />
              {sending ? 'Sending…' : 'Send WhatsApp Reminders'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-400/60 hover:text-amber-300 transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
