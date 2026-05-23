import { useState, useMemo } from "react";
import type { Student, MyStudentsFilters } from "../types/my-students.types";

// ── Comprehensive mock data ────────────────────────────────────────────────
const buildCalendar = (presentDays: number[], absentDays: number[]) => {
  const days = [];
  const year = 2025, month = 3; // April 2025
  for (let d = 1; d <= 30; d++) {
    const date = `${year}-0${month + 1}-${String(d).padStart(2, "0")}`;
    const dow = new Date(date).getDay();
    if (dow === 0) days.push({ date, status: "SUNDAY" as const });
    else if ([14, 18].includes(d)) days.push({ date, status: "HOLIDAY" as const });
    else if (absentDays.includes(d)) days.push({ date, status: "ABSENT" as const });
    else if (presentDays.includes(d)) days.push({ date, status: "PRESENT" as const });
    else days.push({ date, status: "PRESENT" as const });
  }
  return days;
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: "s1", rollNo: "01", name: "Arjun Reddy", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 92, feeStatus: "PAID",
    fatherName: "Suresh Reddy", fatherPhone: "98765 43210",
    motherName: "Padma Reddy", motherPhone: "98765 00001",
    feeTotal: 45000, feePaid: 45000, feeDueDate: "2025-04-10",
    attendanceDays: buildCalendar([1,2,3,4,7,8,9,10,11,14,15,16,17,18,21,22,23,24,25,28,29,30], [5,19]),
    homework: [
      { id: "h1", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", submittedDate: "2025-04-14", status: "SUBMITTED" },
      { id: "h2", title: "Essay: My Hero", subject: "English", dueDate: "2025-04-18", status: "PENDING" },
      { id: "h3", title: "Map Work – Rivers of India", subject: "Geography", dueDate: "2025-04-12", submittedDate: "2025-04-11", status: "SUBMITTED" },
      { id: "h4", title: "Newton's Laws Problems", subject: "Science", dueDate: "2025-04-20", status: "PENDING" },
    ],
  },
  {
    id: "s2", rollNo: "02", name: "Priya Sharma", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 88, feeStatus: "PARTIAL",
    fatherName: "Vikas Sharma", fatherPhone: "91234 56789",
    motherName: "Sunita Sharma", motherPhone: "91234 00002",
    feeTotal: 45000, feePaid: 22500, feeDueDate: "2025-04-05",
    attendanceDays: buildCalendar([1,2,3,7,8,9,10,14,15,16,17,21,22,23,24,25,28,29,30], [4,5,11,18]),
    homework: [
      { id: "h5", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", submittedDate: "2025-04-16", status: "LATE" },
      { id: "h6", title: "Essay: My Hero", subject: "English", dueDate: "2025-04-18", submittedDate: "2025-04-17", status: "SUBMITTED" },
      { id: "h7", title: "Map Work – Rivers of India", subject: "Geography", dueDate: "2025-04-12", status: "PENDING" },
    ],
  },
  {
    id: "s3", rollNo: "03", name: "Ravi Teja", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 52, feeStatus: "OVERDUE",
    fatherName: "Naresh Teja", fatherPhone: "94444 55555",
    motherName: "Lakshmi Teja", motherPhone: "94444 00003",
    feeTotal: 45000, feePaid: 0, feeDueDate: "2025-03-01",
    attendanceDays: buildCalendar([1,4,7,14,21,22,29,30], [2,3,5,8,9,10,11,15,16,17,18,23,24,25,28]),
    homework: [
      { id: "h8", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", status: "PENDING" },
      { id: "h9", title: "Essay: My Hero", subject: "English", dueDate: "2025-04-18", status: "PENDING" },
    ],
  },
  {
    id: "s4", rollNo: "04", name: "Sneha Patel", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 95, feeStatus: "PAID",
    fatherName: "Kiran Patel", fatherPhone: "97777 88888",
    motherName: "Hema Patel", motherPhone: "97777 00004",
    feeTotal: 45000, feePaid: 45000, feeDueDate: "2025-04-10",
    attendanceDays: buildCalendar([1,2,3,4,5,7,8,9,10,11,14,15,16,17,18,21,22,23,24,25,28,29,30], []),
    homework: [
      { id: "h10", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", submittedDate: "2025-04-13", status: "SUBMITTED" },
      { id: "h11", title: "Essay: My Hero", subject: "English", dueDate: "2025-04-18", submittedDate: "2025-04-17", status: "SUBMITTED" },
      { id: "h12", title: "Map Work – Rivers of India", subject: "Geography", dueDate: "2025-04-12", submittedDate: "2025-04-12", status: "SUBMITTED" },
    ],
  },
  {
    id: "s5", rollNo: "05", name: "Meena Kumari", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 61, feeStatus: "PENDING",
    fatherName: "Gopal Kumari", fatherPhone: "93333 44444",
    motherName: "Radha Kumari", motherPhone: "93333 00005",
    feeTotal: 45000, feePaid: 0, feeDueDate: "2025-04-10",
    attendanceDays: buildCalendar([1,2,7,8,9,14,15,21,22,28,29,30], [3,4,5,10,11,16,17,18,23,24,25]),
    homework: [
      { id: "h13", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", status: "PENDING" },
      { id: "h14", title: "Map Work – Rivers of India", subject: "Geography", dueDate: "2025-04-12", submittedDate: "2025-04-14", status: "LATE" },
    ],
  },
  {
    id: "s6", rollNo: "06", name: "Rohan Mehta", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 79, feeStatus: "PAID",
    fatherName: "Amit Mehta", fatherPhone: "98989 78787",
    motherName: "Kavita Mehta", motherPhone: "98989 00006",
    feeTotal: 45000, feePaid: 45000, feeDueDate: "2025-04-10",
    attendanceDays: buildCalendar([1,2,3,4,7,8,9,10,14,15,16,17,21,22,23,25,28,29], [5,11,18,24,30]),
    homework: [
      { id: "h15", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", submittedDate: "2025-04-15", status: "SUBMITTED" },
      { id: "h16", title: "Essay: My Hero", subject: "English", dueDate: "2025-04-18", status: "PENDING" },
    ],
  },
  {
    id: "s7", rollNo: "07", name: "Ananya Singh", className: "Class 8-A", section: "A",
    isActive: false, attendancePct: 70, feeStatus: "PARTIAL",
    fatherName: "Rajesh Singh", fatherPhone: "96666 11111",
    motherName: "Geeta Singh", motherPhone: "96666 00007",
    feeTotal: 45000, feePaid: 15000, feeDueDate: "2025-03-15",
    attendanceDays: buildCalendar([1,2,3,7,8,9,14,15,16,21,22,23,28,29,30], [4,5,10,11,17,18,24,25]),
    homework: [
      { id: "h17", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", status: "PENDING" },
    ],
  },
  {
    id: "s8", rollNo: "08", name: "Karthik Naidu", className: "Class 8-A", section: "A",
    isActive: true, attendancePct: 85, feeStatus: "PAID",
    fatherName: "Venkat Naidu", fatherPhone: "99111 22222",
    motherName: "Vijaya Naidu", motherPhone: "99111 00008",
    feeTotal: 45000, feePaid: 45000, feeDueDate: "2025-04-10",
    attendanceDays: buildCalendar([1,2,3,4,5,7,8,9,10,14,15,16,17,21,22,23,24,28,29,30], [11,18,25]),
    homework: [
      { id: "h18", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics", dueDate: "2025-04-15", submittedDate: "2025-04-14", status: "SUBMITTED" },
      { id: "h19", title: "Essay: My Hero", subject: "English", dueDate: "2025-04-18", submittedDate: "2025-04-17", status: "SUBMITTED" },
      { id: "h20", title: "Newton's Laws Problems", subject: "Science", dueDate: "2025-04-20", status: "PENDING" },
    ],
  },
];

// ── Hook ──────────────────────────────────────────────────────────────────
export const useMyStudents = () => {
  const [filters, setFilters] = useState<MyStudentsFilters>({
    search: "", feeStatus: "ALL", attendanceRange: "ALL",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const students = MOCK_STUDENTS; // replace with useQuery in production

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = filters.search.toLowerCase();
      if (q && !s.name.toLowerCase().includes(q) && !s.rollNo.includes(q)) return false;
      if (filters.feeStatus !== "ALL" && s.feeStatus !== filters.feeStatus) return false;
      if (filters.attendanceRange === "BELOW_75"  && s.attendancePct >= 75) return false;
      if (filters.attendanceRange === "75_TO_90"  && (s.attendancePct < 75 || s.attendancePct > 90)) return false;
      if (filters.attendanceRange === "ABOVE_90"  && s.attendancePct <= 90) return false;
      return true;
    });
  }, [students, filters]);

  const chronicAbsentees = useMemo(
    () => students.filter((s) => s.attendancePct < 75),
    [students]
  );

  const openDrawer = (student: Student) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  return { filters, setFilters, filtered, chronicAbsentees, selectedStudent, isDrawerOpen, openDrawer, closeDrawer };
};
