import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { ClassSection, WorkingDaysConfig, CreateClassPayload } from "../types/settings.types";
import { ALL_DAYS, type Day } from "../utils/Settings.utils";

interface Props {
  classes: ClassSection[];
  workingDays: WorkingDaysConfig;
  saving: boolean;
  onSaveWorkingDays: (data: Partial<WorkingDaysConfig>) => void;
  onAddClass: (data: CreateClassPayload) => void;
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
  classes, workingDays, saving, onSaveWorkingDays, onAddClass,
}) => {
  const [wdForm, setWdForm] = useState<WorkingDaysConfig>(workingDays);
  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState<CreateClassPayload>(DEFAULT_NEW_CLASS);

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
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
            2024-25
          </span>
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /> ACTIVE
          </span>
        </div>

        {/* Date fields: 1 col → 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Year Start Date", defaultValue: "01 June 2024" },
            { label: "Year End Date",   defaultValue: "30 April 2025" },
            { label: "Year Label",      defaultValue: "2024-25" },
          ].map(({ label, defaultValue }) => (
            <div key={label}>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {label}
              </label>
              <Input defaultValue={defaultValue} inputSize="md" className="w-full" />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 px-0"
        >
          <span className="text-lg leading-none">⊕</span> Create New Academic Year
        </Button>
      </div>

      {/* ── Classes & Sections ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Classes & Sections</h2>
          <Button
            onClick={() => setShowAdd(true)}
            className="flex-shrink-0 rounded-lg text-sm font-medium active:scale-95 transition-all"
            size="sm"
          >
            Add Class
          </Button>
        </div>

        {/* Mobile cards (< sm) */}
        <div className="sm:hidden space-y-2">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="flex items-start justify-between gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{cls.className}</p>
                <p className="text-xs text-gray-500 mt-0.5">{cls.classTeacher} · {cls.totalStudents} students</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <div className="flex gap-1">
                    {cls.sections.map((s) => (
                      <span
                        key={s}
                        className="w-6 h-6 flex items-center justify-center bg-indigo-50 text-indigo-700 rounded text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[11px] font-medium">
                    {cls.status}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1">
                ✏️
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop table (≥ sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="w-full min-w-[480px]">
            <TableHeader>
              <TableRow>
                {["Class", "Sections", "Class Teacher", "Total Students", "Status", "Actions"].map((h) => (
                  <TableHead key={h} className="whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-semibold text-gray-900">{cls.className}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {cls.sections.map((s) => (
                        <span
                          key={s}
                          className="w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-700 rounded text-xs font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{cls.classTeacher}</TableCell>
                  <TableCell className="text-gray-700 tabular-nums">{cls.totalStudents}</TableCell>
                  <TableCell>
                    <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                      {cls.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      ✏️
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Inline add class form */}
        {showAdd && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Class</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Class Name *</label>
                <Input
                  value={newClass.class_name}
                  onChange={(e) => setNewClass((p) => ({ ...p, class_name: e.target.value }))}
                  placeholder="e.g. 10th"
                  inputSize="md"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Section *</label>
                <Input
                  value={newClass.section}
                  onChange={(e) => setNewClass((p) => ({ ...p, section: e.target.value }))}
                  placeholder="e.g. A"
                  inputSize="md"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Academic Year *</label>
                <Input
                  value={newClass.academic_year}
                  onChange={(e) => setNewClass((p) => ({ ...p, academic_year: e.target.value }))}
                  placeholder="e.g. 2025-2026"
                  inputSize="md"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Class Teacher</label>
                <Input
                  value={newClass.class_teacher}
                  onChange={(e) => setNewClass((p) => ({ ...p, class_teacher: e.target.value }))}
                  placeholder="Teacher name"
                  inputSize="md"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Capacity</label>
                <Input
                  type="number"
                  value={newClass.capacity}
                  onChange={(e) => setNewClass((p) => ({ ...p, capacity: Number(e.target.value) }))}
                  placeholder="40"
                  inputSize="md"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description</label>
                <Input
                  value={newClass.description}
                  onChange={(e) => setNewClass((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional"
                  inputSize="md"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAdd(false)}
                className="w-full sm:w-auto rounded-lg text-sm font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddClass}
                disabled={!newClass.class_name || !newClass.section || !newClass.academic_year}
                className="w-full sm:w-auto rounded-lg text-sm font-medium active:scale-95 transition-all
                  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Add Class
              </Button>
            </div>
          </div>
        )}
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

    </div>
  );
};