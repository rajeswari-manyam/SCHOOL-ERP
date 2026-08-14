import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { getAllStaff } from "@/services/staff.api";
import {
  getAllHomework,
  createHomework as createHomeworkApi,
  updateHomeworkById,
  deleteHomeworkById,
} from "@/services/homework.api";
import {
  getStudyMaterialsByFilter,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
} from "@/services/studymaterial.api";
import type {
  HomeworkState,
  ModalState,
  CreateHomeworkPayload,
  UpdateHomeworkPayload,
  CreateStudyMaterialPayload,
  HomeworkItem,
  StudyMaterial,
} from "../types/homework.types";

// ── helpers ───────────────────────────────────────────────────────────────────

type WANotifyStatus = "SENT" | "NOT_SENT" | "SENDING";
type HomeworkStatus = "ACTIVE" | "PAST";

const toStatus = (dueDate: string, isPublished: boolean): HomeworkStatus => {
  if (!isPublished) return "PAST";
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due >= now ? "ACTIVE" : "PAST";
};

import type { Homework } from "@/services/homework.api";

/** Map raw API Homework → HomeworkItem UI model */
const transform = (h: Homework): HomeworkItem => ({
  id:    h.id,
  title: h.title,

  classId:    h.class_id    ?? "",
  sectionId:  h.section_id  ?? "",
  subjectId:  h.subject_id  ?? "",

  // Use enriched nested names, fall back to raw IDs
  subject:   h.subject?.subject_name ?? h.subject_id  ?? "",
  className: h.class?.class_name     ?? h.class_id    ?? "",
  section:   h.section?.sectionName  ?? h.section_id  ?? "",

  dueDate:        h.submission_date,
  description:    h.description,
  attachmentName: h.attachments?.[0]?.split("/").pop(),
  attachmentUrl:  h.attachments?.[0],
  attachments:    h.attachments ?? [],
  submittedCount: 0,
  totalCount:     0,
  waNotifyStatus: "NOT_SENT" as WANotifyStatus,
  status:          toStatus(h.submission_date, h.is_published),
  createdAt:       h.createdAt,
  isPublished:     h.is_published,
  academicYearId:  h.academicYearId,
  teacher_id:      h.teacher_id,
  submission_type: h.submission_type,
});

// ── Teacher ID resolution (cached) ────────────────────────────────────────────

const CACHED_TEACHER_ID_KEY = "teacherStaffId";

export const fetchTeacherId = async (phone: string): Promise<string> => {
  const cached = localStorage.getItem(CACHED_TEACHER_ID_KEY);
  if (cached) return cached;

  try {
    const res = await getAllStaff();
    const list = Array.isArray(res.data) ? res.data : [];
    const normalizedPhone = phone.replace(/\D/g, "");
    const match = list.find(
      (s) => (s.phone ?? "").replace(/\D/g, "") === normalizedPhone
    );
    if (match?.id) {
      localStorage.setItem(CACHED_TEACHER_ID_KEY, match.id);
      return match.id;
    }
    return "";
  } catch {
    return "";
  }
};

export const clearCachedTeacherId = (): void => {
  localStorage.removeItem(CACHED_TEACHER_ID_KEY);
};

// ── Query key factory ─────────────────────────────────────────────────────────

