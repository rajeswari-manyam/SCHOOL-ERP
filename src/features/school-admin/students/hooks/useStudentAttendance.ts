import { useState, useEffect } from "react";
import {
  getMonthlyAttendance,
  getYearlyAttendance,
  getStudentTodayAttendance,
  type MonthlyAttendanceResponse,
  type YearlyAttendanceResponse,
  type StudentTodayAttendanceResponse,
} from "@/services/attendance.api";
import { useUIStore } from "@/store/uiStore";
import type { Student } from "../types/student.types";

export const useStudentAttendance = (student: Student | null) => {
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth() + 1); // 1-12
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceResponse | null>(null);
  const [yearlyData, setYearlyData] = useState<YearlyAttendanceResponse | null>(null);
  const [todayData, setTodayData] = useState<StudentTodayAttendanceResponse | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState(false);
  const [yearlyLoading, setYearlyLoading] = useState(false);
  const [todayLoading, setTodayLoading] = useState(false);

  useEffect(() => {
    if (!student?.id) return;
    setTodayLoading(true);
    getStudentTodayAttendance(student.id)
      .then((res) => { if (res?.status) setTodayData(res); })
      .catch(() => {})
      .finally(() => setTodayLoading(false));
  }, [student?.id]);

  useEffect(() => {
    if (!student?.id) return;
    setMonthlyLoading(true);
    setMonthlyData(null);
    getMonthlyAttendance({ studentId: student.id, month: viewMonth, year: viewYear })
      .then((res) => { if (res?.status) setMonthlyData(res); })
      .catch(() => {})
      .finally(() => setMonthlyLoading(false));
  }, [student?.id, viewMonth, viewYear]);

  useEffect(() => {
    if (!student?.id) return;
    const classId = student.classId ?? "";
    const sectionId = student.sectionId ?? "";
    const academicYearId = student.academicYearId || useUIStore.getState().academicYearId || "";
    if (!classId || !sectionId || !academicYearId) return;
    setYearlyLoading(true);
    getYearlyAttendance({
      studentId: student.id,
      year: viewYear,
      class_id: classId,
      section_id: sectionId,
      academicYearId,
    })
      .then((res) => { if (res?.status) setYearlyData(res); })
      .catch(() => {})
      .finally(() => setYearlyLoading(false));
  }, [student?.id, student?.classId, student?.sectionId, student?.academicYearId, viewYear]);

  const prevMonth = () => {
    if (viewMonth === 1) { setViewMonth(12); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 12) { setViewMonth(1); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  return {
    todayData,
    todayLoading,
    monthlyData,
    yearlyData,
    viewMonth,
    viewYear,
    monthlyLoading,
    yearlyLoading,
    prevMonth,
    nextMonth,
  };
};
