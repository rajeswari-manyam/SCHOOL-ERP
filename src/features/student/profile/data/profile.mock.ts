import type { Student, NavItem } from "../types/profile.types";

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { id: 'attendance', label: 'Attendance', path: '/attendance' },
  { id: 'homework', label: 'Homework', path: '/homework' },
  { id: 'exams', label: 'Exams', path: '/exams' },
  { id: 'timetable', label: 'Timetable', path: '/timetable' },
  { id: 'profile', label: 'Profile', path: '/profile' },
];

export const STUDENT_DATA: Student = {
  id: 'stu-001',
  admissionNo: 'ADM-001',
  rollNo: '01',
  name: 'Ravi Kumar',
  avatarInitials: 'RK',
  avatarColor: '#6366f1',
  status: 'ACTIVE',
  class: 'Class 10A',
  section: 'A',
  classTeacher: {
    id: 'tch-001',
    name: 'Venkat Reddy',
    title: 'sir',
    avatarInitials: 'VR',
  },
  academic: {
    academicYear: '2024-25',
    board: 'CBSE',
    section: 'A',
    classroom: 'Room 501',
  },
  personal: {
    dateOfBirth: '12 March 2009',
    gender: 'Male',
    bloodGroup: 'B+',
    age: 16,
    fatherName: 'Suresh Kumar',
    fatherPhone: '+91 98765 43210',
    motherName: 'Lakshmi Devi',
    motherPhone: '+91 87654 32109',
    fullAddress: 'Plot 12, Hanamkonda Urban, Warangal — 506001',
  },
  quickDownloads: [
    {
      id: 'dl-001',
      title: 'Latest Report Card — 2024-25',
      subtitle: 'ACADEMIC DOCUMENT',
      type: 'ACADEMIC',
      fileSize: '1.2 MB',
    },
    {
      id: 'dl-002',
      title: 'Student ID Card',
      subtitle: 'IDENTITY DOCUMENT',
      type: 'IDENTITY',
      fileSize: '0.8 MB',
    },
    {
      id: 'dl-003',
      title: 'Latest Fee Receipt — RCP-2025-0823',
      subtitle: 'FINANCIAL DOCUMENT',
      type: 'FINANCIAL',
      fileSize: '0.5 MB',
    },
  ],
};