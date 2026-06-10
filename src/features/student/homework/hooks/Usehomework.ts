// hooks/useHomework.ts
import { useState, useEffect, useCallback } from "react";
import { getHomeworkByClass } from "../../../../services/homework.api";
import { getStudyMaterialByClassName } from "../../../../services/studymaterial.api";
import type { ActiveTab, Homework, StudyMaterial } from "../types/homework.types";

// ── Subject normalisation ─────────────────────────────────────────────────────
const SUBJECT_ALIAS: Record<string, string> = {
  MATHS:       "Mathematics",
  MATH:        "Mathematics",
  MATHEMATICS: "Mathematics",
  ENG:         "English",
  ENGLISH:     "English",
  SCI:         "Science",
  SCIENCE:     "Science",
  PHYSICS:     "Science",
  BIOLOGY:     "Science",
  CHEMISTRY:   "Science",
  CHEM:        "Science",
  SST:         "SST",
  SOCIAL:      "SST",
  HINDI:       "Hindi",
};

function normaliseSubject(raw: string): string {
  const up = (raw ?? "").toUpperCase().trim();
  return SUBJECT_ALIAS[up] ?? raw;
}

// ── Real Mon–Fri of current week ─────────────────────────────────────────────

export function getCurrentWeekDays() {
  const today  = new Date();
  const dow    = today.getDay(); // 0 = Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

  const LABELS = ["MON", "TUE", "WED", "THU", "FRI"];
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label:    LABELS[i],
      date:     d.getDate(),
      month:    d.getMonth(),
      year:     d.getFullYear(),
      fullDate: d,
    };
  });
}

// ── Map API → internal Homework ───────────────────────────────────────────────

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const mapApiHomework = (item: any): Homework => {
  const due      = new Date(item.submission_date);
  const now      = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let dueDate    = "Upcoming";
  let dueUrgency: "urgent" | "medium" | "normal" = "normal";

  if (diffDays <= 1)      { dueDate = "Due Tomorrow";             dueUrgency = "urgent"; }
  else if (diffDays <= 3) { dueDate = `Due in ${diffDays} days`;  dueUrgency = "medium"; }
  else                    { dueDate = `Due in ${diffDays} days`;  dueUrgency = "normal"; }

  return {
    id:             item.id,
    title:          item.title,
  subject: normaliseSubject(item.subjectName ?? item.title ?? "Unknown"),
    description:    item.description,
    dueDate,
    dueUrgency,
    assignedBy:     item.teacher_id ?? "",
    submitted:      false,
    attachment:     item.attachments?.[0] ?? undefined,
    weekDay:        isNaN(due.getTime()) ? undefined : WEEKDAYS[due.getDay()],
    weekDate:       isNaN(due.getTime()) ? undefined : due.getDate(),
    submissionDate: isNaN(due.getTime()) ? undefined : due,
  };
};

// ── Map API study material → internal StudyMaterial ──────────────────────────

const mapApiMaterial = (item: any): StudyMaterial => {
  const isLink = !item.pdf && !!item.open_link;
  return {
    id:           item.id,
    title:        item.title ?? item.subjectName ?? "Untitled",
       subject: normaliseSubject(item.subjectName ?? item.title ?? "Unknown"),
    type:         isLink ? "link" : "pdf",
    uploadedDate: new Date(item.upload_date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short",
    }),
    url: isLink ? item.open_link : item.pdf ?? undefined,
  };
};

// ── Hook ──────────────────────────────────────────────────────────────────────

interface UseHomeworkOptions {
  classId: string;
  sectionId: string;
}

export const useHomework = ({ classId, sectionId }: UseHomeworkOptions) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("week");
  const [homework,  setHomework]  = useState<Homework[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);

  // Calendar — real current week
  const weekDays   = getCurrentWeekDays();
  const today      = new Date();
  const defaultDay = weekDays.find(
    (d) =>
      d.date  === today.getDate() &&
      d.month === today.getMonth() &&
      d.year  === today.getFullYear()
  ) ?? weekDays[0];
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  // Submit modal
  const [submitModalOpen,  setSubmitModalOpen]  = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    try {
      // getHomeworkByClass splits "10A" → className=10&section=A internally
  const [hwRes, matRes] = await Promise.all([
getHomeworkByClass({ class_id: classId, section_id: sectionId }),
  getStudyMaterialByClassName(classId), // temp fix
]);
console.log("matRes →", matRes); // 👈 add this line

     setHomework(
  (hwRes.data ?? []).map(mapApiHomework)
);

      setMaterials((matRes.data ?? []).map(mapApiMaterial));
    } catch (err: any) {
      setError(err?.message ?? "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openSubmitModal  = (hw: Homework) => { setSelectedHomework(hw); setSubmitModalOpen(true); };
  const closeSubmitModal = () => { setSubmitModalOpen(false); setSelectedHomework(null); };
  const handleSubmit     = (id: string) => {
    setHomework((prev) => prev.map((hw) => hw.id === id ? { ...hw, submitted: true } : hw));
    closeSubmitModal();
  };

  // ── "This Week" — due on or after selected calendar day ──────────────────
  const thisWeekHomework = homework.filter((hw) => {
    if (!hw.submissionDate) return false;
    const due = new Date(
      hw.submissionDate.getFullYear(),
      hw.submissionDate.getMonth(),
      hw.submissionDate.getDate()
    ).getTime();
    const sel = new Date(selectedDay.year, selectedDay.month, selectedDay.date).getTime();
    return due >= sel;
  });

  return {
    activeTab, setActiveTab,
    homework,           // all homework → All Homework tab
    thisWeekHomework,   // filtered by selected day → This Week tab
    materials,
    loading, error,
    refetch: fetchData,
    // Calendar
    weekDays,
    selectedDay, setSelectedDay,
    // Modal
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  };
};