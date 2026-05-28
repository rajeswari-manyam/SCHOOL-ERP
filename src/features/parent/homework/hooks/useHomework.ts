import { useHomeworkStore } from "../store/HomeWork.store";

export function useHomework() {
  const { tab, day, weekHomeworks, allHomeworks } = useHomeworkStore();

  return {
    tab,
    day,
    homework: weekHomeworks,
    allHomework: allHomeworks,
  };
}