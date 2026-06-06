import { useState, useEffect, useCallback } from "react";
import { getStudentById } from "../../../../services/student.api";
import type { Student as ApiStudent } from "../../../../services/student.api";
import { getAllClasses, getAllStaff } from "../../../../services/class.api";
import type { ClassRecord, StaffRecord } from "../../../../services/class.api";

import type { Student, StudentStatus, Gender } from "../types/profile.types";
import { STUDENT_DATA } from "../data/profile.mock";

/* ── Helpers ─────────────────────────────────────────────── */

const calcAge = (dob: string): number => {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
};

/* ── Mapper: ApiStudent → Student ────────────────────────── */

const mapApiStudent = (s: ApiStudent): Student => {
  const firstName = s.first_name ?? "";
  const lastName  = s.last_name  ?? "";
  const fullName  = `${firstName} ${lastName}`.trim();
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const className = s.class ? `Class ${s.class}${s.section ?? ""}` : "";

  return {
    id:             s.id,
    admissionNo:    s.admission_number ?? "",
    rollNo:         s.roll_number      ?? "",
    name:           fullName,
    avatarInitials: initials || "??",
    avatarColor:    "#4f46e5",
    status:         (s.status?.toUpperCase() as StudentStatus) ?? "ACTIVE",
    className,
    section:        s.section     ?? "",
    schoolCode:     s.school_code ?? "",
    rawClass:       s.class       ?? "",

    // placeholder — will be overwritten by useClassTeacher
    classTeacher: {
      id:             "",
      name:           "Loading…",
      title:          "",
      avatarInitials: "--",
    },

    academic: {
      academicYear: STUDENT_DATA.academic.academicYear,
      board:        STUDENT_DATA.academic.board,
      section:      s.section ?? "",
      classroom:    STUDENT_DATA.academic.classroom,
    },

    personal: {
      dateOfBirth: formatDate(s.date_of_birth) || "",
      gender:      (s.gender as Gender) ?? "Male",
      bloodGroup:  s.blood_group        ?? "",
      age:         s.date_of_birth ? calcAge(s.date_of_birth) : 0,
      fullAddress: s.address            ?? "",
    },

    quickDownloads: STUDENT_DATA.quickDownloads,
  };
};

/* ── Hook: useStudent ────────────────────────────────────── */

export function useStudent(studentId: string): {
  student: Student | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchStudent = useCallback(async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiStudent = await getStudentById(studentId);
      setStudent(mapApiStudent(apiStudent));
    } catch (err) {
      console.error("[useStudent] failed →", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetchStudent(); }, [fetchStudent]);

  return { student, loading, error, refetch: fetchStudent };
}

/* ── Hook: useDownload ───────────────────────────────────── */

export function useDownload(): {
  downloading: string | null;
  downloaded:  string | null;
  handleDownload: (id: string, title: string) => void;
} {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded,  setDownloaded]  = useState<string | null>(null);

  const handleDownload = useCallback((id: string, title: string) => {
    if (downloading) return;
    setDownloading(id);
    setDownloaded(null);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(id);
      console.info(`[Download] ${title}`);
      setTimeout(() => setDownloaded(null), 2500);
    }, 1400);
  }, [downloading]);

  return { downloading, downloaded, handleDownload };
}

/* ── Hook: useClassId ────────────────────────────────────── */

export interface UseClassIdParams {
  class_name:     string;
  section:        string;
  school_code:    string;
  academic_year?: string;
}

export function useClassId(params: UseClassIdParams): {
  classRecord:  ClassRecord | null;
  classLoading: boolean;
  classError:   string | null;
} {
  const [classRecord,  setClassRecord]  = useState<ClassRecord | null>(null);
  const [classLoading, setClassLoading] = useState(false);
  const [classError,   setClassError]   = useState<string | null>(null);

  const { class_name, section, school_code, academic_year = "2025-2026" } = params;

  useEffect(() => {
    if (!class_name || !section || !school_code) return;

    let cancelled = false;
    setClassLoading(true);
    setClassError(null);

    getAllClasses({ class: class_name, section, school_code, academic_year, status: "active" })
      .then((res) => {
        if (cancelled) return;
        if (res.status && res.data.length > 0) {
          setClassRecord(res.data[0]);
        } else {
          setClassError("No matching class found.");
        }
      })
      .catch((err) => {
        if (!cancelled) setClassError(err?.message ?? "Failed to load class.");
      })
      .finally(() => { if (!cancelled) setClassLoading(false); });

    return () => { cancelled = true; };
  }, [class_name, section, school_code, academic_year]);

  return { classRecord, classLoading, classError };
}

/* ── Hook: useClassTeacher ───────────────────────────────── */

export function useClassTeacher(params: {
  class_name: string;
  section:    string;
}): {
  teacher:        StaffRecord | null;
  teacherLoading: boolean;
  teacherError:   string | null;
} {
  const [teacher,        setTeacher]        = useState<StaffRecord | null>(null);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherError,   setTeacherError]   = useState<string | null>(null);

  const { class_name, section } = params;

  useEffect(() => {
    if (!class_name || !section) return;

    let cancelled = false;
    setTeacherLoading(true);
    setTeacherError(null);

    getAllStaff({ class: class_name, section })
      .then((res) => {
        if (cancelled) return;

        console.log("[useClassTeacher] class_name:", class_name, "section:", section);
        console.log("[useClassTeacher] target:", `${class_name}-${section}`);
        console.log("[useClassTeacher] API response:", res);
        console.log("[useClassTeacher] staff list:", res.data.map(s => ({ name: s.name, class_teacher_of: s.class_teacher_of })));

        if (res.status && res.data.length > 0) {
          const target = `${class_name}-${section}`;
          const classTeacher = res.data.find(
            (s) => s.class_teacher_of === target
          );
          console.log("[useClassTeacher] matched teacher:", classTeacher);

          if (classTeacher) {
            setTeacher(classTeacher);
          } else {
            setTeacherError("No class teacher assigned.");
          }
        } else {
          setTeacherError("No teacher found.");
        }
      })
      .catch((err) => {
        if (!cancelled) setTeacherError(err?.message ?? "Failed to load teacher.");
      })
      .finally(() => { if (!cancelled) setTeacherLoading(false); });

    return () => { cancelled = true; };
  }, [class_name, section]);

  return { teacher, teacherLoading, teacherError };
}