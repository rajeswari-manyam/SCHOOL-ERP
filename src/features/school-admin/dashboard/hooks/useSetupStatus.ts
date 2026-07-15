import { useQuery } from '@tanstack/react-query';
import { getSetupStatus, type SetupStatusResponse } from '@/services/setup.api';
import { getCarryForwardModules, type CarryForwardModule } from '@/services/academicYear.api';
import { useUIStore } from '@/store/uiStore';

export interface SetupSubItem {
  id: string;
  label: string;
  done: boolean;
}

export interface SetupItem {
  id: string;
  label: string;
  description: string;
  route: string;
  routeState?: { openTab?: string; fromWizard?: boolean; [key: string]: unknown };
  done: boolean;
  order: number;
  subItems: SetupSubItem[];
}

export interface WizardState {
  items: SetupItem[];
  currentStep: SetupItem | undefined;
  firstIncomplete: SetupItem | undefined;
  allDone: boolean;
  progressPct: number;
  doneCount: number;
}

export interface SetupStatusResult {
  items: SetupItem[];
  sidebar: SetupStatusResponse['sidebar'];
  progress: number;
  completedSteps: number;
  totalSteps: number;
}

// A step is satisfied via carry-forward only when EVERY module it depends on
// was actually part of that carry-forward run — e.g. "Create Classes" covers
// classes + sections + subjects, so carrying forward just "staff" must not
// mark it done. "students" has no entry here: carry-forward never copies
// enrollments, so that step always reflects the backend's real status.
const STEP_REQUIRED_MODULES: Record<string, CarryForwardModule[]> = {
  settings: ['departments'],
  staff:    ['staff'],
  classes:  ['classes', 'sections', 'subjects', 'subjectAssignments'],
};

function buildItems(steps: SetupStatusResponse['steps'], carriedModules: CarryForwardModule[]): SetupItem[] {
  const coveredByCarryForward = (stepId: string): boolean => {
    const required = STEP_REQUIRED_MODULES[stepId];
    return required ? required.every((m) => carriedModules.includes(m)) : false;
  };

  return [
    {
      id: 'settings',
      label: 'Academic Configuration',
      description: 'Set up your academic year, holidays, departments, and leave policies before anything else.',
      route: '/schooladmin/settings',
      routeState: { openTab: 'academicConfig', fromWizard: true },
      done: steps.academicConfiguration || coveredByCarryForward('settings'),
      order: 1,
      subItems: [],
    },
    {
      id: 'staff',
      label: 'Add Staff',
      description: "Add your school's teaching and non-teaching staff members.",
      route: '/schooladmin/staff',
      done: steps.staff || coveredByCarryForward('staff'),
      order: 2,
      subItems: [],
    },
    {
      id: 'classes',
      label: 'Create Classes',
      description: 'Create classes, add sections under each class, and assign subjects.',
      route: '/schooladmin/classes',
      done: steps.classes || coveredByCarryForward('classes'),
      order: 3,
      subItems: [],
    },
    {
      id: 'students',
      label: 'Add Students',
      description: 'Enroll students into their respective classes and sections.',
      route: '/schooladmin/students',
      done: steps.students,
      order: 4,
      subItems: [],
    },
  ];
}

export function useSetupStatus() {
  const academicYearId = useUIStore((s) => s.academicYearId);

  return useQuery({
    queryKey: ['setup-status', academicYearId],
    queryFn: async (): Promise<SetupStatusResult> => {
      const res = await getSetupStatus();
      const carriedModules = academicYearId ? getCarryForwardModules(academicYearId) : [];
      const items = buildItems(res.steps, carriedModules);
      const doneCount = items.filter((i) => i.done).length;

      return {
        items,
        sidebar: res.sidebar,
        progress: items.length > 0 ? Math.round((doneCount / items.length) * 100) : res.progress,
        completedSteps: doneCount,
        totalSteps: items.length,
      };
    },
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useWizardState(items: SetupItem[] | undefined): WizardState {
  if (!items || items.length === 0) {
    return { items: [], currentStep: undefined, firstIncomplete: undefined, allDone: false, progressPct: 0, doneCount: 0 };
  }

  const sorted = [...items].sort((a, b) => a.order - b.order);
  const firstIncomplete = sorted.find((i) => !i.done);
  const doneCount = sorted.filter((i) => i.done).length;
  const progressPct = Math.round((doneCount / sorted.length) * 100);

  return {
    items: sorted,
    currentStep: firstIncomplete,
    firstIncomplete,
    allDone: !firstIncomplete,
    progressPct,
    doneCount,
  };
}
