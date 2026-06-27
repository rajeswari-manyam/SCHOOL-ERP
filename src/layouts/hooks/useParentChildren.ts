import { useEffect, useState } from "react";
import { getUserById } from "@/services/auth.api";
import { getStudentById } from "../../services/student.api";
import type { ParentDetail } from "../../services/student.api";


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
export function useParentChildren(parentId: string) {
  const [children, setChildren] = useState<ChildInfo[]>([]);

  const [activeChild, setActiveChild] = useState<ChildInfo | null>(() => {
    const saved = localStorage.getItem("activeChild");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ FETCH DATA
  useEffect(() => {
    if (!parentId) {
      setLoading(false);
      return;
    }

    const fetchChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        const userRes = await getUserById(parentId);
        const studentList = userRes.data.students ?? [];

        const students: ChildInfo[] = await Promise.all(
          studentList.map(async (item) => {
            const student = await getStudentById(item.id);

            return {
              id: student.id,
              studentId: student.id,
              name: `${student.first_name} ${student.last_name}`.trim(),
              firstName: student.first_name,
              lastName: student.last_name,
              gender: student.gender,
              dateOfBirth: student.date_of_birth,
              bloodGroup: student.blood_group,
              address: student.address,
              photo: student.photo || "",

              classId: student.class_id ?? "",
              sectionId: student.sectionId ?? "",
              academicYearId: student.academicYearId ?? "",

              rollNumber: student.roll_number,
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

              parentName: student.parentDetail?.[0]?.parent_name ?? "",
              parentDetail: student.parentDetail ?? [],

              createdAt: student.createdAt,
              updatedAt: student.updatedAt,
            };
          })
        );

        setChildren(students);

        // ✅ keep previous selection
      if (students.length > 0) {
  const saved = localStorage.getItem("activeChild");

  if (saved) {
    const savedChild = JSON.parse(saved);

    const matchedChild =
      students.find((c) => c.studentId === savedChild.studentId) ||
      students[0];

    setActiveChild(matchedChild);
  } else {
    setActiveChild(students[0]);
  }
}

      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to fetch children data");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [parentId]);

  // ✅ SAVE TO LOCALSTORAGE (SEPARATE HOOK)
  useEffect(() => {
    if (activeChild) {
      localStorage.setItem("activeChild", JSON.stringify(activeChild));
    }
  }, [activeChild]);

  return { children, activeChild, setActiveChild, loading, error };
}