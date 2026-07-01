import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Users, BookOpen, Layers, BookText, UserPlus,
  CheckCircle2, X, Sparkles, Loader2, ArrowRight,
} from 'lucide-react';
import type { SetupItem } from '../hooks/useSetupStatus';

const STEP_CFG: Record<string, {
  Icon: React.ElementType;
  bg: string;
  text: string;
}> = {
  'academic-config': { Icon: Calendar,  bg: 'bg-indigo-100', text: 'text-indigo-600' },
  'staff':           { Icon: Users,     bg: 'bg-purple-100',text: 'text-purple-600'},
  'classes':         { Icon: BookOpen,  bg: 'bg-blue-100',   text: 'text-blue-600'  },
  'sections':        { Icon: Layers,    bg: 'bg-teal-100',   text: 'text-teal-600'  },
  'subjects':        { Icon: BookText,  bg: 'bg-amber-100',  text: 'text-amber-600' },
  'students':        { Icon: UserPlus,  bg: 'bg-emerald-100',text: 'text-emerald-600'},
};

const FALLBACK_CFG = STEP_CFG['academic-config'];

interface Props {
  items: SetupItem[] | undefined;
  isLoading: boolean;
  onDismiss: () => void;
  currentStepId?: string;
  progressPct?: number;
  doneCount?: number;
  totalCount?: number;
}

export function SetupWizardBanner({
  items, isLoading, onDismiss, currentStepId,
  progressPct = 0, doneCount = 0, totalCount = 0,
}: Props) {
  const navigate = useNavigate();

  const handleNavigate = useCallback((item: SetupItem) => {
    navigate(item.route, { state: { fromWizard: true, stepId: item.id, ...item.routeState } });
  }, [navigate]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-indigo-100 shadow-sm overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #ffffff 55%, #eff6ff 100%)' }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">Quick Setup Guide</h3>
            <p className="text-[11px] text-gray-500">Complete these steps in order to set up your school</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {doneCount} / {totalCount} done
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

      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
        {items.map((item, idx) => {
          const cfg = STEP_CFG[item.id] ?? FALLBACK_CFG;
          const Icon = cfg.Icon;
          const isCurrent = item.id === currentStepId && !item.done;

          return (
            <div
              key={item.id}
              className={[
                'relative flex flex-col gap-2 p-3.5 rounded-xl border select-none transition-all duration-200',
                item.done
                  ? 'bg-white/40 border-gray-100 opacity-55'
                  : isCurrent
                    ? 'bg-white border-indigo-300 shadow-md ring-2 ring-indigo-200'
                    : 'bg-white/70 border-gray-100 hover:border-indigo-200',
              ].join(' ')}
            >
              <span className={[
                'absolute top-2 right-2 w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center',
                item.done ? 'bg-green-100 text-green-600' : isCurrent ? 'bg-indigo-200 text-indigo-700' : 'bg-indigo-100 text-indigo-500',
              ].join(' ')}>
                {idx + 1}
              </span>

              <div className={[
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                item.done ? 'bg-green-50 text-green-500' : `${cfg.bg} ${cfg.text}`,
              ].join(' ')}>
                {item.done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>

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

              {item.done && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                  <CheckCircle2 className="w-3 h-3" />
                  Done
                </div>
              )}

              {!item.done && (
                <button
                  onClick={() => handleNavigate(item)}
                  className={[
                    'mt-1 w-full inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold active:scale-95 transition-all shadow-sm',
                    isCurrent
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200',
                  ].join(' ')}
                >
                  Go to {item.label}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
