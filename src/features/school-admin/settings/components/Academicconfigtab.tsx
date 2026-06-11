import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { AcademicYear, CreateAcademicYearPayload, ClassSection, WorkingDaysConfig, CreateClassPayload } from "../types/settings.types";
import { ALL_DAYS, type Day } from "../utils/Settings.utils";
import { CreateAcademicYearModal } from "./CreateAcademicYearModal";

interface Props {
  classes: ClassSection[];
  workingDays: WorkingDaysConfig;
  academicYears: AcademicYear[];
  saving: boolean;
  onSaveWorkingDays: (data: Partial<WorkingDaysConfig>) => void;
  onAddClass: (data: CreateClassPayload) => void;
  onCreateAcademicYear: (data: CreateAcademicYearPayload) => Promise<void>;
}

const DEFAULT_NEW_CLASS: CreateClassPayload = {
  class_name: "",
  section: "A",
  academic_year: String(new Date().getFullYear()) + "-" + String(new Date().getFullYear() + 1),
  class_teacher: "",
  capacity: 40,
  description: "",
  school_code: import.meta.env.VITE_SCHOOL_CODE ?? localStorage.getItem("schoolcode"),
};

export const AcademicConfigTab: React.FC<Props> = ({
  classes, workingDays, academicYears, saving, onSaveWorkingDays, onAddClass, onCreateAcademicYear,
}) => {
  const [wdForm, setWdForm] = useState<WorkingDaysConfig>(workingDays);
  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState<CreateClassPayload>(DEFAULT_NEW_CLASS);
  const [showCreateYear, setShowCreateYear] = useState(false);

  const toggleDay = (day: Day) => {
    const active = wdForm.activeDays;
    const updated = active.includes(day)
      ? active.filter(d => d !== day)
      : [...active, day];
    setWdForm(prev => ({ ...prev, activeDays: updated as WorkingDaysConfig["activeDays"] }));
  };

  const handleAddClass = () => {
    onAddClass(newClass);
    setNewClass(DEFAULT_NEW_CLASS);
    setShowAdd(false);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">

      {/* ── Academic Year Configuration ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Academic Year Configuration
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage the operational dates for the current academic session.
            </p>
          </div>
          <Button className="flex-shrink-0 rounded-lg text-sm font-medium active:scale-95 transition-all" size="sm">
            Save Changes
          </Button>
        </div>

        {/* Year badge + status */}
        <div className="flex items-center gap-3 mb-4 sm:mb-5 flex-wrap">
          {academicYears.length === 0 ? (
            <span className="text-sm text-gray-500">No academic year configured</span>
          ) : (academicYears.map((year) => (
            <div key={year.id} className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                year.active
                  ? "bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {year.yearName}
              </span>
              {year.active && (
                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /> ACTIVE
                </span>
              )}
            </div>
          )))}
         
        </div>

        

        <Button
          variant="ghost"
          onClick={() => setShowCreateYear(true)}
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-0"
        >
          <span className="text-lg leading-none">⊕</span> Create New Academic Year
        </Button>
      </div>

      

      {/* ── Working Days ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Working Days</h2>
          <Button
            onClick={() => onSaveWorkingDays(wdForm)}
            disabled={saving}
            className="flex-shrink-0 rounded-lg text-sm font-medium active:scale-95 transition-all
              disabled:opacity-60 disabled:cursor-not-allowed"
            size="sm"
          >
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </div>

        {/* Day toggles — wrapping row on mobile */}
        <div className="mb-4 sm:mb-5">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Select Active Working Days
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const active = wdForm.activeDays.includes(day as Day);
              return (
                <Button
                  key={day}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day as Day)}
                  className={`rounded-full text-xs sm:text-sm px-3 sm:px-4 active:scale-95 transition-all
                    ${active
                      ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    }`}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Time/period fields: 1 col → 2 cols → 4 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Start Time",
              value: wdForm.startTime,
              onChange: (v: string) => setWdForm(p => ({ ...p, startTime: v })),
            },
            {
              label: "End Time",
              value: wdForm.endTime,
              onChange: (v: string) => setWdForm(p => ({ ...p, endTime: v })),
            },
            {
              label: "Period Duration",
              value: String(wdForm.periodDuration),
              onChange: (v: string) => setWdForm(p => ({ ...p, periodDuration: Number(v) })),
            },
            {
              label: "Number of Periods",
              value: String(wdForm.numberOfPeriods),
              onChange: (v: string) => setWdForm(p => ({ ...p, numberOfPeriods: Number(v) })),
            },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {label}
              </label>
              <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                inputSize="md"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>
{showCreateYear && (
        <CreateAcademicYearModal
         
          onClose={() => setShowCreateYear(false)}
          onSubmit={onCreateAcademicYear}
        />
      )}
    </div>
  );
};