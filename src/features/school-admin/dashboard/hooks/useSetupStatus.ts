import { useQuery } from '@tanstack/react-query';
import { getSetupStatus, type SetupStatusResponse } from '@/services/setup.api';

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

function buildItems(steps: SetupStatusResponse['steps']): SetupItem[] {
  return [
    {
      id: 'settings',
      label: 'Academic Configuration',
      description: 'Set up your academic year, holidays, departments, and leave policies before anything else.',
      route: '/schooladmin/settings',
      routeState: { openTab: 'academicConfig', fromWizard: true },
      done: steps.academicConfiguration,
      order: 1,
      subItems: [],
    },
    {
      id: 'staff',
      label: 'Add Staff',
      description: "Add your school's teaching and non-teaching staff members.",
      route: '/schooladmin/staff',
      done: steps.staff,
      order: 2,
      subItems: [],
    },
    {
      id: 'classes',
      label: 'Create Classes',
      description: 'Create classes, add sections under each class, and assign subjects.',
      route: '/schooladmin/classes',
      done: steps.classes,
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
  return useQuery({
    queryKey: ['setup-status'],
    queryFn: async (): Promise<SetupStatusResult> => {
      const res = await getSetupStatus();
      return {
        items: buildItems(res.steps),
        sidebar: res.sidebar,
        progress: res.progress,
        completedSteps: res.completedSteps,
        totalSteps: res.totalSteps,
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
