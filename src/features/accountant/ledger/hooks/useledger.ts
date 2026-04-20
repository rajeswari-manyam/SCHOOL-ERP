// hooks/useLedger.ts
import { useState, useMemo } from "react";
import type { LedgerEntry, PettyCashEntry, MonthlyData } from "../types/Ledger.types";

const initialEntries: LedgerEntry[] = [
  {
    id: "1",
    date: "2025-04-06",
    category: "Fee Collection",
    description: "Tuition fees batch — 7 Apr",
    reference: "Auto",
    amount: 24500,
    recordedBy: "System Auto",
    type: "Income",
  },
  {
    id: "2",
    date: "2025-04-05",
    category: "Fee Collection",
    description: "Tuition fees batch — 6 Apr",
    reference: "Auto",
    amount: 18000,
    recordedBy: "System Auto",
    type: "Income",
  },
  {
    id: "3",
    date: "2025-04-04",
    category: "Fee Collection",
    description: "Tuition + Exam fees batch",
    reference: "Auto",
    amount: 22500,
    recordedBy: "System Auto",
    type: "Income",
  },
  {
    id: "4",
    date: "2025-04-03",
    category: "Other Income",
    description: "Library fine collection",
    reference: "LIB-042",
    amount: 450,
    recordedBy: "Ramu Teja",
    type: "Income",
  },
  {
    id: "5",
    date: "2025-04-02",
    category: "Fee Collection",
    description: "Transport fee batch",
    reference: "Auto",
    amount: 12000,
    recordedBy: "System Auto",
    type: "Income",
  },
  {
    id: "6",
    date: "2025-04-01",
    category: "Other Income",
    description: "Annual day sponsorship",
    reference: "SPNS-001",
    amount: 15000,
    recordedBy: "Ramu Teja",
    type: "Income",
  },
  {
    id: "7",
    date: "2025-04-01",
    category: "Salaries",
    description: "March 2025 payroll payout",
    reference: "PAY-MAR-2025",
    amount: 347280,
    recordedBy: "Ramu Teja",
    type: "Expense",
    paidVia: "Bank Transfer",
  },
  {
    id: "8",
    date: "2025-04-03",
    category: "Utilities",
    description: "Electricity bill — March",
    reference: "ELEC-0342",
    amount: 8400,
    recordedBy: "Ramu Teja",
    type: "Expense",
    paidVia: "Cash",
  },
  {
    id: "9",
    date: "2025-04-03",
    category: "Maintenance",
    description: "Classroom repair — Room 201",
    reference: "MAINT-012",
    amount: 4500,
    recordedBy: "Ramu Teja",
    type: "Expense",
    paidVia: "Cash",
  },
  {
    id: "10",
    date: "2025-04-04",
    category: "Stationery",
    description: "Office stationery purchase",
    reference: "PO-0234",
    amount: 2100,
    recordedBy: "Anita V",
    type: "Expense",
    paidVia: "Cash",
  },
];

const initialPettyCash: PettyCashEntry[] = [
  {
    id: "pc1",
    date: "2025-04-01",
    description: "Opening balance",
    category: "-",
    amount: 5000,
    balanceAfter: 5000,
    authorizedBy: "Principal",
  },
  {
    id: "pc2",
    date: "2025-04-02",
    description: "Tea/refreshments for staff meeting",
    category: "Refreshments",
    amount: -280,
    balanceAfter: 4720,
    authorizedBy: "Ramu Teja",
    receipt: "Receipt",
  },
  {
    id: "pc3",
    date: "2025-04-03",
    description: "Courier charges — documents",
    category: "Courier",
    amount: -150,
    balanceAfter: 4570,
    authorizedBy: "Ramu Teja",
    receipt: "Receipt",
  },
  {
    id: "pc4",
    date: "2025-04-04",
    description: "Printout cartridge",
    category: "Stationery",
    amount: -850,
    balanceAfter: 3720,
    authorizedBy: "Anita V",
    receipt: "Receipt",
  },
  {
    id: "pc5",
    date: "2025-04-05",
    description: "Water cans — office",
    category: "Utilities",
    amount: -240,
    balanceAfter: 3480,
    authorizedBy: "Ramu Teja",
    receipt: "Receipt",
  },
  {
    id: "pc6",
    date: "2025-04-06",
    description: "Miscellaneous — emergency repair",
    category: "Misc",
    amount: -280,
    balanceAfter: 3200,
    authorizedBy: "Ramu Teja",
    receipt: "No receipt",
  },
];

const monthlyChartData: MonthlyData[] = [
  { month: "NOV", income: 180000, expense: 220000 },
  { month: "DEC", income: 200000, expense: 190000 },
  { month: "JAN", income: 240000, expense: 210000 },
  { month: "FEB", income: 220000, expense: 230000 },
  { month: "MAR", income: 260000, expense: 280000 },
  { month: "APR", income: 258000, expense: 378080 },
];

export const useLedger = () => {
  const [entries, setEntries] = useState<LedgerEntry[]>(initialEntries);
  const [pettyCash, setPettyCash] = useState<PettyCashEntry[]>(initialPettyCash);

  const income = useMemo(() => 
    entries.filter((e) => e.type === "Income").reduce((a, b) => a + b.amount, 0),
    [entries]
  );

  const expense = useMemo(() => 
    entries.filter((e) => e.type === "Expense").reduce((a, b) => a + b.amount, 0),
    [entries]
  );

  const feeCollection = useMemo(() =>
    entries.filter(e => e.type === "Income" && e.category === "Fee Collection").reduce((a, b) => a + b.amount, 0),
    [entries]
  );

  const otherIncome = useMemo(() =>
    entries.filter(e => e.type === "Income" && e.category === "Other Income").reduce((a, b) => a + b.amount, 0),
    [entries]
  );

  const payrollExpense = useMemo(() =>
    entries.filter(e => e.type === "Expense" && e.category === "Salaries").reduce((a, b) => a + b.amount, 0),
    [entries]
  );

  const operatingExpenses = useMemo(() =>
    entries.filter(e => e.type === "Expense" && e.category !== "Salaries").reduce((a, b) => a + b.amount, 0),
    [entries]
  );

  const addEntry = (entry: LedgerEntry) => {
    setEntries((prev) => [entry, ...prev]);
  };

  const addPettyCashEntry = (entry: PettyCashEntry) => {
    setPettyCash((prev) => [...prev, entry]);
  };

  return {
    entries,
    pettyCash,
    income,
    expense,
    feeCollection,
    otherIncome,
    payrollExpense,
    operatingExpenses,
    chartData: monthlyChartData,
    addEntry,
    addPettyCashEntry,
  };
};