import { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "@/store/authStore";
import { studentsApi, MOCK_ATTENDANCE, MOCK_FEE_PAYMENTS, MOCK_DOCUMENTS } from "../api/students.api";
import type { Student, AddStudentFormData, CreateStudentPayload, UpdateStudentPayload, Gender } from "../types/student.types";

export const useStudents = () => {
  const schoolcode = useAuthStore((s) => s.user?.schoolcode ?? "");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadStudents = () => {
    setLoading(true);
    setError(null);
    studentsApi.getAll().then(data => {
      setStudents(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to load students", err);
      setError(err?.message || "Failed to load students. Please try again.");
      setLoading(false);
    });
  };

  useEffect(() => {
    loadStudents();
  }, []);

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

    const newS = await studentsApi.createStudent(payload);
    setStudents(prev => [...prev, newS]);
    return newS;
  };

  const updateStudent = async (id: string, payload: UpdateStudentPayload) => {
    const updated = await studentsApi.updateStudent(id, payload);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
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

  useEffect(() => {
    studentsApi.getById(id).then(s => {
      setStudent(s ?? null);
      setLoading(false);
    });
  }, [id]);

  return {
    student, loading,
    attendance: MOCK_ATTENDANCE,
    feePayments: MOCK_FEE_PAYMENTS,
    documents: MOCK_DOCUMENTS,
  };
};