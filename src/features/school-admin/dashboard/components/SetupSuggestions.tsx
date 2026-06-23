import { motion } from 'framer-motion';
import {
  Calendar, BookOpen, Users, UserPlus, Palmtree,
  CheckCircle2, ChevronRight, X, Sparkles, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { SetupItem } from '../hooks/useSetupStatus';

const STEP_CFG: Record<string, {
  Icon: React.ElementType;
  bg: string;
  text: string;
  activeBorder: string;
  activeRing: string;
  activeBg: string;
}> = {
  'academic-year': { Icon: Calendar,  bg: 'bg-indigo-100', text: 'text-indigo-600', activeBorder: 'border-indigo-300', activeRing: 'ring-indigo-200', activeBg: 'bg-indigo-50'  },
  'classes':       { Icon: BookOpen,  bg: 'bg-blue-100',   text: 'text-blue-600',   activeBorder: 'border-blue-300',   activeRing: 'ring-blue-200',   activeBg: 'bg-blue-50'    },
  'staff':         { Icon: Users,     bg: 'bg-purple-100', text: 'text-purple-600', activeBorder: 'border-purple-300', activeRing: 'ring-purple-200', activeBg: 'bg-purple-50'  },
  'admissions':    { Icon: UserPlus,  bg: 'bg-emerald-100',text: 'text-emerald-600',activeBorder: 'border-emerald-300',activeRing: 'ring-emerald-200',activeBg: 'bg-emerald-50' },
  'holidays':      { Icon: Palmtree,  bg: 'bg-orange-100', text: 'text-orange-600', activeBorder: 'border-orange-300', activeRing: 'ring-orange-200', activeBg: 'bg-orange-50'  },
};

const FALLBACK_CFG = STEP_CFG['academic-year'];

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
  const nextIdx = items.findIndex((i) => !i.done);

  const handleGo = (item: SetupItem) => {
    if (item.done) return;
    onDismiss();
    navigate(item.route, item.routeState ? { state: item.routeState } : undefined);
  };

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
            <h3 className="text-sm font-bold text-gray-900 leading-snug">Complete Your School Setup</h3>
            <p className="text-[11px] text-gray-500">Follow these steps to unlock all features</p>
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
          const isNext = idx === nextIdx;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleGo(item)}
              disabled={item.done}
              className={[
                'group relative flex flex-col gap-2 p-3.5 rounded-xl border text-left transition-all duration-200',
                item.done
                  ? 'bg-white/40 border-gray-100 opacity-55 cursor-default'
                  : isNext
                    ? `${cfg.activeBg} ${cfg.activeBorder} shadow-sm hover:shadow-md ring-1 ${cfg.activeRing} cursor-pointer`
                    : 'bg-white/70 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm cursor-pointer',
              ].join(' ')}
            >
              <span className={[
                'absolute top-2 right-2 w-5 h-5 rounded-full text-[9px] font-extrabold flex items-center justify-center',
                item.done
                  ? 'bg-green-100 text-green-600'
                  : isNext
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-400',
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

              {!item.done && (
                <div className={[
                  'flex items-center gap-0.5 text-[10px] font-bold transition-all',
                  isNext ? `${cfg.text}` : 'text-gray-300 group-hover:text-gray-500',
                ].join(' ')}>
                  {isNext ? 'Set up now' : 'Set up'}
                  <ChevronRight className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
