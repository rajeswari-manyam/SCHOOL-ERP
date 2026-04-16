import React, { useState } from "react";
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
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
            Save Changes
          </button>
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
            <input defaultValue="01 June 2024" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year End Date</label>
            <input defaultValue="30 April 2025" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year Label</label>
            <input defaultValue="2024-25" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <button className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
          <span className="text-lg leading-none">⊕</span> Create New Academic Year
        </button>
      </div>

      {/* Classes & Sections */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Classes & Sections</h2>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Add Class
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {["Class", "Sections", "Class Teacher", "Total Students", "Status", "Actions"].map(h => (
                <th key={h} className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wide pr-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.map(cls => (
              <tr key={cls.id} className="border-b border-gray-50 last:border-0">
                <td className="py-3 text-sm font-semibold text-gray-900 pr-4">{cls.className}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1">
                    {cls.sections.map(s => (
                      <span key={s} className="w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-700 rounded text-xs font-bold">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-sm text-gray-700 pr-4">{cls.classTeacher}</td>
                <td className="py-3 text-sm text-gray-700 pr-4">{cls.totalStudents}</td>
                <td className="py-3 pr-4">
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{cls.status}</span>
                </td>
                <td className="py-3">
                  <button className="text-gray-400 hover:text-gray-600">✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Inline add class form */}
        {showAdd && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Add New Class</h3>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Class Name</label>
                <input
                  value={newClass.className}
                  onChange={e => setNewClass(p => ({ ...p, className: e.target.value }))}
                  placeholder="e.g. Class 11"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Class Teacher</label>
                <input
                  value={newClass.classTeacher}
                  onChange={e => setNewClass(p => ({ ...p, classTeacher: e.target.value }))}
                  placeholder="Teacher name"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddClass} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Add Class</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Working Days */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Working Days</h2>
          <button
            onClick={() => onSaveWorkingDays(wdForm)}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Save Settings
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Select Active Working Days</label>
          <div className="flex gap-2">
            {ALL_DAYS.map(day => {
              const active = wdForm.activeDays.includes(day as any);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day as Day)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Start Time</label>
            <input
              value={wdForm.startTime}
              onChange={e => setWdForm(p => ({ ...p, startTime: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">End Time</label>
            <input
              value={wdForm.endTime}
              onChange={e => setWdForm(p => ({ ...p, endTime: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Period Duration</label>
            <input
              value={wdForm.periodDuration}
              onChange={e => setWdForm(p => ({ ...p, periodDuration: Number(e.target.value) }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Number of Periods</label>
            <input
              value={wdForm.numberOfPeriods}
              onChange={e => setWdForm(p => ({ ...p, numberOfPeriods: Number(e.target.value) }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};