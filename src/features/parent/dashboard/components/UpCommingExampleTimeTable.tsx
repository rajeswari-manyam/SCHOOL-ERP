import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="rounded-xl border border-[#E8EBF2] shadow-none w-full">

      {/* Header */}
      <CardHeader className="pb-2 px-4 sm:px-6 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-[15px] font-semibold text-[#0B1C30]">
            Upcoming Exams
          </CardTitle>

          <button className="text-[12px] text-[#3525CD] border border-[#D0D8FF] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#EEF0FF] transition w-fit">
            📅 Add to Google Calendar
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-5">

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#F0F2F7]">
                {["Subject", "Date", "Day", "Time", "Venue"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide py-3 px-2"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {exams.map((e, i) => (
                <tr
                  key={i}
                  className="group border-b border-[#F0F2F7] last:border-none hover:bg-[#F4F6FF] transition-colors duration-150 cursor-pointer"
                >
                  <td className="text-[13px] font-semibold text-[#0B1C30] py-3.5 px-2 group-hover:text-[#3525CD] transition-colors duration-150">
                    {e.subject}
                  </td>
                  <td className="text-[13px] text-[#0B1C30] py-3.5 px-2">
                    {e.date}
                  </td>
                  <td className="text-[13px] text-[#0B1C30] py-3.5 px-2">
                    {e.day}
                  </td>
                  <td className="text-[13px] text-[#0B1C30] py-3.5 px-2">
                    {e.time}
                  </td>
                  <td className="text-[13px] text-[#0B1C30] py-3.5 px-2">
                    <span className="text-[11px] font-medium text-[#6B7280] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md group-hover:bg-[#EEF0FF] group-hover:border-[#C7CEFF] group-hover:text-[#3525CD] transition-colors duration-150">
                      {e.venue}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex flex-col gap-3">
          {exams.map((e, i) => (
            <div
              key={i}
              className="border border-[#E8EBF2] rounded-lg p-3 bg-white hover:bg-[#F4F6FF] hover:border-[#C7CEFF] transition-all duration-150 cursor-pointer"
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