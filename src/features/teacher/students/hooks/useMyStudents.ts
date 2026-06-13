import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { myStudentsApi, getTeacherId } from "../api/my-students.api";
import type { Student, MyStudentsFilters } from "../types/my-students.types";

export const useMyStudents = () => {
  const teacherId = getTeacherId();

  const { data: students = [], isLoading, isError, error } = useQuery({
    queryKey: ["teacher", "my-students", teacherId],
    queryFn: () => myStudentsApi.getStudents(teacherId),
    enabled: !!teacherId,
    staleTime: 30_000,
    retry: 2,
  });

  const [filters, setFilters] = useState<MyStudentsFilters>({
    search: "", feeStatus: "ALL", attendanceRange: "ALL",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  return { students, filtered, chronicAbsentees, isLoading, isError, error, filters, setFilters, selectedStudent, isDrawerOpen, openDrawer, closeDrawer };
};