import { useState } from "react";
import type { StaffPayroll } from "../types/payroll.types";

export const usePayroll = () => {
  const [data, setData] = useState<StaffPayroll[]>([
    {
      id: "1",
      name: "Ramesh",
      role: "Teacher",
      present: 24,
      absent: 2,
      gross: 30000,
      deductions: 2000,
      net: 28000,
      status: "Pending",
    },
  ]);

  const processPayroll = () => {
    setData((prev) =>
      prev.map((s) => ({ ...s, status: "Processed" }))
    );
  };

  return { data, processPayroll };
};