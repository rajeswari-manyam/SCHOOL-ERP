import { useAttendance, useMarkAttendance } from "./hooks/useAttendance";
import { useRealtimeAttendance } from "./hooks/useRealtimeAttendance";
import { AttendanceGrid } from "./components/AttendanceGrid";
import { MarkAttendanceForm } from "./components/MarkAttendanceForm";
import { useState } from "react";

const AttendancePage = () => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const { data, isLoading } = useAttendance(date);
  useRealtimeAttendance(date);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded px-2 py-1"
        />
      </div>
      <AttendanceGrid records={data?.records ?? []} />
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Mark Attendance</h2>
        <MarkAttendanceForm
          defaultRecords={data?.students ?? []}
          date={date}
          onSuccess={() => {}}
        />
      </div>
    </div>
  );
};

export default AttendancePage;
