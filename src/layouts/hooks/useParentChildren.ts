import { useEffect, useState } from "react";
import { getParentById } from "@/services/parent.api";
import { getStudentById } from "@/services/student.api";

export function useParentChildren(parentId: string) {
  const [children, setChildren] = useState<any[]>([]);
  const [activeChild, setActiveChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentId) return;

    const fetchChildren = async () => {
      setLoading(true);
      try {
        const parent = await getParentById(parentId);

        const students = await Promise.all(
          (parent.students ?? []).map(async (item: any) => {
            const studentId = typeof item === "string" ? item : item.id;
            const student = await getStudentById(studentId);

            return {
              id: student.id,
              studentId: student.id,
              name: `${student.first_name} ${student.last_name}`,
              class: student.class_id ?? "",
              section: student.sectionId ?? "",
              school: student.school_code,
            };
          })
        );

        setChildren(students);
        setActiveChild(students[0] || null);
      } catch (err) {
        console.error("Error fetching children:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [parentId]);

  return { children, activeChild, setActiveChild, loading };
}