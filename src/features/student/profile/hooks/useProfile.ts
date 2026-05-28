// import { useState, useEffect, useCallback } from "react";
// import { getstudentsById } from "../../../../services/parent.api";
// import type { Student as ApiStudent } from "../../../../services/parent.api";
// import type { Student, StudentStatus, Gender } from "../types/profile.types";
// import { STUDENT_DATA } from "../data/profile.mock";

// /* ── Helpers ─────────────────────────────────────────────── */

// const calcAge = (dob: string): number => {
//   const birth = new Date(dob);
//   const today = new Date();
//   let age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//   return age;
// };

// const formatDate = (dateStr: string): string => {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleDateString("en-IN", {
//     day: "numeric", month: "long", year: "numeric",
//   });
// };

// /* ── Mapper: ApiStudent → Student ────────────────────────── */

// const mapApiStudent = (s: ApiStudent): Student => {
//   const firstName = s.first_name ?? "";
//   const lastName  = s.last_name  ?? "";
//   const fullName  = `${firstName} ${lastName}`.trim();
//   const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
//   const className = s.class ? `Class ${s.class}${s.section ?? ""}` : STUDENT_DATA.className;

//   return {
//     id:             s.id,
//     admissionNo:    s.admission_number ?? STUDENT_DATA.admissionNo,
//     rollNo:         s.roll_number      ?? STUDENT_DATA.rollNo,
//     name:           fullName           || STUDENT_DATA.name,
//     avatarInitials: initials           || STUDENT_DATA.avatarInitials,
//     avatarColor:    STUDENT_DATA.avatarColor,
//     status:         (s.status as StudentStatus) ?? "ACTIVE",
//     className,
//     section:        s.section ?? STUDENT_DATA.section,

//     // Class teacher not in student API — keep mock
//     classTeacher: STUDENT_DATA.classTeacher,

//     academic: {
//       academicYear: STUDENT_DATA.academic.academicYear,
//       board:        STUDENT_DATA.academic.board,
//       section:      s.section ?? STUDENT_DATA.academic.section,
//       classroom:    STUDENT_DATA.academic.classroom,
//     },

//     personal: {
//       dateOfBirth: formatDate(s.date_of_birth) || STUDENT_DATA.personal.dateOfBirth,
//       gender:      (s.gender as Gender)        ?? STUDENT_DATA.personal.gender,
//       bloodGroup:  s.blood_group               ?? STUDENT_DATA.personal.bloodGroup,
//       age:         s.date_of_birth ? calcAge(s.date_of_birth) : STUDENT_DATA.personal.age,
//       fullAddress: s.address                   ?? STUDENT_DATA.personal.fullAddress,
//       // Parent fields not in student API — keep mock
//       fatherName:  STUDENT_DATA.personal.fatherName,
//       fatherPhone: STUDENT_DATA.personal.fatherPhone,
//       motherName:  STUDENT_DATA.personal.motherName,
//       motherPhone: STUDENT_DATA.personal.motherPhone,
//     },

//     quickDownloads: STUDENT_DATA.quickDownloads,
//   };
// };

// /* ── Hook: useStudent ────────────────────────────────────── */

// export function useStudent(studentId: string): {
//   student: Student;
//   loading: boolean;
//   error: string | null;
//   refetch: () => void;
// } {
//   const [student, setStudent] = useState<Student>(STUDENT_DATA);
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState<string | null>(null);

//   const fetch = useCallback(async () => {
//     if (!studentId) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const apiStudent = await getstudentsById(studentId);
//       setStudent(mapApiStudent(apiStudent));
//     } catch {
//       setError("Failed to load profile. Showing cached data.");
//     } finally {
//       setLoading(false);
//     }
//   }, [studentId]);

//   useEffect(() => { fetch(); }, [fetch]);

//   return { student, loading, error, refetch: fetch };
// }

// /* ── Hook: useDownload ───────────────────────────────────── */

// export function useDownload(): {
//   downloading: string | null;
//   downloaded:  string | null;
//   handleDownload: (id: string, title: string) => void;
// } {
//   const [downloading, setDownloading] = useState<string | null>(null);
//   const [downloaded,  setDownloaded]  = useState<string | null>(null);

//   const handleDownload = useCallback((id: string, title: string) => {
//     if (downloading) return;
//     setDownloading(id);
//     setDownloaded(null);
//     setTimeout(() => {
//       setDownloading(null);
//       setDownloaded(id);
//       console.info(`[Download] ${title}`);
//       setTimeout(() => setDownloaded(null), 2500);
//     }, 1400);
//   }, [downloading]);

//   return { downloading, downloaded, handleDownload };
// }



import { useState, useEffect, useCallback } from "react";
import { getstudentsById } from "../../../../services/parent.api";
import type { Student as ApiStudent } from "../../../../services/parent.api";

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
  const className = s.class ? `Class ${s.class}${s.section ?? ""}` : STUDENT_DATA.className;

  return {
    id:             s.id,
    admissionNo:    s.admission_number ?? STUDENT_DATA.admissionNo,
    rollNo:         s.roll_number      ?? STUDENT_DATA.rollNo,
    name:           fullName           || STUDENT_DATA.name,
    avatarInitials: initials           || STUDENT_DATA.avatarInitials,
    avatarColor:    STUDENT_DATA.avatarColor,
    status:         (s.status as StudentStatus) ?? "ACTIVE",
    className,
    section:        s.section ?? STUDENT_DATA.section,

    // Class teacher not in student API — keep mock
    classTeacher: STUDENT_DATA.classTeacher,

    academic: {
      academicYear: STUDENT_DATA.academic.academicYear,
      board:        STUDENT_DATA.academic.board,
      section:      s.section ?? STUDENT_DATA.academic.section,
      classroom:    STUDENT_DATA.academic.classroom,
    },

    personal: {
      dateOfBirth: formatDate(s.date_of_birth) || STUDENT_DATA.personal.dateOfBirth,
      gender:      (s.gender as Gender)        ?? STUDENT_DATA.personal.gender,
      bloodGroup:  s.blood_group               ?? STUDENT_DATA.personal.bloodGroup,
      age:         s.date_of_birth ? calcAge(s.date_of_birth) : STUDENT_DATA.personal.age,
      fullAddress: s.address                   ?? STUDENT_DATA.personal.fullAddress,
    },

    quickDownloads: STUDENT_DATA.quickDownloads,
  };
};

/* ── Hook: useStudent ────────────────────────────────────── */

export function useStudent(studentId: string): {
  student: Student;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [student, setStudent] = useState<Student>(STUDENT_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!studentId) return;

    setLoading(true);
    setError(null);

    try {
      const apiStudent = await getstudentsById(studentId);
      setStudent(mapApiStudent(apiStudent));
    } catch {
      setError("Failed to load profile. Showing cached data.");
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { student, loading, error, refetch: fetch };
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