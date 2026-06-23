import { useQuery } from '@tanstack/react-query';
import { getAllAcademicYears } from '@/services/academicYear.api';
import { getAllClasses } from '@/services/class.api';
import { getAllStaff } from '@/services/staff.api';
import { getAllHolidays } from '@/services/holidays.api';

export interface SetupItem {
  id: string;
  label: string;
  description: string;
  route: string;
  routeState?: { openTab?: string; [key: string]: unknown };
  done: boolean;
}

export function useSetupStatus() {
  return useQuery({
    queryKey: ['setup-status'],
    queryFn: async (): Promise<SetupItem[]> => {
      const [academicYearsRes, classesRes, staffRes, holidaysRes] = await Promise.all([
        getAllAcademicYears().catch(() => null),
        getAllClasses().catch(() => null),
        getAllStaff().catch(() => null),
        getAllHolidays().catch(() => null),
      ]);

      const hasAcademicYear = Array.isArray(academicYearsRes?.data) && academicYearsRes.data.length > 0;

      const hasClasses = Array.isArray((classesRes as { data?: unknown[] } | null)?.data) &&
        ((classesRes as { data: unknown[] }).data?.length ?? 0) > 0;

      const hasStaff = Array.isArray(staffRes?.data) && staffRes.data.length > 0;

      const holidaysRaw = holidaysRes?.data;
      const holidaysArr = Array.isArray(holidaysRaw)
        ? holidaysRaw
        : Array.isArray((holidaysRaw as { holidays?: unknown[] } | null)?.holidays)
          ? (holidaysRaw as { holidays: unknown[] }).holidays
          : (holidaysRes?.holidays ?? []);
      const hasHolidays = Array.isArray(holidaysArr) && holidaysArr.length > 0;

      return [
        {
          id: 'academic-year',
          label: 'Academic Year',
          description: 'Create an academic year to organise classes, fees, and attendance.',
          route: '/schooladmin/settings',
          routeState: { openTab: 'academicConfig' },
          done: hasAcademicYear,
        },
        {
          id: 'classes',
          label: 'Add Classes',
          description: 'Set up classes and sections for your school.',
          route: '/schooladmin/classes',
          done: hasClasses,
        },
        {
          id: 'staff',
          label: 'Add Staff',
          description: 'Add teachers and non-teaching staff members.',
          route: '/schooladmin/staff',
          done: hasStaff,
        },
        {
          id: 'holidays',
          label: 'Add Holidays',
          description: 'Configure school holidays and the academic calendar.',
          route: '/schooladmin/settings',
          routeState: { openTab: 'academicConfig' },
          done: hasHolidays,
        },
      ];
    },
    staleTime: 2 * 60_000,
    retry: false,
  });
}