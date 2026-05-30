// hooks/useHomework.ts
import { useState, useEffect, useCallback } from "react";
import { getHomeworkByClass } from "../../../../services/homework.api";
import { getStudyMaterialByClassName } from "../../../../services/studymaterial.api";
import type { ActiveTab, Homework, StudyMaterial } from "../types/homework.types";

// ── Map API homework → internal Homework ────────────────────────────────────
const mapApiHomework = (item: any): Homework => {
  const due = new Date(item.submission_date);
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let dueDate = "Upcoming";
  let dueUrgency: "urgent" | "medium" | "normal" = "normal";

  if (diffDays <= 1)      { dueDate = "Due Tomorrow";          dueUrgency = "urgent"; }
  else if (diffDays <= 3) { dueDate = `Due in ${diffDays} days`; dueUrgency = "medium"; }
  else                    { dueDate = `Due in ${diffDays} days`; dueUrgency = "normal"; }

  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return {
    id: item.id,
    title: item.title,
    subject: item.subjectName,
    description: item.description,
    dueDate,
    dueUrgency,
    assignedBy: item.teacher_id,
    submitted: false,
    attachment: item.attachments?.[0] ?? undefined,
    weekDay: DAYS[due.getDay()],
    weekDate: due.getDate(),
  };
};

// ── Map API study material → internal StudyMaterial ─────────────────────────
const mapApiMaterial = (item: any): StudyMaterial => {
  const isLink = !item.pdf && !!item.open_link;
  const type = isLink ? "link" : "pdf";

  return {
    id: item.id,
    title: item.subjectName,           // API has no separate title field
    subject: item.subjectName,
    type,
    uploadedDate: new Date(item.upload_date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    }),
    url: isLink ? item.open_link : item.pdf ?? undefined,
  };
};

interface UseHomeworkOptions {
  className: string; // from auth context e.g. "10A"
}

export const useHomework = ({ className }: UseHomeworkOptions) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("week");
  const [homework, setHomework] = useState<Homework[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);

  // ── Fetch both in parallel ───────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!className) return;
    setLoading(true);
    setError(null);
    try {
      const [hwRes, matRes] = await Promise.all([
        getHomeworkByClass(className),
        getStudyMaterialByClassName(className),
      ]);

      setHomework(
        (hwRes.data ?? [])
          .filter((item: any) => item.is_published)
          .map(mapApiHomework)
      );

      setMaterials((matRes.data ?? []).map(mapApiMaterial));
    } catch (err: any) {
      setError(err?.message ?? "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [className]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Modal helpers ────────────────────────────────────────────────────────
  const openSubmitModal = (hw: Homework) => {
    setSelectedHomework(hw);
    setSubmitModalOpen(true);
  };

  const closeSubmitModal = () => {
    setSubmitModalOpen(false);
    setSelectedHomework(null);
  };

  const handleSubmit = (id: string) => {
    setHomework((prev) =>
      prev.map((hw) => (hw.id === id ? { ...hw, submitted: true } : hw))
    );
    closeSubmitModal();
  };

  const thisWeekHomework = homework.filter((hw) => hw.weekDay);

  return {
    activeTab,
    setActiveTab,
    homework,
    thisWeekHomework,
    materials,
    loading,
    error,
    refetch: fetchData,
    submitModalOpen,
    selectedHomework,
    openSubmitModal,
    closeSubmitModal,
    handleSubmit,
  };
};