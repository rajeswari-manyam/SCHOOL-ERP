import { studyMaterials } from "../data/HomeWork.data";

export function useStudyMaterials() {
  return {
    materials: studyMaterials,
  };
}