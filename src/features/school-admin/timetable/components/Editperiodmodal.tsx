import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { SubjectOption, TeacherOption, DayOfWeek } from "../types/timetable.types";
import type { EditPeriodState } from "../hooks/useTimetable";

interface Props {
  state: EditPeriodState;
  subjects: SubjectOption[];
  teachers: TeacherOption[];
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onFieldChange: <K extends keyof EditPeriodState>(key: K, value: EditPeriodState[K]) => void;
}

const DAY_FULL: Record<DayOfWeek, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday",
  THU: "Thursday", FRI: "Friday", SAT: "Saturday",
};

const EditPeriodModal: React.FC<Props> = ({
  state, subjects, teachers, isSaving, onClose, onSave, onFieldChange,
}) => {
  if (!state.open || !state.day || state.periodNo == null) return null;

  const selectedTeacher = teachers.find((t) => t.value === state.teacherName || t.label === state.teacherName);
  const hasConflict = !!selectedTeacher?.conflictWarning;

  const timeSlotLabel = (() => {
    // Map period numbers to display time slots
    const slots: Record<number, string> = {
      1: "8:30 AM – 9:15 AM",
      2: "9:15 AM – 10:00 AM",
      3: "10:00 AM – 10:45 AM",
      4: "11:00 AM – 11:45 AM",
      5: "11:45 AM – 12:30 PM",
      6: "2:00 PM – 2:45 PM",
      7: "2:45 PM – 3:30 PM",
    };
    return slots[state.periodNo ?? 1] ?? "";
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Period</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Class 10A — {DAY_FULL[state.day]}, Period {state.periodNo}{" "}
              ({timeSlotLabel})
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none h-8 w-8 p-0"
          >
            ×
          </Button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Subject */}
          <div>
            <Label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Subject
            </Label>
            <Select
              value={state.subject}
              onValueChange={(value) => onFieldChange("subject", value)}
              options={subjects}
              placeholder="Select subject"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Teacher */}
          <div>
            <Label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Teacher
            </Label>
            <Select
              value={state.teacherName}
              onValueChange={(value) => onFieldChange("teacherName", value)}
              options={teachers}
              placeholder="Select teacher"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Period No + Time Slot */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Period Number
              </Label>
              <Input
                type="number"
                value={state.periodNo}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <Label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Time Slot
              </Label>
              <Input
                type="text"
                value={timeSlotLabel}
                readOnly
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Room / Venue */}
          <div>
            <Label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Room / Venue
            </Label>
            <Input
              type="text"
              value={state.room}
              onChange={(e) => onFieldChange("room", e.target.value)}
              placeholder="Room 10A (default class room)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Conflict warning */}
          {hasConflict && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠️</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                {selectedTeacher?.conflictWarning}
              </p>
            </div>
          )}

          {/* Apply to all weeks */}
          <div className="flex items-center gap-2.5 cursor-pointer select-none">
            <Checkbox
              checked={state.applyToAllWeeks}
              onCheckedChange={(checked) => onFieldChange("applyToAllWeeks", checked as boolean)}
              className="w-4 h-4 accent-indigo-600"
            />
            <Label className="text-sm text-gray-600">Apply same change to all weeks</Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Saving…" : "Save Period"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPeriodModal;