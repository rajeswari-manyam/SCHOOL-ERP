import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, BookOpen, Users, UserPlus,
  CheckCircle2, X, Sparkles, Loader2,
} from 'lucide-react';
import type { SetupItem } from '../hooks/useSetupStatus';

// Keys must match the SetupItem.id values produced by useSetupStatus's buildItems().
const STEP_CFG: Record<string, {
  Icon: React.ElementType;
  bg: string;
  text: string;
}> = {
  'settings': { Icon: Calendar, bg: 'bg-indigo-100',  text: 'text-indigo-600'  },
  'staff':    { Icon: Users,    bg: 'bg-purple-100',  text: 'text-purple-600'  },
  'classes':  { Icon: BookOpen, bg: 'bg-blue-100',    text: 'text-blue-600'    },
  'students': { Icon: UserPlus, bg: 'bg-emerald-100', text: 'text-emerald-600' },
};

const FALLBACK_CFG = STEP_CFG['settings'];

interface Props {
  items: SetupItem[] | undefined;
  isLoading: boolean;
  onDismiss: () => void;
}

export function SetupSuggestions({ items, isLoading, onDismiss }: Props) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-4 flex items-center gap-3">
        <Loader2 className="w-4 h-4 animate-spin text-indigo-500 shrink-0" />
        <span className="text-sm text-gray-500">Checking setup status…</span>
      </div>
    );
  }

  if (!items) return null;

  const pendingItems = items.filter((i) => !i.done);
  if (pendingItems.length === 0) return null;

  const doneCount = items.length - pendingItems.length;
  const progressPct = Math.round((doneCount / items.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-indigo-100 shadow-sm overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 55%, #eff6ff 100%)' }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">Quick Guide</h3>
            <p className="text-[11px] text-gray-500">Complete these steps to unlock all features</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {doneCount} / {items.length} done
          </span>
          <button
            onClick={onDismiss}
            title="Dismiss"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="px-5 pb-3.5 flex items-center gap-2.5">
        <div className="flex-1 h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #6366f1, #3b82f6)' }}
          />
        </div>
        <span className="text-[10px] font-bold text-indigo-500 shrink-0">{progressPct}%</span>
      </div>

      {/* ── Step cards ── */}
      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        {items.map((item, idx) => {
          const cfg = STEP_CFG[item.id] ?? FALLBACK_CFG;
          const Icon = cfg.Icon;
          const isSecondary = item.order > 5;

          return (
            <div
              key={item.id}
              role={!item.done ? 'button' : undefined}
              tabIndex={!item.done ? 0 : undefined}
              onClick={!item.done ? () => navigate(item.route) : undefined}
              onKeyDown={!item.done ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(item.route); } } : undefined}
              className={[
                'relative flex flex-col gap-2 p-3.5 rounded-xl border',
                !item.done ? 'cursor-pointer select-none' : 'select-none',
                item.done
                  ? 'bg-white/40 border-gray-100 opacity-55'
                  : isSecondary
                    ? 'bg-white/70 border-dashed border-indigo-200 hover:border-indigo-300 hover:shadow-md transition-all'
                    : 'bg-white/70 border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all',
              ].join(' ')}
            >
              {/* Step number badge */}
              <span className={[
                'absolute top-2 right-2 w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center',
                item.done ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-500',
              ].join(' ')}>
                {idx + 1}
              </span>

              {/* Secondary badge */}
              {isSecondary && !item.done && (
                <span className="absolute top-2 left-2 text-[8px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">
                  Bonus
                </span>
              )}

              {/* Icon */}
              <div className={[
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                item.done ? 'bg-green-50 text-green-500' : `${cfg.bg} ${cfg.text}`,
              ].join(' ')}>
                {item.done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <p className={[
                  'text-xs font-bold leading-tight',
                  item.done ? 'text-gray-400 line-through' : 'text-gray-900',
                ].join(' ')}>
                  {item.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
