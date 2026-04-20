import AttendanceCalendar from "../../dashboard/components/Attendancecalendar";
import { useAttendance } from "../../dashboard/hooks/Usestudentdashboard";

const AttendancePage = () => {
  const { data: attendance, isLoading, isError } = useAttendance();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !attendance) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] gap-3 text-gray-500">
        <span className="text-4xl">⚠️</span>
        <p className="font-semibold">Unable to load attendance data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-2 text-sm text-gray-500">
          Review your monthly attendance record and status details.
        </p>
      </div>

      <AttendanceCalendar attendance={attendance} />
    </div>
  );
};

export default AttendancePage;
