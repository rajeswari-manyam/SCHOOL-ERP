import { useState, useEffect, useCallback } from "react";
import {
  getAllTimetable,
  getAllExamTimetable,
  type TimetableSlot,
  type ExamTimetableSlot,
} from "../../../../services/timetable.api";
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

/* ─────────────────────────────────────────────
   Config — swap with auth context / route params
───────────────────────────────────────────── */
const CLASS_NAME   = "10";
const SECTION_NAME = "A";

/* ─────────────────────────────────────────────
   Helper: capitalize first letter  "monday" → "Monday"
───────────────────────────────────────────── */
const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

/* ─────────────────────────────────────────────
   Helper: strip seconds  "09:00:00" → "09:00"
───────────────────────────────────────────── */
const stripSeconds = (t: string): string => {
  if (!t) return "";
  const parts = t.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : t;
};

/* ─────────────────────────────────────────────
   Helper: dot color from text color
───────────────────────────────────────────── */
const toDotColor = (textColor: string) =>
  textColor.replace("text-", "bg-");

/* ─────────────────────────────────────────────
   Helper: map flat API slots → ClassTimetable
───────────────────────────────────────────── */
const mapToClassTimetable = (
  slots: TimetableSlot[],
  displayName: string
): ClassTimetable => {
  // Unique periods sorted
  const periodNumbers = Array.from(new Set(slots.map((s) => s.period_no))).sort(
    (a, b) => a - b
  );

  // Unique subjects for legend
  const subjectSet = new Set(slots.map((s) => s.subjectname));
  const subjects: SubjectLegendItem[] = Array.from(subjectSet).map((name) => {
    const textColor = SUBJECT_CELL_COLORS[name] ?? "text-gray-600";
    return { name, color: textColor, dotColor: toDotColor(textColor) };
  });

  // Build period rows
  const periodRows: PeriodRow[] = periodNumbers.map((num) => {
    // find any slot for this period to get time info
    const refSlot = slots.find((s) => s.period_no === num)!;

    const days = {} as PeriodRow["days"];
    WEEK_DAYS.forEach((day) => {
      // API day_of_week is lowercase ("monday"), DayName is "Monday"
      const slot = slots.find(
        (s) =>
          s.period_no === num &&
          capitalize(s.day_of_week) === day
      );
      days[day] = slot
        ? { subject: slot.subjectname, teacher: slot.teachername }
        : { subject: "FREE" };
    });

    return {
      kind: "period",
      periodNumber: num,
      startTime: stripSeconds(refSlot.start_time),
      endTime: stripSeconds(refSlot.end_time),
      days,
    };
  });

  // Build lunch break row from first slot that has lunch times
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

  // Merge and sort all rows by startTime
  const allRows: TimetableRow[] = [...periodRows, ...breakRows].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  );

  const firstSlot = slots[0];
  return {
    className: displayName,
    academicYear: firstSlot?.academic_year ?? "2024-25",
    todayDay: getTodayDay(),
    rows: allRows,
    subjects,
  };
};

/* ─────────────────────────────────────────────
   Helper: map exam API slots → UpcomingExaminations
───────────────────────────────────────────── */
const mapToUpcomingExaminations = (
  slots: ExamTimetableSlot[]
): UpcomingExaminations => {
  const exams: ExamEntry[] = slots.map((s) => {
    const dateObj = new Date(s.exam_date);
    return {
      id: s.id,
      subject: s.subjectname,
      date: dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      day: dateObj.toLocaleDateString("en-IN", { weekday: "long" }),
      timeFrom: stripSeconds(s.start_time),
      timeTo: stripSeconds(s.end_time),
      venue: s.room_no,
    };
  });

  return {
    title: slots[0]?.exam_name ?? "Upcoming Exams",
    exams,
  };
};

/* ─────────────────────────────────────────────
   Hook: useClassTimetable
───────────────────────────────────────────── */
export const useClassTimetable = () => {
  const [data, setData]         = useState<ClassTimetable | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError]     = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAllTimetable(CLASS_NAME, SECTION_NAME);
      if (res.status && res.data.length > 0) {
        setData(mapToClassTimetable(res.data, `Class ${CLASS_NAME}${SECTION_NAME}`));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, isError, refetch: fetch };
};

/* ─────────────────────────────────────────────
   Hook: useUpcomingExaminations
───────────────────────────────────────────── */
export const useUpcomingExaminations = () => {
  const [data, setData]         = useState<UpcomingExaminations | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [isError, setError]     = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getAllExamTimetable(CLASS_NAME, SECTION_NAME);
      if (res.status) {
        setData(mapToUpcomingExaminations(res.data));
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, isError, refetch: fetch };
};

/* ─────────────────────────────────────────────
   Hook: useAddExamsToCalendar
───────────────────────────────────────────── */
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