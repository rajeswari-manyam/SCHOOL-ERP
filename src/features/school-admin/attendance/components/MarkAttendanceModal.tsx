import { useAttendanceStore } from "../store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select } from "../../../../components/ui/select";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Badge } from "../../../../components/ui/badge";

const MarkAttendanceModal = () => {
  const {
    showMarkAttendanceModal,
    markAttendanceForm,
    closeMarkAttendance,
    toggleStudentPresent,
    setMarkClass,
    setMarkSection,
  } = useAttendanceStore();

  if (!showMarkAttendanceModal) return null;

  const presentCount = markAttendanceForm.students.filter((s) => s.isPresent).length;
  const absentCount = markAttendanceForm.students.length - presentCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <Card className="w-full max-w-xl mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <CardTitle className="text-lg">Mark Attendance — Web Form</CardTitle>
            <CardDescription>Backup method when WhatsApp is unavailable</CardDescription>
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

        {/* Filters */}
        <CardContent className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="mark-class" className="uppercase tracking-wide text-xs text-gray-500">
                Class
              </Label>
              <Select
                id="mark-class"
                value={markAttendanceForm.class}
                onChange={(e) => setMarkClass(e.target.value)}
                className="mt-2"
              >
                {["Class 6A","Class 6B","Class 7A","Class 8A","Class 9A","Class 10A"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="mark-section" className="uppercase tracking-wide text-xs text-gray-500">
                Section
              </Label>
              <Select
                id="mark-section"
                value={markAttendanceForm.section}
                onChange={(e) => setMarkSection(e.target.value)}
                className="mt-2"
              >
                {["A","B","C"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="mark-date" className="uppercase tracking-wide text-xs text-gray-500">
                Date
              </Label>
              <Input
                id="mark-date"
                type="text"
                value="07 Apr 2025"
                readOnly
                className="mt-2 bg-gray-50 text-gray-600"
              />
            </div>
          </div>
        </CardContent>

        <CardContent className="flex-1 overflow-y-auto">
          <div className="px-6 py-3 border-b border-gray-100">
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Student Attendance</p>
                <p className="text-xs text-gray-500">All marked Present by default — uncheck to mark Absent</p>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                Marking {presentCount} present, {absentCount} absent
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {markAttendanceForm.students.map((student) => (
              <div
                key={student.rollNo}
                className={`flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors ${
                  !student.isPresent ? "bg-red-50" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={student.isPresent}
                      onCheckedChange={() => toggleStudentPresent(student.rollNo)}
                      className="cursor-pointer"
                    />
                    <span className="text-xs text-gray-400 w-5 font-mono">{student.rollNo}</span>
                    <span className={`text-sm font-medium ${!student.isPresent ? "text-red-600" : "text-gray-800"}`}>
                      {student.name}
                    </span>
                  </div>
                  <Badge variant={student.isPresent ? "success" : "error"} className="uppercase text-[10px] px-2 py-1">
                    {student.isPresent ? "PRESENT" : "ABSENT"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-sm">⚠</span>
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
          <Button onClick={closeMarkAttendance} className="w-full sm:w-auto">
            Submit Attendance
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkAttendanceModal;
