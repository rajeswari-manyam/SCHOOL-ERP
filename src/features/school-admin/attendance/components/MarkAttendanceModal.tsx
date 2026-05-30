import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useAttendanceStore } from "../store";
import { useAttendanceStudents, useSubmitAttendance } from "../hooks/useAttendance";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Badge } from "../../../../components/ui/badge";
import type { MarkAttendanceForm, StudentAttendanceEntry } from "../types/attendance.types";

const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  label: `Class ${i + 1}`,
  value: String(i + 1),
}));

const SECTION_OPTIONS = ["A", "B", "C"].map((s) => ({
  label: `Section ${s}`,
  value: s,
}));

const MarkAttendanceModal = () => {
  const { showMarkAttendanceModal, closeMarkAttendance } = useAttendanceStore();

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [students, setStudents] = useState<StudentAttendanceEntry[]>([]);

  const { data: fetchedStudents, isLoading, isFetching, error } = useAttendanceStudents(
    selectedClass,
    selectedSection,
  );

  useEffect(() => {
    if (fetchedStudents) {
      setStudents(fetchedStudents);
    }
  }, [fetchedStudents]);

  const handleClassChange = useCallback((value: string) => {
    setSelectedClass(value);
    setStudents([]);
  }, []);

  const handleSectionChange = useCallback((value: string) => {
    setSelectedSection(value);
    setStudents([]);
  }, []);

  const toggleStudent = useCallback((rollNo: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.rollNo === rollNo ? { ...s, isPresent: !s.isPresent } : s)),
    );
  }, []);

  const markAllPresent = useCallback(() => {
    setStudents((prev) => prev.map((s) => ({ ...s, isPresent: true })));
  }, []);

  const markAllAbsent = useCallback(() => {
    setStudents((prev) => prev.map((s) => ({ ...s, isPresent: false })));
  }, []);

  const presentCount = useMemo(() => students.filter((s) => s.isPresent).length, [students]);
  const absentCount = students.length - presentCount;

  const submitMutation = useSubmitAttendance();

  const handleSubmit = useCallback(() => {
    const payload: MarkAttendanceForm = {
      class: `Class ${selectedClass}`,
      section: selectedSection,
      date: new Date().toISOString().slice(0, 10),
      students,
    };
    console.log("📤 submitAttendance payload:", JSON.stringify(payload, null, 2));
    submitMutation.mutate(payload, {
      onSuccess: () => toast.success("Attendance submitted successfully"),
      onError: (err: any) => toast.error(err?.message ?? "Failed to submit attendance"),
    });
  }, [selectedClass, selectedSection, students, submitMutation]);

  if (!showMarkAttendanceModal) return null;

  const loading = isLoading || isFetching;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <CardTitle className="text-lg">Mark Attendance</CardTitle>
            <CardDescription>Select class and section to mark attendance</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 rounded-full p-0 text-gray-400 hover:text-gray-600"
            onClick={closeMarkAttendance}
          >
            <span className="text-2xl leading-none">&times;</span>
          </Button>
        </CardHeader>

        {/* Class & Section Selectors */}
        <CardContent className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mark-class" className="uppercase tracking-wide text-xs text-gray-500">
                Class
              </Label>
              <Select
                id="mark-class"
                options={CLASS_OPTIONS}
                placeholder="Select class"
                value={selectedClass}
                onValueChange={handleClassChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="mark-section" className="uppercase tracking-wide text-xs text-gray-500">
                Section
              </Label>
              <Select
                id="mark-section"
                options={SECTION_OPTIONS}
                placeholder="Select section"
                value={selectedSection}
                onValueChange={handleSectionChange}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="mark-date" className="uppercase tracking-wide text-xs text-gray-500">
                Date
              </Label>
              <Input
                id="mark-date"
                type="text"
                value={new Date().toLocaleDateString("en-IN", {
                  weekday: "short", day: "numeric", month: "short", year: "numeric",
                })}
                readOnly
                className="mt-2 bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </CardContent>

        {/* Student List */}
        <CardContent className="flex-1 overflow-y-auto min-h-[200px]">
          {!selectedClass || !selectedSection ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Select a class and section to view students
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading students...
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-red-500 text-sm">
              Failed to load students. Please try again.
            </div>
          ) : students.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No students found for Class {selectedClass} Section {selectedSection}
            </div>
          ) : (
            <>
              {/* Stats + bulk actions */}
              <div className="px-6 py-3 border-b border-gray-100 -mx-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Student Attendance
                    </p>
                    <p className="text-xs text-gray-500">
                      {students.length} students · {presentCount} present · {absentCount} absent
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllPresent}
                      className="text-xs h-8"
                    >
                      All Present
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAbsent}
                      className="text-xs h-8"
                    >
                      All Absent
                    </Button>
                  </div>
                </div>
              </div>

              {/* Student rows */}
              <div className="divide-y divide-gray-50 -mx-6">
                {students.map((student) => (
                  <div
                    key={student.rollNo}
                    className={`flex items-center justify-between px-6 py-2.5 hover:bg-gray-50 transition-colors ${
                      !student.isPresent ? "bg-red-50" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={student.isPresent}
                        onCheckedChange={() => toggleStudent(student.rollNo)}
                        className="cursor-pointer shrink-0"
                      />
                      <span className="text-xs text-gray-400 w-6 font-mono shrink-0">{student.rollNo}</span>
                      <span className={`text-sm font-medium truncate ${!student.isPresent ? "text-red-600" : "text-gray-800"}`}>
                        {student.name}
                      </span>
                    </div>
                    <Badge
                      variant={student.isPresent ? "success" : "error"}
                      className="uppercase text-[10px] px-2 py-0.5 shrink-0"
                    >
                      {student.isPresent ? "PRESENT" : "ABSENT"}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Warning */}
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-100 -mx-6 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-sm">&#9888;</span>
              <p className="text-xs text-amber-700 italic">
                Parent WhatsApp alerts will be sent automatically for all absent students.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-6 border-t border-gray-100">
          <Button variant="ghost" onClick={closeMarkAttendance} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedClass || !selectedSection || students.length === 0 || submitMutation.isPending}
            className="w-full sm:w-auto"
          >
            {submitMutation.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit Attendance"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkAttendanceModal;