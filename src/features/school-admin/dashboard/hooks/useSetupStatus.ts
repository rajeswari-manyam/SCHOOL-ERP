import { useQuery } from '@tanstack/react-query';
import { getAllAcademicYears } from '@/services/academicYear.api';
import { getAllClasses } from '@/services/class.api';
import { getAllStaff } from '@/services/staff.api';
import { getAllHolidays } from '@/services/holidays.api';
import { getAllSections } from '@/services/section.api';
import { getAllSubjects } from '@/services/subject.api';
import { studentsApi } from '@/services/school-students.api';
import { fetchDepartments } from '@/services/department.api';
import { getAllLeaveAllocations } from '@/services/leave-allocation.api';
import { fetchFeeHeads } from '@/services/school-settings.api';

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

export function useSetupStatus() {
  return useQuery({
    queryKey: ['setup-status'],
    queryFn: async (): Promise<SetupItem[]> => {
      const [
        academicYearsRes, classesRes, staffRes, holidaysRes,
        sectionsRes, subjectsRes, studentsRes, departmentsRes,
        leaveAllocsRes, feeHeadsRes,
      ] = await Promise.all([
        getAllAcademicYears().catch(() => null),
        getAllClasses().catch(() => null),
        getAllStaff().catch(() => null),
        getAllHolidays().catch(() => null),
        getAllSections().catch(() => null),
        getAllSubjects().catch(() => null),
        studentsApi.getAll().catch(() => null),
        fetchDepartments().catch(() => null),
        getAllLeaveAllocations().catch(() => null),
        fetchFeeHeads().catch(() => null),
      ]);

      const hasAcademicYear     = Array.isArray(academicYearsRes?.data) && academicYearsRes.data.length > 0;
      const hasDepartments      = Array.isArray(departmentsRes) && departmentsRes.length > 0;
      const hasLeaveAllocations = Array.isArray(leaveAllocsRes) && leaveAllocsRes.length > 0;

      const hasClasses = Array.isArray((classesRes as { data?: unknown[] } | null)?.data) &&
        ((classesRes as { data: unknown[] }).data?.length ?? 0) > 0;

      const hasStaff = Array.isArray(staffRes?.data) && staffRes.data.length > 0;

      const hasSections = Array.isArray(sectionsRes) && sectionsRes.length > 0;

      const hasSubjects = (subjectsRes as { status?: boolean; data?: unknown[] } | null)?.status === true &&
        Array.isArray((subjectsRes as { data: unknown[] }).data) &&
        (subjectsRes as { data: unknown[] }).data.length > 0;

      const hasStudents = Array.isArray(studentsRes) && studentsRes.length > 0;

      const hasFeeHeads = Array.isArray(feeHeadsRes) && feeHeadsRes.length > 0;

      const holidaysRaw = holidaysRes?.data;
      const holidaysArr = Array.isArray(holidaysRaw)
        ? holidaysRaw
        : Array.isArray((holidaysRaw as { holidays?: unknown[] } | null)?.holidays)
          ? (holidaysRaw as { holidays: unknown[] }).holidays
          : (holidaysRes?.holidays ?? []);
      const hasHolidays = Array.isArray(holidaysArr) && holidaysArr.length > 0;

      return [
        {
          id: 'settings',
          label: 'Academic Configuration',
          description: 'Set up your academic year, holidays, departments, and leave policies before anything else.',
          route: '/schooladmin/settings',
          routeState: { openTab: 'academicConfig', fromWizard: true },
          done: hasAcademicYear && hasDepartments && hasHolidays && hasLeaveAllocations,
          order: 1,
          subItems: [
            { id: 'academicYear',     label: 'Academic Year',     done: hasAcademicYear },
            { id: 'departments',      label: 'Departments',       done: hasDepartments },
            { id: 'holidays',         label: 'Holidays',          done: hasHolidays },
            { id: 'leaveAllocations', label: 'Leave Allocations', done: hasLeaveAllocations },
          ],
        },
        {
          id: 'staff',
          label: 'Add Staff',
          description: 'Add your school\'s teaching and non-teaching staff members.',
          route: '/schooladmin/staff',
          done: hasStaff,
          order: 2,
          subItems: [
            { id: 'staff', label: 'At least one staff member', done: hasStaff },
          ],
        },
        {
          id: 'classes',
          label: 'Create Classes',
          description: 'Create classes, add sections under each class, and assign subjects.',
          route: '/schooladmin/classes',
          done: hasClasses && hasSections && hasSubjects,
          order: 3,
          subItems: [
            { id: 'classes',  label: 'At least one class',   done: hasClasses },
            { id: 'sections', label: 'At least one section', done: hasSections },
            { id: 'subjects', label: 'At least one subject', done: hasSubjects },
          ],
        },
        {
          id: 'students',
          label: 'Add Students',
          description: 'Enroll students into their respective classes and sections.',
          route: '/schooladmin/students',
          done: hasStudents,
          order: 4,
          subItems: [
            { id: 'students', label: 'At least one student enrolled', done: hasStudents },
          ],
        },
        {
          id: 'fees',
          label: 'Fee Management',
          description: 'Configure fee heads and fee structures for your school.',
          route: '/schooladmin/fees',
          done: hasFeeHeads,
          order: 5,
          subItems: [
            { id: 'feeHeads', label: 'Fee heads configured', done: hasFeeHeads },
          ],
        },
      ];
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
