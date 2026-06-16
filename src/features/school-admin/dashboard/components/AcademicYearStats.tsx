import { motion } from 'framer-motion';
import {
  Users, Briefcase, BookOpen, BookMarked,
  CalendarCheck, FileSpreadsheet, Award, IndianRupee,
} from 'lucide-react';
import { useAcademicYearStudents, useAcademicYearStaffs, useAcademicYearClasses, useAcademicYearSubjects, useAcademicYearAttendance, useExamsByAcademicYear, useResultsByAcademicYear, useFeesByAcademicYear } from '../hooks/index';

interface StatItem {
  label: string;
  count: number | undefined;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export function AcademicYearStats() {
  const { data: students } = useAcademicYearStudents();
  const { data: staffs } = useAcademicYearStaffs();
  const { data: classes } = useAcademicYearClasses();
  const { data: subjects } = useAcademicYearSubjects();
  const { data: attendance } = useAcademicYearAttendance();
  const { data: exams } = useExamsByAcademicYear();
  const { data: results } = useResultsByAcademicYear();
  const { data: fees } = useFeesByAcademicYear();

  const items: StatItem[] = [
    { label: 'Students', count: students?.count, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Staff', count: staffs?.count, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Classes', count: classes?.count, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Subjects', count: subjects?.count, icon: BookMarked, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Attendance', count: attendance?.count, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Exams', count: exams?.count, icon: FileSpreadsheet, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Results', count: results?.count, icon: Award, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Fees', count: fees?.count, icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
      <h2 className="text-base font-bold text-gray-900 mb-4">Academic Year Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className={`flex items-center gap-3 rounded-xl ${item.bg} p-3.5`}
            >
              <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">{item.count ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
