import { create } from "zustand";
import type { Complaint, ComplaintCategory } from "../types/complaints.types";
import { generateReferenceNo } from "../data/complaimts.data";

interface ComplaintsState {
  current: Complaint;
  submitted: Complaint[];
  setSubject: (subject: string) => void;
  setCategory: (category: ComplaintCategory) => void;
  setDescription: (description: string) => void;
  toggleAttachee: (childId: string) => void;
  setPhoto: (file: File | null) => void;
  submitComplaint: () => void;
  resetForm: () => void;
}

const emptyComplaint = (): Complaint => ({
  id: crypto.randomUUID(),
  subject: "",
  category: "Academic",
  description: "",
  attachees: [],
  photoFile: null,
  status: "pending",
});

export const useComplaintsStore = create<ComplaintsState>((set) => ({
  current: emptyComplaint(),
  submitted: [],

  setSubject: (subject) =>
    set((s) => ({ current: { ...s.current, subject } })),

  setCategory: (category) =>
    set((s) => ({ current: { ...s.current, category } })),

  setDescription: (description) =>
    set((s) => ({ current: { ...s.current, description } })),

  toggleAttachee: (childId) =>
    set((s) => ({
      current: {
        ...s.current,
        attachees: s.current.attachees.includes(childId)
          ? s.current.attachees.filter((id) => id !== childId)
          : [...s.current.attachees, childId],
      },
    })),

  setPhoto: (file) =>
    set((s) => ({ current: { ...s.current, photoFile: file } })),

  submitComplaint: () =>
    set((s) => {
      const newComplaint: Complaint = {
        ...s.current,
        status: "submitted",
        referenceNo: generateReferenceNo(),
        submittedAt: new Date().toISOString(),
      };
      return {
        submitted: [newComplaint, ...s.submitted],
        current: emptyComplaint(),
      };
    }),

  resetForm: () =>
    set(() => ({ current: emptyComplaint() })),
}));