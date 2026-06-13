import { useState, useEffect, useCallback } from "react";
import {
  getHomeworkByClass,
  getSubmissionsByStudentId,
} from "../../../../services/homework.api";
import { getStudyMaterialsByFilter } from "../../../../services/studymaterial.api";
import { getStudentById } from "../../../../services/student.api";
import { useAuthStore } from "@/store/authStore";
import type { ActiveTab, Homework, StudyMaterial } from "../types/homework.types";

const SUBJECT_ALIAS: Record<string, string> = {
  MATHS: "Mathematics",
  MATH: "Mathematics",
  MATHEMATICS: "Mathematics",
  ENG: "English",
  ENGLISH: "English",
  SCI: "Science",
  SCIENCE: "Science",
  PHYSICS: "Science",
  BIOLOGY: "Science",
  CHEMISTRY: "Science",
  CHEM: "Science",
  SST: "SST",
  SOCIAL: "SST",
  HINDI: "Hindi",
};

function normaliseSubject(raw: string): string {
  const up = (raw ?? "").toUpperCase().trim();
  return SUBJECT_ALIAS[up] ?? raw;
}

export function getCurrentWeekDays() {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

  const LABELS = ["MON", "TUE", "WED", "THU", "FRI"];
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: LABELS[i],
      date: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      fullDate: d,
    };
  });
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const mapApiHomework = (item: any): Homework => {
  const due = new Date(item.submission_date);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let dueDate = "Upcoming";
  let dueUrgency: "urgent" | "medium" | "normal" = "normal";

  if (diffDays < 0)       { dueDate = `${Math.abs(diffDays)} days overdue`; dueUrgency = "urgent"; }
  else if (diffDays === 0) { dueDate = "Due Today";                          dueUrgency = "urgent"; }
  else if (diffDays === 1) { dueDate = "Due Tomorrow";                       dueUrgency = "urgent"; }
  else if (diffDays <= 3)  { dueDate = `Due in ${diffDays} days`;            dueUrgency = "medium"; }
  else                     { dueDate = `Due in ${diffDays} days`;            dueUrgency = "normal"; }

  return {
    id: item.id,
    title: item.title,
    subject: normaliseSubject(
      item.subject?.name ?? item.subjectName ?? item.title ?? "Unknown"
    ),
    description: item.description,
    dueDate,
    dueUrgency,
    assignedBy: item.teacher?.name ?? item.teacher_id ?? "",
    submitted: false,
    attachment: item.attachments?.[0] ?? undefined,
    attachments: item.attachments ?? [],
    className: item.class?.name ?? "",
    sectionName: item.section?.name ?? "",
    subjectId: item.subject?.id ?? "",
    classId: item.class?.id ?? "",
    sectionId: item.section?.id ?? "",
    isPublished: item.is_published,
    weekDay: isNaN(due.getTime()) ? undefined : WEEKDAYS[due.getDay()],
    weekDate: isNaN(due.getTime()) ? undefined : due.getDate(),
    submissionDate: isNaN(due.getTime()) ? undefined : due,
  };
};

const mapApiMaterial = (item: any): StudyMaterial => {
  const isLink = item.upload_type === "link" || (!item.pdf && !!item.open_link);
  return {
    id: item.id,
    title: item.title ?? "Untitled",
    subject: normaliseSubject(item.subject?.name ?? item.title ?? "Unknown"),
    subjectName: item.subject?.name,
    className: item.class?.name,
    section: item.section?.name,
    type: isLink ? "link" : "pdf",
    uploadedDate: new Date(item.upload_date).toLocaleDateString("en-IN", {
      day: "numeric", month: "short",
    }),
    url: isLink ? item.open_link : item.pdf ?? undefined,
    pdf: item.pdf,
    open_link: item.open_link,
    download: item.download,
    description: item.description,
  };
};

export const useHomework = () => {
  const authUser = useAuthStore((s) => s.user);

  const [activeTab, setActiveTab]         = useState<ActiveTab>("week");
  const [homework, setHomework]           = useState<Homework[]>([]);
  const [materials, setMaterials]         = useState<StudyMaterial[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [studentName, setStudentName]     = useState("");
  const [studentClass, setStudentClass]   = useState("");
  const [studentSection, setStudentSection] = useState("");
  const [classId, setClassId]             = useState("");
  const [sectionId, setSectionId]         = useState("");

  const weekDays = getCurrentWeekDays();
  const today = new Date();
  const defaultDay =
    weekDays.find(
      (d) =>
        d.date === today.getDate() &&
        d.month === today.getMonth() &&
        d.year === today.getFullYear()
    ) ?? weekDays[0];
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const [submitModalOpen, setSubmitModalOpen]     = useState(false);
  const [selectedHomework, setSelectedHomework]   = useState<Homework | null>(null);

  // ── Step 1: fetch student ─────────────────────────────────────────────────
  useEffect(() => {
    if (!authUser?.id) return;
    getStudentById(String(authUser.id)).then((student) => {
      const name = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim();
      setStudentName(name);

      const resolvedClassName =
        student.classDetail?.class_name ?? (student as any).class?.class_name ?? "";
      const resolvedClassId =
        student.classDetail?.id ?? (student as any).class?.id ?? student.class_id ?? "";

      setStudentClass(resolvedClassName);
      setClassId(resolvedClassId);

      const rawSectionId: string =
        student.sectionDetail?.id ?? (student as any).section?.id ?? student.sectionId ?? "";
      const cleanSectionId = rawSectionId.includes(":")
        ? rawSectionId.split(":")[1]
        : rawSectionId;

      const resolvedSectionName =
        student.sectionDetail?.sectionName ?? (student as any).section?.sectionName ?? "";

      setStudentSection(resolvedSectionName);
      setSectionId(cleanSectionId);
    });
  }, [authUser?.id]);

  // ── Step 2: fetch homework + submissions ──────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!classId || !authUser?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [hwRes, matRes, subRes] = await Promise.all([
        getHomeworkByClass({ class_id: classId, section_id: sectionId }),
        getStudyMaterialsByFilter({ class_id: classId, section_id: sectionId }),
        getSubmissionsByStudentId(String(authUser.id)),
      ]);

      const mapped = (hwRes.data ?? []).map(mapApiHomework);

      // Build submitted set from student's own submissions
      const submittedSet = new Set<string>();
      for (const sub of subRes.data ?? []) {
        if (sub.status === "submitted") {
          submittedSet.add(sub.homework_id);
          localStorage.setItem(`hw_sub_${sub.homework_id}`, sub.id);
        }
      }

      setHomework(
        mapped.map((hw) => ({ ...hw, submitted: submittedSet.has(hw.id) }))
      );
      setMaterials((matRes.data ?? []).map(mapApiMaterial));
    } catch (err: any) {
      setError(err?.message ?? "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId, authUser?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openSubmitModal  = (hw: Homework) => { setSelectedHomework(hw); setSubmitModalOpen(true); };
  const closeSubmitModal = () => { setSubmitModalOpen(false); setSelectedHomework(null); };

  const handleSubmit = (id: string, submissionId?: string) => {
    if (submissionId) localStorage.setItem(`hw_sub_${id}`, submissionId);
    setHomework((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, submitted: true } : hw))
    );
    closeSubmitModal();
  };

  // ── "This Week" filter ────────────────────────────────────────────────────
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
    homework,
    thisWeekHomework,
    materials,
    loading, error,
    refetch: fetchData,
    studentName,
    studentClass,
    studentSection,
    classId,
    studentId: String(authUser?.id ?? ""),
    weekDays,
    selectedDay, setSelectedDay,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  };
};