import { useState, useEffect, useCallback } from "react";
import {
  getAllTimetable,
  type TimetableSlot,
} from "../../../../services/timetable.api";
import {
  getAllExamTimetables,
  type ExamTimetableListItem,
} from "../../../../services/examtimetable.api";
import { getStudentById } from "@/services/student.api";
import { getAllAcademicYears } from "@/services/academicYear.api";
import { useAuthStore } from "@/store/authStore";
import type {
  ClassTimetable,
  UpcomingExaminations,
  TimetableRow,
  PeriodRow,
  BreakRow,
  SubjectLegendItem,
  ExamEntry,
} from "../types/Classtimetable.types";
import {
  SUBJECT_CELL_COLORS,
  getTodayDay,
  WEEK_DAYS,
} from "../utils/Classtimetable.utils";

const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const stripSeconds = (t: string): string => {
  if (!t) return "";
  const parts = t.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
};

const toDotColor = (textColor: string) =>
  textColor.replace("text-", "bg-");

/**
 * Parse "09:00 AM - 09:45 AM" into { start: "09:00", end: "09:45" }
 * Handles both 12-hr with AM/PM and plain "HH:MM:SS" formats.
 */
const parseTimeSlot = (timeSlot: string): { start: string; end: string } => {
  if (!timeSlot) return { start: "", end: "" };

  // Try "09:00 AM - 09:45 AM" format
  const ampmMatch = timeSlot.match(
    /(\d{1,2}:\d{2}(?::\d{2})?)\s*(AM|PM)?\s*[-–]\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*(AM|PM)?/i
  );
  if (ampmMatch) {
    const to24 = (t: string, ampm?: string): string => {
      const [hStr, mStr] = t.split(":");
      let h = parseInt(hStr, 10);
      const m = mStr.slice(0, 2);
      if (ampm) {
        if (ampm.toUpperCase() === "PM" && h !== 12) h += 12;
        if (ampm.toUpperCase() === "AM" && h === 12) h = 0;
      }
      return `${String(h).padStart(2, "0")}:${m}`;
    };
    return {
      start: to24(ampmMatch[1], ampmMatch[2]),
      end: to24(ampmMatch[3], ampmMatch[4]),
    };
  }

  // Fallback: plain "HH:MM:SS" single value
  return { start: stripSeconds(timeSlot), end: "" };
};

export const mapToClassTimetable = (
  slots: TimetableSlot[],
  displayName: string,
  academicYearName: string
): ClassTimetable => {
  // Resolve subject name from nested object or flat field
  const getSubjectName = (slot: TimetableSlot): string =>
    (slot as any).subject?.subject_name ?? slot.subjectname ?? "FREE";

  // Resolve teacher name from nested object or flat field
  const getTeacherName = (slot: TimetableSlot): string =>
    (slot as any).teacher?.name ?? slot.teachername ?? "";

  // Unique periods sorted
  const periodNumbers = Array.from(new Set(slots.map((s) => s.period_no))).sort(
    (a, b) => a - b
  );

  // Unique subjects for legend
  const subjectSet = new Set(slots.map(getSubjectName));
  const subjects: SubjectLegendItem[] = Array.from(subjectSet).map((name) => {
    const textColor = SUBJECT_CELL_COLORS[name] ?? "text-indigo-600";
    return { name, color: textColor, dotColor: toDotColor(textColor) };
  });

  // Build period rows
  const periodRows: PeriodRow[] = periodNumbers.map((num) => {
    const refSlot = slots.find((s) => s.period_no === num)!;
    const { start, end } = parseTimeSlot(refSlot.time_sloat);

    const days = {} as PeriodRow["days"];
    WEEK_DAYS.forEach((day) => {
      const slot = slots.find(
        (s) =>
          s.period_no === num &&
          capitalize(s.day_of_week) === day
      );
      days[day] = slot
        ? { subject: getSubjectName(slot), teacher: getTeacherName(slot) }
        : { subject: "FREE" };
    });

    return {
      kind: "period",
      periodNumber: num,
      startTime: start,
      endTime: end,
      days,
    };
  });

  // Build lunch/break rows
  const breakRows: BreakRow[] = [];
  const lunchSlot = slots.find((s) => s.lunch_start && s.lunch_end);
  if (lunchSlot) {
    breakRows.push({
      kind: "break",
      label: "Lunch Break",
      startTime: stripSeconds(lunchSlot.lunch_start),
      endTime: stripSeconds(lunchSlot.lunch_end),
    });
  }
  const breakSlot = slots.find((s) => s.break_start && s.break_end);
  if (breakSlot) {
    breakRows.push({
      kind: "break",
      label: "Break",
      startTime: stripSeconds(breakSlot.break_start),
      endTime: stripSeconds(breakSlot.break_end),
    });
  }

  // Merge and sort all rows by startTime
  const allRows: TimetableRow[] = [...periodRows, ...breakRows].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  return {
    className: displayName,
    academicYear: academicYearName,
    todayDay: getTodayDay(),
    rows: allRows,
    subjects,
  };
};

