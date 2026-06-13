import { useEffect } from "react";
import { useHomeworkStore } from "../store/HomeWork.store";
import {
  getStudyMaterialsByFilter,
  getStudyMaterialById,
} from "../../../../services/studymaterial.api";

export function useStudyMaterials(classId: string, sectionId: string) {
  const {
    studyMaterials,
    materialsLoading,
    materialsError,
    setStudyMaterials,
    setMaterialsLoading,
    setMaterialsError,
  } = useHomeworkStore();

  useEffect(() => {
    if (!classId || !sectionId) return;

    let cancelled = false;
    setMaterialsLoading(true);
    setMaterialsError(null);

    getStudyMaterialsByFilter({ class_id: classId, section_id: sectionId })
      .then((res) => {
        if (cancelled) return;
        if (res.status && Array.isArray(res.data)) {
          setStudyMaterials(res.data);
        } else {
          setMaterialsError("Failed to load study materials.");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("[useStudyMaterials] error:", err);
          setMaterialsError(err?.message ?? "Something went wrong.");
        }
      })
      .finally(() => {
        if (!cancelled) setMaterialsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId, sectionId]);

  const fetchById = (id: string) => getStudyMaterialById(id);

  return {
    materials: studyMaterials,
    loading: materialsLoading,
    error: materialsError,
    fetchById,
  };
}