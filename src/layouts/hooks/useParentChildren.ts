import { useEffect, useState } from "react";
import { getParentById } from "@/services/parent.api";
import { getStudentById } from "../../services/student.api";
import type { Student } from "../../services/student.api";

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

  createdAt: string;
  updatedAt: string;
}

export function useParentChildren(parentId: string) {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [activeChild, setActiveChild] = useState<ChildInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!parentId) {
      setLoading(false);
      return;
    }

    const fetchChildren = async () => {
      setLoading(true);
      setError(null);
      try {
        const parent = await getParentById(parentId);

        const students: ChildInfo[] = await Promise.all(
          (parent.students ?? []).map(async (item: any) => {
            const studentId = typeof item === "string" ? item : item.id;
            const student: Student = await getStudentById(studentId);

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
              sectionId: student.sectionId ?? "",         // ✅ fixed
              academicYearId: student.academicYearId ?? "", // ✅ fixed

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

              createdAt: student.createdAt,
              updatedAt: student.updatedAt,
            };
          })
        );

        setChildren(students);
        setActiveChild(students[0] || null);
      } catch (err) {
        console.error("Error fetching children:", err);
        setError("Failed to fetch children data");
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [parentId]);

  return { children, activeChild, setActiveChild, loading, error };
}