export const HOMEWORK_KEYS = {
  all:       ["homework"] as const,
  teacher:   () => [...HOMEWORK_KEYS.all, "teacherId"] as const,
  list:      (teacherId: string) => [...HOMEWORK_KEYS.all, "list", teacherId] as const,
  materials: () => [...HOMEWORK_KEYS.all, "materials"] as const,
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useHomework = (): HomeworkState => {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const phone       = user?.phone     ?? "";
  const fallbackId  = user?.id        ?? "";
  const schoolCode  = user?.schoolcode ?? "";

  const [tab,          setTab]          = useState<"active" | "past" | "materials">("active");
  const [modal,        setModal]        = useState<ModalState>({ type: "none" });
  const [reminderSent, setReminderSent] = useState<Set<string>>(new Set());

  // Resolve real staff UUID from phone number
  const { data: teacherId = fallbackId } = useQuery({
    queryKey: HOMEWORK_KEYS.teacher(),
    queryFn:  () => fetchTeacherId(phone),
    staleTime: Infinity,
    retry: 1,
    enabled: !!phone,
  });

  const queryEnabled = !!teacherId;

  // ── Fetch homework list ───────────────────────────────────────────────────
  const {
    data: rawList,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: HOMEWORK_KEYS.list(teacherId),
    queryFn: async () => {
      const res = await getAllHomework({ teacher_id: teacherId });
      return (res.data ?? []).map(transform);
    },
    staleTime: 1000 * 60 * 3,
    retry: 2,
    enabled: queryEnabled,
  });

  // ── Fetch study materials ────────────────────────────────────────────────
  const {
    data: materials = [],
    isError: isMaterialsError,
    refetch: refetchMaterials,
  } = useQuery({
    queryKey: HOMEWORK_KEYS.materials(),
    queryFn: async () => {
      const res = await getStudyMaterialsByFilter({ teacher_id: teacherId });
      return (res.data ?? []).map((item: any): StudyMaterial => ({
        id: item.id,
        title: item.title ?? "",
        subject:   item.subject?.name   ?? item.subject?.subject_name ?? item.subject_id  ?? "",
        className: item.class?.name     ?? item.class?.class_name     ?? item.class_id    ?? "",
        section:   item.section?.name   ?? item.section?.sectionName  ?? item.section_id  ?? "",
        type: item.upload_type === "link" ? "LINK" : "FILE",
        fileType: item.upload_type === "link" ? "LINK" : "PDF",
        url: item.open_link ?? item.pdf ?? undefined,
        description: item.description,
        uploadedAt: item.upload_date
          ? new Date(item.upload_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
          : "",
        download: item.download,
        openLink: item.open_link,
        pdf: item.pdf,
        open_link: item.open_link,
        upload_type: item.upload_type,
        class: item.class,
        teacher: item.teacher,
        upload_date: item.upload_date,
      }));
    },
    staleTime: 1000 * 60 * 3,
    retry: 0,
    enabled: !!teacherId && tab === "materials",
  });

  const data           = rawList;
  const activeHomework = useMemo(() => (data ?? []).filter((h) => h.status === "ACTIVE"), [data]);
  const pastHomework   = useMemo(() => (data ?? []).filter((h) => h.status === "PAST"),   [data]);

  // ── Invalidation helper ───────────────────────────────────────────────────
  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.list(teacherId), refetchType: "all" });
    // HomeworkPage also runs a second, independent query ("homework"/"byClass"/…)
    // whenever a class filter is active — without this, a newly created/edited/
    // deleted homework never shows up while that filter is selected, since only
    // the unfiltered list query above gets refetched.
    queryClient.invalidateQueries({ queryKey: ["homework", "byClass"], refetchType: "all" });
  }, [queryClient, teacherId]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { mutateAsync: doCreate, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateHomeworkPayload) => createHomeworkApi(payload),
    onSuccess: () => { invalidateList(); setModal({ type: "none" }); },
  });

  const { mutateAsync: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHomeworkPayload }) =>
      updateHomeworkById(id, payload),
    onSuccess: () => { invalidateList(); setModal({ type: "none" }); },
  });

  const { mutateAsync: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteHomeworkById(id),
    onSuccess: () => { invalidateList(); setModal({ type: "none" }); },
  });

  // ── Reminder (optimistic) ─────────────────────────────────────────────────
  const sendReminder = useCallback(async (id: string) => {
    setReminderSent((prev) => new Set([...prev, id]));
    try {
      // wire to reminder endpoint when available
    } catch {
      setReminderSent((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  }, []);

  // ── Material upload & delete ─────────────────────────────────────────────
  const uploadMaterial = useCallback(async (payload: CreateStudyMaterialPayload) => {
    const formData = new FormData();
    formData.append("class_id", payload.class_id);
    formData.append("section_id", payload.section_id);
    formData.append("subject_id", payload.subject_id);
    formData.append("teacher_id", payload.teacher_id);
    formData.append("title", payload.title);
    formData.append("upload_date", payload.upload_date);
    formData.append("upload_type", payload.upload_type);
    formData.append("download", "0");
    if (payload.description) formData.append("description", payload.description);
    if (payload.open_link) formData.append("open_link", payload.open_link);
    if (payload.pdf) formData.append("pdf", payload.pdf);
    await createStudyMaterial(formData);
    queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.materials(), refetchType: "all" });
  }, [queryClient]);

  const updateMaterial = useCallback(async (id: string, payload: CreateStudyMaterialPayload) => {
    const formData = new FormData();
    formData.append("class_id", payload.class_id);
    formData.append("section_id", payload.section_id);
    formData.append("subject_id", payload.subject_id);
    formData.append("teacher_id", payload.teacher_id);
    formData.append("title", payload.title);
    formData.append("upload_date", payload.upload_date);
    formData.append("upload_type", payload.upload_type);
    if (payload.description) formData.append("description", payload.description);
    if (payload.open_link) formData.append("open_link", payload.open_link);
    if (payload.pdf) formData.append("pdf", payload.pdf);
    await updateStudyMaterial(id, formData);
    queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.materials(), refetchType: "all" });
  }, [queryClient]);

  const deleteMaterial = useCallback(async (id: string) => {
    await deleteStudyMaterial(id);
    queryClient.invalidateQueries({ queryKey: HOMEWORK_KEYS.materials(), refetchType: "all" });
  }, [queryClient]);

  return {
    tab, setTab,
    teacherId,
    schoolCode,
    data,
    activeHomework,
    pastHomework,
    materials,
    isMaterialsError,
    refetchMaterials,
    isLoading,
    isError,
    error,
    refetch,
    modal, setModal,
    reminderSent, sendReminder,
    createHomework: (payload) => doCreate(payload).then(() => undefined),
    updateHomework: (id, payload) => doUpdate({ id, payload }).then(() => undefined),
    deleteHomework: (id) => doDelete(id).then(() => undefined),
    uploadMaterial,
    updateMaterial,
    deleteMaterial,
    isCreating,
    isUpdating,
    isDeleting,
  };
};