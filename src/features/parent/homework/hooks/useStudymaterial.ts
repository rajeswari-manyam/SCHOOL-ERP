import { useEffect } from "react";
import { useHomeworkStore } from "../store/HomeWork.store";
import {
  getStudyMaterialByClassName,
  getStudyMaterialById,
} from "../../../../services/studymaterial.api";

export function useStudyMaterials(className: string) {
  const {
    studyMaterials,
    materialsLoading,
    materialsError,
    setStudyMaterials,
    setMaterialsLoading,
    setMaterialsError,
  } = useHomeworkStore();

  useEffect(() => {
    if (!className) return;

    let cancelled = false;
    setMaterialsLoading(true);
    setMaterialsError(null);

    // 🔍 DEBUG: log exactly what className value is being sent to the API
    console.log("[useStudyMaterials] fetching for className:", JSON.stringify(className));

    getStudyMaterialByClassName(className)
      .then((res) => {
        if (cancelled) return;
        console.log("[useStudyMaterials] response:", res);
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
  }, [className]);

  const fetchById = (id: string) => getStudyMaterialById(id);

  return {
    materials: studyMaterials,
    loading: materialsLoading,
    error: materialsError,
    fetchById,
  };
}