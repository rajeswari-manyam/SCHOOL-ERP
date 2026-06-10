import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { studentsApi, MOCK_ATTENDANCE, MOCK_FEE_PAYMENTS, MOCK_DOCUMENTS } from "../api/students.api";
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

  const loadStudents = useCallback(() => {
    setLoading(true);
    setError(null);

    const doLoad = async () => {
      try {
        const data = await withTimeout(
          studentsApi.getAll(),
          LOAD_TIMEOUT_MS,
          "getAllStudents"
        );
        if (mountedRef.current) {
          setStudents(data);
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
      void loadStudents();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadStudents]);

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
    const thisMonth = students.filter(s => s.admittedOn?.includes("2025")).length;
    const pending = students.filter(s => s.feeStatus === "PENDING" || s.feeStatus === "OVERDUE").length;
    return { totalActive: active, transferredOut: transferred, newThisMonth: thisMonth, pendingTC: pending };
  }, [students]);

  const addStudent = async (data: AddStudentFormData) => {
    if (!schoolcode) {
      throw new Error("Unable to create student: missing school code.");
    }

    const payload: CreateStudentPayload = {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      gender: (data.gender || "Male").toLowerCase() as Lowercase<Gender>,
      date_of_birth: data.dob,
      admission_date: new Date().toISOString().split("T")[0],
      school_code: schoolcode,
      ...(data.bloodGroup ? { blood_group: data.bloodGroup } : {}),
      ...(data.residentialAddress ? { address: data.residentialAddress } : {}),
      ...(data.photo ? { photo: data.photo as unknown as string } : {}),
      ...(data.class ? { class: data.class } : {}),
      ...(data.section ? { section: data.section } : {}),
      ...(data.rollNumber ? { roll_number: data.rollNumber } : {}),
      ...(data.admissionNo ? { admission_number: data.admissionNo } : {}),
    } as CreateStudentPayload;

    const newS = await withTimeout(
      studentsApi.createStudent(payload),
      LOAD_TIMEOUT_MS,
      "createStudent"
    );
    if (mountedRef.current) {
      setStudents(prev => [...prev, newS]);
    }
    return newS;
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

  return {
    students, filtered, loading, error, stats,
    search, setSearch,
    classFilter, setClassFilter,
    sectionFilter, setSectionFilter,
    statusFilter, setStatusFilter,
    addStudent,
    updateStudent,
    loadStudents,
  };
};

export const useStudentProfile = (id: string) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const s = await withTimeout(
          studentsApi.getById(id),
          LOAD_TIMEOUT_MS,
          `getStudentById(${id})`
        );
        setStudent(s ?? null);
        setLoading(false);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load student";
        setError(message);
        setLoading(false);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);

  return {
    student, loading, error,
    attendance: MOCK_ATTENDANCE,
    feePayments: MOCK_FEE_PAYMENTS,
    documents: MOCK_DOCUMENTS,
  };
};