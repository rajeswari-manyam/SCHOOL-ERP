import { useMemo } from "react";
import { useHomeworkStore } from "../store/HomeWork.store";
import { homeworkData } from "../data/HomeWork.data";
import {
  filterHomeworkByDay,
  sortByDueDate,
} from "../utils/homework.utils";

export function useHomework() {
  const { tab, day } = useHomeworkStore();

  const filteredHomework = useMemo(() => {
    const filtered = filterHomeworkByDay(homeworkData, day);
    return sortByDueDate(filtered);
  }, [day]);

  return {
    tab,
    day,
    homework: filteredHomework,
    allHomework: homeworkData,
  };
}