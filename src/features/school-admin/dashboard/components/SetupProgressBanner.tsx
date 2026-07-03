import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, X, ChevronRight } from 'lucide-react';
import { useSetupStatus } from '../hooks/useSetupStatus';
import { useUIStore } from '@/store/uiStore';
import type { SetupItem } from '../hooks/useSetupStatus';

// Map route → step id (only the 4 setup steps)
const ROUTE_TO_STEP: Record<string, string> = {
  '/schooladmin/settings':  'settings',
  '/schooladmin/staff':     'staff',
  '/schooladmin/classes':   'classes',
  '/schooladmin/students':  'students',
};

export function SetupProgressBanner() {
  const location = useLocation();
  const navigate = useNavigate();
  const wizardDismissed = useUIStore((s) => s.wizardDismissed);
  const setWizardDismissed = useUIStore((s) => s.setWizardDismissed);

  const { data: setupData, isLoading } = useSetupStatus();

  if (isLoading || !setupData || wizardDismissed) return null;

  const { items } = setupData;
  const allDone = items.every((i) => i.done);
  if (allDone) {
    setWizardDismissed(true);
    return null;
  }

  const stepId = ROUTE_TO_STEP[location.pathname];
  if (!stepId) return null;

  const sorted = [...items].sort((a, b) => a.order - b.order);
  const currentIndex = sorted.findIndex((i) => i.id === stepId);
  if (currentIndex === -1) return null;

  const step = sorted[currentIndex];
  const nextStep: SetupItem | null = sorted[currentIndex + 1] ?? null;
  const prevDone = currentIndex === 0 || sorted.slice(0, currentIndex).every((i) => i.done);
  const doneCount = sorted.filter((i) => i.done).length;
  const progressPct = Math.round((doneCount / sorted.length) * 100);

  // Don't show banner if this step is locked (prior steps not done)
  if (!prevDone && !step.done) return null;

  const handleNext = () => {
    if (nextStep) {
      navigate(nextStep.route, {
        state: { ...(nextStep.routeState ?? {}), fromWizard: true, stepId: nextStep.id },
      });
    } else {
      navigate('/schooladmin/dashboard');
    }
  };

  return (
    <div className={[
      'relative mb-4 rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3',
      step.done
        ? 'bg-green-50 border-green-200'
        : 'bg-indigo-50 border-indigo-200',
    ].join(' ')}>

      {/* Dismiss */}
      <button
        type="button"
        onClick={() => setWizardDismissed(true)}
        className="absolute top-2.5 right-2.5 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
        aria-label="Dismiss setup banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Left: step info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Progress ring / done icon */}
        <div className={[
          'w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-extrabold',
          step.done ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600',
        ].join(' ')}>
          {step.done
            ? <CheckCircle2 className="w-5 h-5" />
            : <span>{currentIndex + 1}</span>}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Setup · Step {currentIndex + 1} of {sorted.length}
            </span>
            {step.done && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Done
              </span>
            )}
          </div>
          <p className={[
            'text-sm font-semibold leading-tight truncate',
            step.done ? 'text-green-800' : 'text-indigo-800',
          ].join(' ')}>
            {step.label}
          </p>
        </div>
      </div>

      {/* Centre: progress bar */}
      <div className="hidden sm:flex flex-col gap-1 w-36 shrink-0">
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>{doneCount}/{sorted.length} steps</span>
          <span className="font-bold text-gray-600">{progressPct}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Right: breadcrumb trail + Next button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mini breadcrumb: prev step → current → next */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] text-gray-400">
          {sorted.map((s, idx) => (
            <span key={s.id} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
              <span className={[
                'font-semibold',
                s.id === stepId ? (step.done ? 'text-green-700' : 'text-indigo-600') : s.done ? 'text-green-500' : 'text-gray-300',
              ].join(' ')}>
                {s.label}
              </span>
            </span>
          ))}
        </div>

        <button
          onClick={handleNext}
          className={[
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm whitespace-nowrap',
            step.done
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50',
          ].join(' ')}
        >
          {nextStep ? `Next: ${nextStep.label}` : 'Finish Setup'}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
