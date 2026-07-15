import { useEffect, useState } from "react";
import { getStudentById } from "../../services/student.api";
import type { ParentDetail } from "../../services/student.api";
import { useAuthStore } from "@/store/authStore";

export interface ChildInfo {
  id: string;
  studentId: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  photo: string;

  classId: string;
  sectionId: string;
  academicYearId: string;

  rollNumber: string;
  admissionNumber: string;
  admissionDate: string | null;
  status: string;

  schoolId: string;
  schoolCode: string;

  classDetail: {
    id: string;
    className: string;
  } | null;

  sectionDetail: {
    id: string;
    sectionName: string;
  } | null;

  academicYear?: {
    id: string;
    yearName: string;
  } | null;

  parentName?: string;
  parentDetail?: ParentDetail[];

  createdAt: string;
  updatedAt: string;
}

// Reads the linked-student list straight from the OTP-verify response
// (persisted in the auth store) instead of re-fetching it via getUserById.
// The selected student is enriched with full detail (class/section names,
// photo, etc.) so existing pages that read `activeChild.classDetail` and
// friends keep working unchanged.
export function useParentChildren() {
  const students          = useAuthStore((s) => s.students);
  const selectedStudent   = useAuthStore((s) => s.selectedStudent);
  const setSelectedStudent = useAuthStore((s) => s.setSelectedStudent);

  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!students || students.length === 0) {
      setChildren([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        const enriched: ChildInfo[] = await Promise.all(
          students.map(async (item) => {
            const student = await getStudentById(item.id);

            return {
              id: student.id,
              studentId: student.id,
              name: `${student.first_name} ${student.last_name}`.trim() || item.name,
              firstName: student.first_name,
              lastName: student.last_name,
              gender: student.gender,
              dateOfBirth: student.date_of_birth,
              bloodGroup: student.blood_group,
              address: student.address,
              photo: student.photo || "",

              classId: student.class_id ?? item.class_id ?? "",
              sectionId: student.sectionId ?? item.sectionId ?? "",
              academicYearId: student.academicYearId ?? "",

              rollNumber: student.roll_number ?? item.roll_number ?? "",
              admissionNumber: student.admission_number,
              admissionDate: student.admission_date,
              status: student.status,

              schoolId: student.school_id,
              schoolCode: student.school_code,

              classDetail: student.classDetail
                ? {
                    id: student.classDetail.id,
                    className: student.classDetail.class_name,
                  }
                : null,

              sectionDetail: student.sectionDetail
                ? {
                    id: student.sectionDetail.id,
                    sectionName: student.sectionDetail.sectionName,
                  }
                : null,

              academicYear: student.academicYear ?? null,

              parentName: student.parentDetail?.[0]?.father_name || student.parentDetail?.[0]?.mother_name || "",
              parentDetail: student.parentDetail ?? [],

              createdAt: student.createdAt,
              updatedAt: student.updatedAt,
            };
          })
        );

        if (!cancelled) setChildren(enriched);
      } catch (err) {
        console.error("Error fetching children:", err);
        if (!cancelled) setError("Failed to fetch children data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChildren();
    return () => {
      cancelled = true;
    };
  }, [students]);

  const activeChild =
    children.find((c) => c.studentId === selectedStudent?.id) ?? children[0] ?? null;

  // Keeps the store's selectedStudent in sync so every other consumer
  // (dashboard, protected routes, API calls) points at the same student.
  const setActiveChild = (child: ChildInfo) => {
    const match = students.find((s) => s.id === child.studentId);
    setSelectedStudent(match ?? { id: child.studentId, name: child.name, roll_number: child.rollNumber, class_id: child.classId, sectionId: child.sectionId });
  };

  return { children, activeChild, setActiveChild, loading, error };
}
