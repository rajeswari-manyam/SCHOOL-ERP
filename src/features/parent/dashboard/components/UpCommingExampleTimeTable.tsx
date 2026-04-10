import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export const UpcomingExamsTable = () => {
  const exams = [
    {
      subject: "Mathematics",
      date: "16 April 2025",
      day: "Wednesday",
      time: "09:00 AM – 12:00 PM",
      venue: "Hall A-102",
    },
    {
      subject: "Physics",
      date: "18 April 2025",
      day: "Friday",
      time: "09:00 AM – 12:00 PM",
      venue: "Science Lab 2",
    },
    {
      subject: "Chemistry",
      date: "21 April 2025",
      day: "Monday",
      time: "01:30 PM – 04:30 PM",
      venue: "Hall B-205",
    },
  ];

  return (
    <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">

      {/* HEADER (REMOVE “LINE FEEL”) */}
      <CardHeader className="px-4 sm:px-6 pt-5 pb-2 border-none">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

          <CardTitle className="text-[15px] font-semibold text-[#0B1C30]">
            Upcoming Exams
          </CardTitle>

          <button className="text-[12px] text-[#3525CD] border border-[#D0D8FF] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#EEF0FF] transition w-fit">
            📅 Add to Google Calendar
          </button>

        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-5">

        {/* TABLE (REMOVE ALL GRID/BORDER LINES) */}
        <div className="hidden md:block">
          <Table className="min-w-[700px] border-separate border-spacing-y-2">

            {/* HEADER (NO BORDER LINE) */}
            <TableHeader>
              <TableRow className="border-none bg-transparent">
                {["Subject", "Date", "Day", "Time", "Venue"].map((h) => (
                  <TableHead
                    key={h}
                    className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-2 py-2 border-none"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* BODY (NO ROW BORDERS) */}
            <TableBody>
              {exams.map((e, i) => (
                <TableRow
                  key={i}
                  className="border-none bg-white hover:bg-[#F4F6FF] transition"
                >
                  <TableCell className="font-semibold">
                    {e.subject}
                  </TableCell>

                  <TableCell>{e.date}</TableCell>
                  <TableCell>{e.day}</TableCell>
                  <TableCell>{e.time}</TableCell>

                  <TableCell>
                    <span className="text-[11px] font-medium text-[#6B7280] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md">
                      {e.venue}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>

        {/* MOBILE (UNCHANGED) */}
        <div className="md:hidden flex flex-col gap-3">
          {exams.map((e, i) => (
            <div
              key={i}
              className="border border-[#E8EBF2] rounded-lg p-3 bg-white hover:border-[#3525CD] hover:bg-[#F4F6FF] transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold text-[#0B1C30] text-sm">
                  {e.subject}
                </p>

                <span className="text-[11px] font-medium text-[#6B7280] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md">
                  {e.venue}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-xs text-gray-500">
                <p><span className="font-medium text-gray-700">Date:</span> {e.date}</p>
                <p><span className="font-medium text-gray-700">Day:</span> {e.day}</p>
                <p><span className="font-medium text-gray-700">Time:</span> {e.time}</p>
              </div>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
};