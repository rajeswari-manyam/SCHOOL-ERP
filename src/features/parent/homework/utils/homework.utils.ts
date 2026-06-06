import type { Homework } from "../types/homework.types";
import type { Homework as ApiHomework } from "../../../../services/homework.api";

/** Normalise subject names from the API to match UI badge/icon keys */
const SUBJECT_ALIAS: Record<string, string> = {
  MATHS:   "MATHEMATICS",
  MATH:    "MATHEMATICS",
  ENG:     "ENGLISH",
  SCI:     "SCIENCE",
  PHYSICS: "SCIENCE",
  BIOLOGY: "SCIENCE",
  CHEM:    "SCIENCE",
  CHEMISTRY: "SCIENCE",
};

function normaliseSubject(raw: string): string {
  const up = raw.toUpperCase().trim();
  return SUBJECT_ALIAS[up] ?? up;
}

/** Map API homework shape → local UI shape */
export function mapApiHomework(hw: ApiHomework): Homework {
  const subjectRaw = normaliseSubject(hw.subjectName ?? "ENGLISH");

  const dateObj = new Date(hw.submission_date);
  const dayNum  = isNaN(dateObj.getTime()) ? 0 : dateObj.getDate();

  const dueStr = isNaN(dateObj.getTime())
    ? hw.submission_date
    : dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  let dueLabel: string | undefined;
  const today    = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dueMid   = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
  const diff     = Math.round((dueMid - todayMid) / (1000 * 60 * 60 * 24));
  if (diff === 0)  dueLabel = "Today";
  if (diff === 1)  dueLabel = "Tomorrow";
  if (diff === -1) dueLabel = "Yesterday";

  const teacherInitials = (hw.teacher_id ?? "T")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    id:             hw.id,
    subject:        subjectRaw,
    subjectColor:   "blue",
    title:          hw.title,
    description:    hw.description,
    due:            dueStr,
    dueLabel,
    teacher:        hw.teacher_id ?? "",
    teacherInitials,
    day:            dayNum,
    // Store the full submission date so DayFilter can match properly
    submissionDate: isNaN(dateObj.getTime()) ? undefined : dateObj,
    status:         "NOT TRACKED",
    attachment:     hw.attachments?.length
      ? { name: hw.attachments[0], url: hw.attachments[0] }
      : undefined,
  };
}

/**
 * Filter homework whose submission date matches (or is on/after) the selected date.
 * Falls back to day-number comparison if submissionDate is absent.
 */
export function filterHomeworkByDay(
  data: Homework[] | undefined,
  selectedDate: Date | null
): Homework[] {
  if (!data) return [];
  if (!selectedDate) return data;

  const sel = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  ).getTime();

  return data.filter((h) => {
    if (h.submissionDate) {
      const due = new Date(
        h.submissionDate.getFullYear(),
        h.submissionDate.getMonth(),
        h.submissionDate.getDate()
      ).getTime();
      return due >= sel;
    }
    // Legacy fallback: compare just the day number
    return h.day >= selectedDate.getDate();
  });
}

export function groupBySubject(data: Homework[] | undefined): Record<string, Homework[]> {
  if (!data) return {};
  return data.reduce<Record<string, Homework[]>>((acc, item) => {
    const key = item.subject?.toUpperCase() ?? "OTHER";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function sortByDueDate(data: Homework[] | undefined): Homework[] {
  if (!data) return [];
  return [...data].sort((a, b) => a.day - b.day);
}
