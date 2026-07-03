import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Lock, Sparkles, ArrowRight,
  Calendar, Users, BookOpen, UserPlus, Banknote,
  RotateCcw, PartyPopper,
} from 'lucide-react';
import type { SetupItem } from '../hooks/useSetupStatus';

// ── Step metadata ─────────────────────────────────────────────────────────────

const STEP_META: Record<string, {
  Icon: React.ElementType;
  bg: string;
  text: string;
  ring: string;
  actionLabel: string;
}> = {
  settings: {
    Icon: Calendar,
    bg: 'bg-indigo-100', text: 'text-indigo-600', ring: 'ring-indigo-300',
    actionLabel: 'Go to Settings',
  },
  staff: {
    Icon: Users,
    bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-300',
    actionLabel: 'Go to Staff Management',
  },
  classes: {
    Icon: BookOpen,
    bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-300',
    actionLabel: 'Go to Classes',
  },
  students: {
    Icon: UserPlus,
    bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-300',
    actionLabel: 'Go to Students',
  },
  fees: {
    Icon: Banknote,
    bg: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-300',
    actionLabel: 'Go to Fee Management',
  },
};

const FALLBACK_META = STEP_META['settings'];

// ── Celebration screen ─────────────────────────────────────────────────────────

function SetupComplete({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center gap-6 py-20 px-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
        className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center"
      >
        <PartyPopper className="w-12 h-12 text-green-600" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h2 className="text-2xl font-bold text-gray-900">School Setup Complete!</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Your school is now fully configured. All modules are unlocked and ready to use.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <button
          onClick={onDismiss}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Go to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Step list item (left sidebar) ─────────────────────────────────────────────

function StepListItem({
  item, index, isActive, isPast, isLocked,
}: {
  item: SetupItem;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isLocked: boolean;
}) {
  return (
    <div
      className={[
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
        isActive
          ? 'bg-indigo-50 border border-indigo-200'
          : isPast
            ? 'opacity-70'
            : 'opacity-40',
      ].join(' ')}
    >
      {/* Status bubble */}
      <div className={[
        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-extrabold',
        item.done
          ? 'bg-green-100 text-green-600'
          : isActive
            ? 'bg-indigo-600 text-white'
            : isLocked
              ? 'bg-gray-100 text-gray-400'
              : 'bg-gray-200 text-gray-500',
      ].join(' ')}>
        {item.done
          ? <CheckCircle2 className="w-4 h-4" />
          : isLocked
            ? <Lock className="w-3 h-3" />
            : index + 1}
      </div>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <p className={[
          'text-xs font-semibold leading-tight truncate',
          item.done ? 'text-green-700 line-through' : isActive ? 'text-indigo-700' : 'text-gray-500',
        ].join(' ')}>
          {item.label}
        </p>
        {item.done && (
          <p className="text-[10px] text-green-500 font-medium leading-tight">Complete</p>
        )}
      </div>
    </div>
  );
}

// ── Sub-item checklist row ────────────────────────────────────────────────────

function SubItemRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={[
      'flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all',
      done
        ? 'bg-green-50 border-green-200'
        : 'bg-gray-50 border-gray-200',
    ].join(' ')}>
      {done
        ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
        : <Circle className="w-4 h-4 text-gray-300 shrink-0" />}
      <span className={[
        'text-sm',
        done ? 'text-green-700 font-medium' : 'text-gray-500',
      ].join(' ')}>
        {label}
      </span>
      {done && (
        <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
          Done
        </span>
      )}
    </div>
  );
}

// ── Main SetupWizard component ────────────────────────────────────────────────

interface Props {
  items: SetupItem[];
  isLoading: boolean;
  onDismiss: () => void;
}

