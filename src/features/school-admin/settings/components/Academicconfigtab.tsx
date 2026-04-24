import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import type { ClassSection, WorkingDaysConfig } from "../types/settings.types";
import { ALL_DAYS, type Day } from "../utils/Settings.utils";

interface Props {
  classes: ClassSection[];
  workingDays: WorkingDaysConfig;
  saving: boolean;
  onSaveWorkingDays: (data: Partial<WorkingDaysConfig>) => void;
  onAddClass: (data: Omit<ClassSection, "id">) => void;
}

export const AcademicConfigTab: React.FC<Props> = ({
  classes, workingDays, saving, onSaveWorkingDays, onAddClass,
}) => {
  const [wdForm, setWdForm] = useState<WorkingDaysConfig>(workingDays);
  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState({ className: "", classTeacher: "", sections: ["A"] });

  const toggleDay = (day: Day) => {
    const active = wdForm.activeDays;
    const updated = active.includes(day)
      ? active.filter(d => d !== day)
      : [...active, day];
    setWdForm(prev => ({ ...prev, activeDays: updated as WorkingDaysConfig["activeDays"] }));
  };

  const handleAddClass = () => {
    onAddClass({
      className: newClass.className,
      sections: newClass.sections,
      classTeacher: newClass.classTeacher,
      totalStudents: 0,
      status: "ACTIVE",
    });
    setNewClass({ className: "", classTeacher: "", sections: ["A"] });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Academic Year Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Academic Year Configuration</h2>
            <p className="text-sm text-gray-500 mt-0.5">Manage the operational dates for the current academic session.</p>
          </div>
          <Button className="rounded-lg text-sm font-medium" size="sm">
            Save Changes
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-5">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">2024-25</span>
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500" /> ACTIVE
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year Start Date</label>
            <Input defaultValue="01 June 2024" inputSize="md" className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year End Date</label>
            <Input defaultValue="30 April 2025" inputSize="md" className="w-full" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year Label</label>
            <Input defaultValue="2024-25" inputSize="md" className="w-full" />
          </div>
        </div>
        <Button variant="ghost" className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
          <span className="text-lg leading-none">⊕</span> Create New Academic Year
        </Button>
      </div>

      {/* Classes & Sections */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Classes & Sections</h2>
          <Button onClick={() => setShowAdd(true)} className="rounded-lg text-sm font-medium" size="sm">
            Add Class
          </Button>
        </div>

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {["Class", "Sections", "Class Teacher", "Total Students", "Status", "Actions"].map((h) => (
                <TableHead key={h}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-semibold text-gray-900">{cls.className}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {cls.sections.map((s) => (
                      <span key={s} className="w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-gray-700">{cls.classTeacher}</TableCell>
                <TableCell className="text-gray-700">{cls.totalStudents}</TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{cls.status}</span>
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

        {/* Inline add class form */}
        {showAdd && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Class</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Class Name</label>
                <Input
                  value={newClass.className}
                  onChange={(e) => setNewClass((p) => ({ ...p, className: e.target.value }))}
                  placeholder="e.g. Class 11"
                  inputSize="md"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Class Teacher</label>
                <Input
                  value={newClass.classTeacher}
                  onChange={(e) => setNewClass((p) => ({ ...p, classTeacher: e.target.value }))}
                  placeholder="Teacher name"
                  inputSize="md"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddClass} className="rounded-lg text-sm font-medium">
                Add Class
              </Button>
              <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-lg text-sm font-medium">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Working Days */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Working Days</h2>
          <Button
            onClick={() => onSaveWorkingDays(wdForm)}
            disabled={saving}
            className="rounded-lg text-sm font-medium"
            size="sm"
          >
            Save Settings
          </Button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Select Active Working Days</label>
          <div className="flex gap-2">
            {ALL_DAYS.map((day) => {
              const active = wdForm.activeDays.includes(day as any);
              return (
                <Button
                  key={day}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(day as Day)}
                  className={active ? "rounded-full bg-indigo-600 text-white" : "rounded-full text-gray-500 hover:bg-gray-100"}
                >
                  {day}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Time</label>
            <Input
              value={wdForm.startTime}
              onChange={(e) => setWdForm((p) => ({ ...p, startTime: e.target.value }))}
              inputSize="md"
              className="w-full"
            />
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">End Time</label>
            <Input
              value={wdForm.endTime}
              onChange={(e) => setWdForm((p) => ({ ...p, endTime: e.target.value }))}
              inputSize="md"
              className="w-full"
            />
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Period Duration</label>
            <Input
              value={wdForm.periodDuration}
              onChange={(e) => setWdForm((p) => ({ ...p, periodDuration: Number(e.target.value) }))}
              inputSize="md"
              className="w-full"
            />
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Number of Periods</label>
            <Input
              value={wdForm.numberOfPeriods}
              onChange={(e) => setWdForm((p) => ({ ...p, numberOfPeriods: Number(e.target.value) }))}
              inputSize="md"
              className="w-full"
            />
            />
          </div>
        </div>
      </div>
    </div>
  );
};