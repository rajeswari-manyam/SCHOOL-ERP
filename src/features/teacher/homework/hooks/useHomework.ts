import { useState, useMemo } from "react";
import type { HomeworkItem, StudyMaterial } from "../types/homework.types";

// ── Mock Data ─────────────────────────────────────────────────────────────
export const MOCK_HOMEWORK: HomeworkItem[] = [
  {
    id: "hw1", title: "Chapter 5 – Exercise 5.2", subject: "Mathematics",
    className: "Class 8-A", section: "A", dueDate: "2025-04-18",
    description: "Complete all 12 problems from page 87. Show all working clearly. Students who face difficulty can attempt at least the first 8 problems.",
    attachmentName: "Chapter5_Exercise.pdf", attachmentUrl: "#",
    submittedCount: 28, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2025-04-14 10:30 AM",
    status: "ACTIVE", createdAt: "2025-04-12",
  },
  {
    id: "hw2", title: "Essay: My Favourite Scientist", subject: "English",
    className: "Class 8-A", section: "A", dueDate: "2025-04-20",
    description: "Write a 300–400 word essay about your favourite scientist. Include their key contributions and what inspires you about them. Use your own words.",
    submittedCount: 15, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2025-04-13 09:15 AM",
    status: "ACTIVE", createdAt: "2025-04-11",
  },
  {
    id: "hw3", title: "Newton's Laws – Problem Set", subject: "Science",
    className: "Class 8-A", section: "A", dueDate: "2025-04-22",
    description: "Solve the 10 numerical problems based on Newton's First, Second and Third laws. Draw free-body diagrams wherever required.",
    attachmentName: "Newtons_Laws_Problems.pdf", attachmentUrl: "#",
    submittedCount: 8, totalCount: 42,
    waNotifyStatus: "NOT_SENT",
    status: "ACTIVE", createdAt: "2025-04-14",
  },
  {
    id: "hw4", title: "Map Work – Rivers of India", subject: "Geography",
    className: "Class 8-A", section: "A", dueDate: "2025-04-17",
    description: "On the outline map of India, mark and label 10 major rivers. Use blue colour for rivers. Also mention the states they flow through.",
    submittedCount: 33, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2025-04-10 11:00 AM",
    status: "ACTIVE", createdAt: "2025-04-10",
  },
  // Past
  {
    id: "hw5", title: "Fractions Revision Sheet", subject: "Mathematics",
    className: "Class 8-A", section: "A", dueDate: "2025-04-07",
    description: "Complete the 20-question revision sheet on fractions and decimals. All working must be shown in the worksheet itself.",
    attachmentName: "Fractions_Revision.pdf", attachmentUrl: "#",
    submittedCount: 40, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2025-04-03 08:45 AM",
    status: "PAST", createdAt: "2025-04-01",
  },
  {
    id: "hw6", title: "Letter Writing – Formal Letter", subject: "English",
    className: "Class 8-A", section: "A", dueDate: "2025-04-05",
    description: "Write a formal letter to the Principal requesting for an extra library period every week. Follow the proper format.",
    submittedCount: 38, totalCount: 42,
    waNotifyStatus: "SENT", waNotifiedAt: "2025-04-01 09:00 AM",
    status: "PAST", createdAt: "2025-03-30",
  },
  {
    id: "hw7", title: "Periodic Table – First 20 Elements", subject: "Science",
    className: "Class 8-A", section: "A", dueDate: "2025-04-03",
    description: "Memorise the first 20 elements of the periodic table with their symbol, atomic number and atomic mass. Write them 3 times each.",
    submittedCount: 35, totalCount: 42,
    waNotifyStatus: "SENT",
    status: "PAST", createdAt: "2025-03-28",
  },
];

export const MOCK_MATERIALS: StudyMaterial[] = [
  { id: "m1", title: "Chapter 5 Full Notes", subject: "Mathematics", className: "Class 8-A", section: "A", type: "FILE", fileType: "PDF", fileName: "Math_Ch5_Notes.pdf", description: "Complete notes for Chapter 5 – Quadratic Equations with solved examples.", uploadedAt: "2025-04-12", size: "2.4 MB" },
  { id: "m2", title: "Newton's Laws – Video Explanation", subject: "Science", className: "Class 8-A", section: "A", type: "LINK", fileType: "LINK", url: "https://youtube.com", description: "Khan Academy video covering all three of Newton's laws with animations.", uploadedAt: "2025-04-11", },
  { id: "m3", title: "India Map – Practice Sheet", subject: "Geography", className: "Class 8-A", section: "A", type: "FILE", fileType: "PDF", fileName: "India_Map_Practice.pdf", description: "Blank outline map of India for practice.", uploadedAt: "2025-04-10", size: "1.1 MB" },
  { id: "m4", title: "English Grammar Reference", subject: "English", className: "Class 8-A", section: "A", type: "FILE", fileType: "DOC", fileName: "Grammar_Reference.docx", description: "Quick reference guide for formal and informal letter formats.", uploadedAt: "2025-04-09", size: "340 KB" },
  { id: "m5", title: "Periodic Table Poster", subject: "Science", className: "Class 8-A", section: "A", type: "FILE", fileType: "IMAGE", fileName: "Periodic_Table.png", description: "High-resolution periodic table with all 118 elements.", uploadedAt: "2025-04-08", size: "3.2 MB" },
  { id: "m6", title: "NCERT Solutions – Chapter 5", subject: "Mathematics", className: "Class 8-A", section: "A", type: "LINK", fileType: "LINK", url: "https://ncert.nic.in", description: "Official NCERT solutions for Class 8 Mathematics Chapter 5.", uploadedAt: "2025-04-07", },
];

// ── Hook ──────────────────────────────────────────────────────────────────
export type HomeworkTab = "active" | "past" | "materials";
export type ModalState =
  | { type: "none" }
  | { type: "assign" }
  | { type: "edit"; id: string }
  | { type: "confirmAssign"; data: Record<string, unknown> }
  | { type: "deleteHomework"; id: string }
  | { type: "uploadMaterial" }
  | { type: "deleteMaterial"; id: string };

export const useHomework = () => {
  const [tab, setTab] = useState<HomeworkTab>("active");
  const [homework, setHomework] = useState<HomeworkItem[]>(MOCK_HOMEWORK);
  const [materials, setMaterials] = useState<StudyMaterial[]>(MOCK_MATERIALS);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [reminderSent, setReminderSent] = useState<Set<string>>(new Set());

  const activeHomework = useMemo(() => homework.filter((h) => h.status === "ACTIVE"), [homework]);
  const pastHomework   = useMemo(() => homework.filter((h) => h.status === "PAST"),   [homework]);

  const deleteHomework = (id: string) => {
    setHomework((prev) => prev.filter((h) => h.id !== id));
    setModal({ type: "none" });
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    setModal({ type: "none" });
  };

  const sendReminder = (id: string) => {
    setReminderSent((prev) => new Set([...prev, id]));
    setHomework((prev) => prev.map((h) =>
      h.id === id ? { ...h, waNotifyStatus: "SENT" as const, waNotifiedAt: new Date().toLocaleString() } : h
    ));
  };

  return {
    tab, setTab,
    activeHomework, pastHomework, materials,
    modal, setModal,
    reminderSent, sendReminder,
    deleteHomework, deleteMaterial,
  };
};
