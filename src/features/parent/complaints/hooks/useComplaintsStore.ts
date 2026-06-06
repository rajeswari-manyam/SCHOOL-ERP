import { create } from "zustand";
import type { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from "../types/complaints.types";
import {
  createComplaint,
  getComplaintById,
  getComplaints,
  updateComplaintById,
  deleteComplaintById,
} from "../../../../services/complaint.api";

/* ─────────────────────────────────────────
   Helper: generate a local reference number
   (shown optimistically; replaced by API id)
───────────────────────────────────────── */
function generateReferenceNo(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9000) + 1000);
  return `REF-${year}-${num}`;
}

function emptyComplaint(): Complaint {
  return {
    id: crypto.randomUUID(),
    subject: "",
    category: "Academic",
    description: "",
    priority: "medium",
    attachees: [],
    photoFile: null,
    status: "pending",
  };
}

/* ─────────────────────────────────────────
   Store shape
───────────────────────────────────────── */
interface ComplaintsState {
  /* form state */
  current: Complaint;

  /* list state */
  submitted: Complaint[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  /* form setters */
  setSubject: (subject: string) => void;
  setCategory: (category: ComplaintCategory) => void;
  setPriority: (priority: ComplaintPriority) => void;
  setDescription: (description: string) => void;
  toggleAttachee: (childId: string) => void;
  setPhoto: (file: File | null) => void;
  resetForm: () => void;

  /* API actions */
  fetchComplaints: (params: { school_code: string }) => Promise<void>;
  submitComplaint: (params: {
    complainant_id: string;
    complainant_type: string;
    regarding_type: string;
    school_code: string;
  }) => Promise<Complaint | null>;
  refreshComplaint: (complaintId: string) => Promise<void>;
  updateComplaint: (
    complaintId: string,
    payload: { status?: ComplaintStatus; resolution?: string; priority?: ComplaintPriority }
  ) => Promise<void>;
  deleteComplaint: (complaintId: string) => Promise<void>;
}

/* ─────────────────────────────────────────
   Store implementation
───────────────────────────────────────── */
export const useComplaintsStore = create<ComplaintsState>((set, get) => ({
  current: emptyComplaint(),
  submitted: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  /* ── form setters ── */
  setSubject: (subject) =>
    set((s) => ({ current: { ...s.current, subject } })),

  setCategory: (category) =>
    set((s) => ({ current: { ...s.current, category } })),

  setPriority: (priority) =>
    set((s) => ({ current: { ...s.current, priority } })),

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

  resetForm: () => set(() => ({ current: emptyComplaint(), error: null })),

  /* ── GET all complaints ── */
  fetchComplaints: async ({ school_code }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await getComplaints(school_code);
      if (res.status) {
        const mapped: Complaint[] = res.data.map((c) => ({
          id: c.id,
          subject: c.subject,
          category: c.category as ComplaintCategory,
          description: c.description,
          priority: c.priority as ComplaintPriority,
          attachees: [c.regarding_id],
          photos: c.photos,
          status: c.status as Complaint["status"],
          referenceNo: c.id,
          submittedAt: c.createdAt,
          resolution: c.resolution,
          resolved_at: c.resolved_at,
        }));
        set({ submitted: mapped });
      }
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to fetch complaints." });
    } finally {
      set({ isLoading: false });
    }
  },

  /* ── CREATE complaint ── */
  submitComplaint: async ({ complainant_id, complainant_type, regarding_type, school_code }) => {
    const { current } = get();

    // Optimistic entry shown immediately
    const optimistic: Complaint = {
      ...current,
      status: "submitted",
      referenceNo: generateReferenceNo(),
      submittedAt: new Date().toISOString(),
    };

    set((s) => ({
      submitted: [optimistic, ...s.submitted],
      isSubmitting: true,
      error: null,
    }));

    try {
      const res = await createComplaint({
        complainant_id,
        complainant_type,
        regarding_id: current.attachees[0] ?? complainant_id,
        regarding_type,
        subject: current.subject,
        description: current.description,
        category: current.category,
        priority: current.priority,
        school_code,
        // photos: [] — upload separately if needed
      });

      if (res.status) {
        const real: Complaint = {
          ...optimistic,
          id: res.data.id,
          referenceNo: res.data.id,
          submittedAt: res.data.createdAt,
        };
        // Replace optimistic with real record
        set((s) => ({
          submitted: s.submitted.map((c) =>
            c.id === optimistic.id ? real : c
          ),
          current: emptyComplaint(),
          isSubmitting: false,
        }));
        return real;
      }
      throw new Error(res.message ?? "Create failed");
    } catch (err: any) {
      // Roll back optimistic entry
      set((s) => ({
        submitted: s.submitted.filter((c) => c.id !== optimistic.id),
        error: err?.message ?? "Failed to submit complaint.",
        isSubmitting: false,
      }));
      return null;
    }
  },

  /* ── GET single complaint (refresh) ── */
  refreshComplaint: async (complaintId) => {
    try {
      const res = await getComplaintById(complaintId);
      if (res.status) {
        const updated: Complaint = {
          id: res.data.id,
          subject: res.data.subject,
          category: res.data.category as ComplaintCategory,
          description: res.data.description,
          priority: res.data.priority as ComplaintPriority,
          attachees: [res.data.regarding_id],
          photos: res.data.photos,
          status: res.data.status as Complaint["status"],
          referenceNo: res.data.id,
          submittedAt: res.data.createdAt,
          resolution: res.data.resolution,
          resolved_at: res.data.resolved_at,
        };
        set((s) => ({
          submitted: s.submitted.map((c) => (c.id === complaintId ? updated : c)),
        }));
      }
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to refresh complaint." });
    }
  },

  /* ── UPDATE complaint ── */
  updateComplaint: async (complaintId, payload) => {
    // Optimistic update
    set((s) => ({
      submitted: s.submitted.map((c) =>
        c.id === complaintId ? { ...c, ...payload } : c
      ),
    }));
    try {
      const res = await updateComplaintById(complaintId, payload);
      if (!res.status) throw new Error(res.message ?? "Update failed");
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to update complaint." });
      // Re-fetch to restore server state
      get().refreshComplaint(complaintId);
    }
  },

  /* ── DELETE complaint ── */
  deleteComplaint: async (complaintId) => {
    // Optimistic remove
    set((s) => ({
      submitted: s.submitted.filter((c) => c.id !== complaintId),
    }));
    try {
      const res = await deleteComplaintById(complaintId);
      if (!res.status) throw new Error(res.message ?? "Delete failed");
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to delete complaint." });
      // Re-fetch full list to restore
      // Caller should pass school_code; for now just surface the error
    }
  },
}));
