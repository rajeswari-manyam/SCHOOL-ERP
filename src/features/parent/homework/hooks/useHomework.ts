import { useHomeworkStore } from "../store/HomeWork.store";

export function useHomework() {
  const { tab, allHomeworks } = useHomeworkStore();

  return {
    tab,
    allHomework: allHomeworks,
  };
}