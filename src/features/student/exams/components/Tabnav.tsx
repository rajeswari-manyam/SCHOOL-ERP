import type { TabId } from "../types/Exam.types";
import { Button } from "@/components/ui/button";

interface Tab { id: TabId; label: string; }

const TABS: Tab[] = [
  { id: "upcoming", label: "Upcoming Exams" },
  { id: "results", label: "Results" },
  { id: "reportcard", label: "Report Card" },
  { id: "syllabus", label: "Syllabus" },
];

interface TabNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export default function TabNav({ active, onChange }: TabNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-3xl bg-slate-100 p-2 shadow-sm">
      {TABS.map((tab) => (
        <Button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          variant={active === tab.id ? "default" : "ghost"}
          className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
            active === tab.id
              ? "bg-white shadow-sm text-slate-950"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}