const mapToUpcomingExaminations = (
  slots: ExamTimetableListItem[]
): UpcomingExaminations => {
  const exams: ExamEntry[] = slots.map((s) => {
    const dateObj = new Date(s.exam_date);
    return {
      id: s.id,
      subject: s.subject.subject_name,
      date: dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      day: dateObj.toLocaleDateString("en-IN", { weekday: "long" }),
      timeFrom: stripSeconds(s.start_time),
      timeTo: stripSeconds(s.end_time),
      venue: s.room_no,
      syllabus: s.syllabus ?? "",
    };
  });

  return {
    title: slots[0]?.exam.exam_name ?? "Upcoming Exams",
    exams,
  };
};

export interface TimetableStudentMeta {
  studentName: string;
  className: string;
  sectionName: string;
  academicYear: string;
}

export const useClassTimetable = () => {
  const { user } = useAuthStore();
  const studentId = user?.id;

  const [data, setData] = useState<ClassTimetable | null>(null);
  const [meta, setMeta] = useState<TimetableStudentMeta | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const fetch = useCallback(async () => {
    if (!studentId) {
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      // 1. Fetch student to get class_id and section_id UUIDs
      const student = await getStudentById(studentId);

      const classId = student.class_id;
      // Support both plain UUID and composite "sectionName:classId" formats
      const rawSectionId: string = student.sectionId ?? "";
      const sectionId = rawSectionId.includes(":")
        ? rawSectionId.split(":")[1]
        : rawSectionId;

      if (!classId || !sectionId) {
        setError(true);
        return;
      }

      // 2. Fetch active academic year name
      const { data: years } = await getAllAcademicYears();
      const activeYear = years.find((y) => y.active) ?? years[0];
      const academicYearName = activeYear?.yearName ?? "—";

      // 3. Fetch timetable using real UUIDs
      const res = await getAllTimetable(classId, sectionId);

      if (res.status && res.data.length > 0) {
        const firstSlot = res.data[0] as any;
        const className =
          firstSlot?.class?.class_name ??
          student.classDetail?.class_name ??
          classId;
        const sectionName =
          firstSlot?.section?.sectionName ??
          student.sectionDetail?.sectionName ??
          sectionId;
        const displayName = `Class ${className} – ${sectionName}`;
        const studentName = `${student.first_name} ${student.last_name}`.trim();

        setMeta({ studentName, className, sectionName, academicYear: academicYearName });
        setData(mapToClassTimetable(res.data, displayName, academicYearName));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, meta, isLoading, isError, refetch: fetch };
};

export const useUpcomingExaminations = (classId?: string, sectionId?: string) => {
  const [data, setData] = useState<UpcomingExaminations | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const fetch = useCallback(async () => {
    if (!classId || !sectionId) return;

    setLoading(true);
    setError(false);
    try {
      const result = await getAllExamTimetables({ class_id: classId, section_id: sectionId });
      if (Array.isArray(result) && result.length > 0) {
        setData(mapToUpcomingExaminations(result));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, isError, refetch: fetch };
};

export const useAddExamsToCalendar = () => {
  const [isAdding, setIsAdding] = useState(false);

  const addAll = async (examIds: string[]) => {
    setIsAdding(true);
    try {
      console.log("Added to calendar:", examIds);
    } finally {
      setIsAdding(false);
    }
  };

  return { addAll, isAdding };
};
