import type { Homework } from "../types/homework.types";
import type { Homework as ApiHomework } from "../../../../services/homework.api";

/** Map API homework shape → local UI shape */
export function mapApiHomework(hw: ApiHomework): Homework {
  const subjectRaw = hw.subjectName?.toUpperCase() ?? "ENGLISH";

  const dateObj = new Date(hw.submission_date);
  const dayNum  = isNaN(dateObj.getTime()) ? 0 : dateObj.getDate();

  const dueStr = isNaN(dateObj.getTime())
    ? hw.submission_date
    : dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  let dueLabel: string | undefined;
  const today = new Date();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dueMid   = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
  const diff = Math.round((dueMid - todayMid) / (1000 * 60 * 60 * 24));
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
    id:              hw.id,
    subject:         subjectRaw,
    subjectColor:    "blue",
    title:           hw.title,
    description:     hw.description,
    due:             dueStr,
    dueLabel,
    teacher:         hw.teacher_id ?? "",
    teacherInitials,
    day:             dayNum,
    status:          "NOT TRACKED",
    attachment:      hw.attachments?.length
      ? { name: hw.attachments[0], url: hw.attachments[0] }
      : undefined,
  };
}

/** Filter homework whose due-day >= selected day */
export function filterHomeworkByDay(data: Homework[] | undefined, day: number | null): Homework[] {
  if (!data) return [];
  if (!day) return data;
  return data.filter((h) => h.day >= day);
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