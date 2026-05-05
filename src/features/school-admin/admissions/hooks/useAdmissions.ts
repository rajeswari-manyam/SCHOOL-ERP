import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { admissionsApi } from "../api/admissions.api";
import type {
  Admission,
  AdmissionStage,
  AdmissionStats,
  AddEnquiryFormData,
  ConfirmAdmissionFormData,
} from "../types/Admissions.types";

// ─── useAdmissions ────────────────────────────────────────────────────────────

export const useAdmissions = () => {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    admissionsApi.getAll().then(data => {
      setAdmissions(data);
      setLoading(false);
    });
  }, []);

  // Computed pipeline columns
  const byStage = useMemo(() => {
    const map: Record<AdmissionStage, Admission[]> = {
      ENQUIRY: [],
      INTERVIEW: [],
      DOCS_VERIFIED: [],
      CONFIRMED: [],
      DECLINED: [],
    };
    admissions.forEach(a => map[a.stage].push(a));
    return map;
  }, [admissions]);

  // Stats
  const stats: AdmissionStats = useMemo(() => {
    const total = admissions.length;
    const confirmed = byStage.CONFIRMED.length;
    return {
      enquiries: total,
      interviews: byStage.INTERVIEW.length,
      docsVerified: byStage.DOCS_VERIFIED.length,
      confirmed,
      declined: byStage.DECLINED.length,
      conversionRate: total > 0 ? Math.round((confirmed / total) * 100) : 0,
    };
  }, [admissions, byStage]);

  // Selected admission
  const selected = useMemo(
    () => admissions.find(a => a.id === selectedId) ?? null,
    [admissions, selectedId]
  );

  // ─── Actions ───────────────────────────────────────────────────────────────

  const addEnquiry = async (data: AddEnquiryFormData) => {
    const created = await admissionsApi.create(data);
    setAdmissions(prev => [created, ...prev]);
    return created;
  };

  const moveToInterview = async (id: string, date?: string, time?: string) => {
    const updated = await admissionsApi.moveToInterview(id, date, time);
    setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
  };

  const moveToDocs = async (id: string) => {
    const updated = await admissionsApi.moveToDocs(id);
    setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
  };

  const confirmAdmission = async (id: string, data: ConfirmAdmissionFormData) => {
    const updated = await admissionsApi.confirmAdmission(id, data);
    setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  };

  const declineAdmission = async (id: string, reason: string) => {
    const updated = await admissionsApi.declineAdmission(id, reason);
    setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
  };

  const toggleDocVerified = async (admissionId: string, docId: string) => {
    const updated = await admissionsApi.toggleDocVerified(admissionId, docId);
    setAdmissions(prev => prev.map(a => a.id === admissionId ? updated : a));
  };

  const sendWhatsApp = async (id: string, type: "enquiry" | "welcome") => {
    const updated = await admissionsApi.markWhatsappSent(id, type);
    setAdmissions(prev => prev.map(a => a.id === id ? updated : a));
  };

  return {
    admissions,
    byStage,
    stats,
    loading,
    selected,
    selectedId,
    setSelectedId,
    // actions
    addEnquiry,
    moveToInterview,
    moveToDocs,
    confirmAdmission,
    declineAdmission,
    toggleDocVerified,
    sendWhatsApp,
  };
};

// ─── Update application status ─────────────────────────────────────────────────
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      remarks,
    }: {
      id: string;
      status: "approved" | "rejected";
      remarks?: string;
    }) => admissionsApi.updateApplicationStatus(id, status, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
  });
};