export function SetupWizard({ items, isLoading, onDismiss }: Props) {
  const navigate = useNavigate();

  const sorted = [...items].sort((a, b) => a.order - b.order);
  const allDone = sorted.every(i => i.done);
  const doneCount = sorted.filter(i => i.done).length;
  const totalCount = sorted.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Current step = first incomplete
  const currentStep = sorted.find(i => !i.done) ?? null;
  const currentIndex = currentStep ? sorted.findIndex(i => i.id === currentStep.id) : sorted.length;

  const handleNavigate = useCallback((item: SetupItem) => {
    navigate(item.route, {
      state: { ...item.routeState, fromWizard: true, stepId: item.id },
    });
  }, [navigate]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Checking setup status…</p>
      </div>
    );
  }

  // ── All done ──
  if (allDone) {
    return <SetupComplete onDismiss={onDismiss} />;
  }

  if (!currentStep) return null;
  const meta = STEP_META[currentStep.id] ?? FALLBACK_META;
  const { Icon } = meta;

  const nextStep = sorted[currentIndex + 1] ?? null;
  const allSubDone = currentStep.subItems.length > 0 && currentStep.subItems.every(s => s.done);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Card shell ── */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        {/* ════════════════════════════════════════
            HEADER — gradient + progress
        ════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight">School Setup Guide</h2>
                <p className="text-[11px] text-indigo-200 leading-tight">
                  Complete all steps to unlock all modules
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {doneCount} / {totalCount} done
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-indigo-200">
              <span>Step {Math.min(currentIndex + 1, totalCount)} of {totalCount}</span>
              <span className="font-bold text-white">{progressPct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            BODY — step list + step detail
        ════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row min-h-[420px]">

          {/* ── Left: step list ── */}
          <div className="w-full md:w-56 lg:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
            {/* Mobile: horizontal scrollable pills */}
            <div className="flex md:hidden gap-2 p-3 overflow-x-auto">
              {sorted.map((item, idx) => {
                const isPast = idx < currentIndex;
                const isAct  = item.id === currentStep.id;
                return (
                  <div
                    key={item.id}
                    className={[
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-semibold shrink-0 border',
                      item.done
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : isAct
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-400 border-gray-200',
                    ].join(' ')}
                  >
                    {item.done
                      ? <CheckCircle2 className="w-3 h-3" />
                      : isPast || isAct
                        ? <span>{idx + 1}</span>
                        : <Lock className="w-3 h-3" />}
                    {item.done ? item.label : isAct ? item.label : `Step ${idx + 1}`}
                  </div>
                );
              })}
            </div>

            {/* Desktop: vertical step list */}
            <div className="hidden md:flex flex-col gap-1 p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 px-1">
                Setup Steps
              </p>
              {sorted.map((item, idx) => (
                <StepListItem
                  key={item.id}
                  item={item}
                  index={idx}
                  isActive={item.id === currentStep.id}
                  isPast={idx < currentIndex}
                  isLocked={idx > currentIndex}
                />
              ))}
            </div>
          </div>

          {/* ── Right: step detail ── */}
          <div className="flex-1 p-5 sm:p-7 flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-5 flex-1"
              >
                {/* Step header */}
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.text}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                        Step {currentIndex + 1} of {totalCount}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {currentStep.label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {currentStep.description}
                    </p>
                  </div>
                </div>

                {/* Sub-items checklist */}
                {currentStep.subItems.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Required items
                    </p>
                    {currentStep.subItems.map(sub => (
                      <SubItemRow key={sub.id} label={sub.label} done={sub.done} />
                    ))}
                  </div>
                )}

                {/* Status message */}
                <div className={[
                  'flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-medium',
                  allSubDone
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-indigo-50 border border-indigo-100 text-indigo-600',
                ].join(' ')}>
                  {allSubDone
                    ? <><CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" /> All items in this step are complete! Click <strong>Next</strong> to continue.</>
                    : <><Icon className="w-4 h-4 shrink-0" /> Click the button below to go to {currentStep.label} and complete the required items.</>}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Action button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => handleNavigate(currentStep)}
                    className={[
                      'flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all',
                      allSubDone
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : `bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200`,
                    ].join(' ')}
                  >
                    {meta.actionLabel}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {allSubDone && nextStep && (
                    <button
                      onClick={() => handleNavigate(nextStep)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                      Next: {nextStep.label}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {allSubDone && !nextStep && (
                    <button
                      onClick={onDismiss}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-green-600 text-white text-sm font-bold shadow-sm hover:bg-green-700 active:scale-95 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Finish Setup
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════ */}
        <div className="border-t border-gray-100 px-5 sm:px-7 py-3 flex items-center justify-between bg-gray-50/50">
          <button
            onClick={onDismiss}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip setup for now
          </button>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Refresh status
          </button>
        </div>
      </div>
    </div>
  );
}
