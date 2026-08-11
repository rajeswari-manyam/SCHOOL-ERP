import { useHomeworkStore } from "../store/HomeWork.store";

export function useHomework() {
  const tab = useHomeworkStore((s) => s.tab);
  const allHomeworks = useHomeworkStore((s) => s.allHomeworks);

  return {
    tab,
    allHomework: allHomeworks,
  };
}