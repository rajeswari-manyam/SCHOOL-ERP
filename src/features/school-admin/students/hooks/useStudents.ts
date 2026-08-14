import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { studentsApi, buildClassSectionMaps, resolveStudentNames } from "@/services/student.api";
import { getPendingFeesByStudentId, getPaymentsByStudentId } from "@/services/fee.api";
import type { StudentFeeSummaryResponse, PaymentsByStudentData } from "@/services/fee.api";
import type { Student, AddStudentFormData, CreateStudentPayload, UpdateStudentPayload, Gender } from "../types/student.types";

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${label} exceeded ${ms}ms`)), ms)
    ),
  ]);

const LOAD_TIMEOUT_MS = 30_000;

export const useStudents = () => {
  const schoolcode = useAuthStore((s) => s.user?.schoolcode ?? "");
  const academicYearId = useUIStore((s) => s.academicYearId);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const loadStudents = useCallback((yearId?: string | null) => {
    setLoading(true);
    setError(null);

    const doLoad = async () => {
      try {
        const [data, { classMap, sectionMap }] = await Promise.all([
          withTimeout(studentsApi.getAll(yearId), LOAD_TIMEOUT_MS, "getAllStudents"),
          withTimeout(
            buildClassSectionMaps(yearId ?? null),
            LOAD_TIMEOUT_MS,
            "buildClassSectionMaps",
          ),
        ]);
        if (mountedRef.current) {
          setStudents(resolveStudentNames(data, classMap, sectionMap));
          setLoading(false);
        }
      } catch (err: unknown) {
        if (mountedRef.current) {
          const message = err instanceof Error ? err.message : "Failed to load students";
          setError(message);
          setLoading(false);
        }
      }
    };

    void doLoad();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStudents(academicYearId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadStudents, academicYearId]);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = !search || 
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === "All" || s.class === classFilter;
      const matchSection = sectionFilter === "All" || s.section === sectionFilter;
      const matchStatus = statusFilter === "All" ||
        (statusFilter === "Active" && s.status === "ACTIVE") ||
        (statusFilter === "Transferred" && s.status === "TRANSFERRED");
      return matchSearch && matchClass && matchSection && matchStatus;
    });
  }, [students, search, classFilter, sectionFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = students.filter(s => s.status === "ACTIVE").length;
    const transferred = students.filter(s => s.status === "TRANSFERRED").length;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonth = students.filter(s => s.admittedOn?.startsWith(currentMonth)).length;
    const pending = students.filter(s => s.feeStatus === "PENDING" || s.feeStatus === "OVERDUE").length;
    return { totalActive: active, transferredOut: transferred, newThisMonth: thisMonth, pendingTC: pending };
  }, [students]);

  const addStudent = async (data: AddStudentFormData) => {
    if (!schoolcode) {
      throw new Error("Unable to create student: missing school code.");
    }

    const academicYearId = useUIStore.getState().academicYearId;

    const payload: CreateStudentPayload = {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      gender: (data.gender || "Male").toLowerCase() as Lowercase<Gender>,
      date_of_birth: data.dob,
      admission_date: new Date().toISOString().split("T")[0],
      school_code: schoolcode,
      ...(data.bloodGroup ? { blood_group: data.bloodGroup } : {}),
      ...(data.residentialAddress ? { address: data.residentialAddress } : {}),
      ...(data.photo ? { photo: data.photo } : {}),
      ...(data.class_id ? { class_id: data.class_id } : {}),
      ...(data.sectionId ? { sectionId: data.sectionId } : {}),
      ...(data.rollNumber ? { roll_number: data.rollNumber } : {}),
      ...(data.admissionNo ? { admission_number: data.admissionNo } : {}),
      ...(academicYearId ? { academicYearId } : {}),
    } as CreateStudentPayload;

    const newS = await withTimeout(
      studentsApi.createStudent(payload),
      LOAD_TIMEOUT_MS,
      "createStudent"
    );
    if (mountedRef.current) {
      setStudents(prev => [...prev, { ...newS, class: data.class, section: data.section }]);
    }
    return { ...newS, class: data.class, section: data.section };
  };

  const updateStudent = async (id: string, payload: UpdateStudentPayload) => {
    const updated = await withTimeout(
      studentsApi.updateStudent(id, payload),
      LOAD_TIMEOUT_MS,
      "updateStudent"
    );
    if (mountedRef.current) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    }
    return updated;
  };

  const deleteStudent = async (id: string) => {
    await withTimeout(
      studentsApi.deleteStudent(id),
      LOAD_TIMEOUT_MS,
      "deleteStudent"
    );
    if (mountedRef.current) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  return {
    students, filtered, loading, error, stats,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    addStudent,
    updateStudent,
    deleteStudent,
    loadStudents,
  };
};

// Query keys centralized here so `retry()` below can invalidate precisely,
// and so the fee-history-only payments query (gated on `activeTab`) shares
// the same per-student namespace as the base student/fee-summary queries.
const studentProfileKeys = {
  all: (id: string) => ["student-profile", id] as const,
  detail: (id: string) => ["student-profile", id, "detail"] as const,
  feeSummary: (id: string) => ["student-profile", id, "fee-summary"] as const,
  feePayments: (id: string) => ["student-profile", id, "fee-payments"] as const,
};

/**
 * @param activeTab   Which tab of the Student Profile page is open. Optional
 *                     because this hook may be used from places without a
 *                     tab concept — when omitted, the fee-history-only
 *                     `feePayments` fetch simply stays disabled. `student`
 *                     and `feeSummary` are needed by multiple tabs (header,
 *                     Overview's outstanding-fee card, Fee History), so they
 *                     stay ungated like the base queries in useLedger.
 */
export const useStudentProfile = (id: string, activeTab?: string) => {
  const queryClient = useQueryClient();
  const enabledBase = !!id;

  const studentQuery = useQuery({
    queryKey: studentProfileKeys.detail(id),
    queryFn: async (): Promise<Student | null> => {
      const s = await withTimeout(studentsApi.getById(id), LOAD_TIMEOUT_MS, `getStudentById(${id})`);
      return s ?? null;
    },
    enabled: enabledBase,
  });

  const feeSummaryQuery = useQuery({
    queryKey: studentProfileKeys.feeSummary(id),
    queryFn: async (): Promise<StudentFeeSummaryResponse["data"] | null> => {
      const res = await getPendingFeesByStudentId(id).catch(() => null);
      return res?.data ?? null;
    },
    enabled: enabledBase,
  });

  const feePaymentsQuery = useQuery({
    queryKey: studentProfileKeys.feePayments(id),
    queryFn: async (): Promise<PaymentsByStudentData | null> => {
      const res = await getPaymentsByStudentId(id).catch(() => null);
      return res?.data ?? null;
    },
    enabled: enabledBase && activeTab === "fee-history",
  });

  const retry = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: studentProfileKeys.all(id) });
  }, [id, queryClient]);

  const loading = studentQuery.isLoading || feeSummaryQuery.isLoading;
  const error = studentQuery.isError
    ? (studentQuery.error instanceof Error ? studentQuery.error.message : "Failed to load student")
    : null;

  return {
    student: studentQuery.data ?? null,
    loading,
    error,
    retry,
    feeSummary: feeSummaryQuery.data ?? null,
    feePayments: feePaymentsQuery.data ?? null,
  };
};