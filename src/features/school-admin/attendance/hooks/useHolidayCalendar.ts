import { useState } from "react";
import type { ActiveTab } from "../types/holidayCalendar.types";

export const useHolidayCalendar = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("Holiday Calendar");
  const [dateInput, setDateInput] = useState("");
  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(3);

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear((year) => year - 1);
      setCalMonth(11);
    } else {
      setCalMonth((month) => month - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear((year) => year + 1);
      setCalMonth(0);
    } else {
      setCalMonth((month) => month + 1);
    }
  };

  return {
    activeTab,
    setActiveTab,
    dateInput,
    setDateInput,
    calYear,
    calMonth,
    prevMonth,
    nextMonth,
  };
};
