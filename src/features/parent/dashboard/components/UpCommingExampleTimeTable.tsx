import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upcomingExams } from "../data/dashboard.data";

type Exam = {
  subject: string;
  date: string;
  day: string;
  time: string;
  venue: string;
};

const columnHelper = createColumnHelper<Exam>();

export const UpcomingExamsTable = () => {
  const columns = useMemo(
    () => [
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => (
          <span className="font-semibold text-[#0B1C30] text-sm">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-[#374151]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("day", {
        header: "Day",
        cell: (info) => (
          <span className="text-sm text-[#374151]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("time", {
        header: "Time",
        cell: (info) => (
          <span className="text-sm text-[#374151]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("venue", {
        header: "Venue",
        cell: (info) => (
          <span className="text-[11px] font-medium text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md whitespace-nowrap">
            {info.getValue()}
          </span>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: upcomingExams,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">

      <CardHeader className="px-5 sm:px-6 pt-5 pb-3 border-none">
        <div className="flex items-center justify-between gap-2">

          <CardTitle className="text-[15px] font-semibold text-[#0B1C30]">
            Upcoming Exams
          </CardTitle>

          <button className="text-[12px] text-[#3525CD] border border-[#D0D8FF] px-3 py-1.5 rounded-md flex items-center gap-1.5 hover:bg-[#EEF0FF] transition whitespace-nowrap">
            📅 Add to Google Calendar
          </button>

        </div>
      </CardHeader>

      <CardContent className="px-5 sm:px-6 pb-5">

        {/* DESKTOP */}
        <div className="hidden md:block w-full">
          <table className="w-full table-fixed border-separate border-spacing-y-1">

            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[15%]" />
              <col className="w-[28%]" />
              <col className="w-[17%]" />
            </colgroup>

            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-3 py-2 text-left border-b border-[#F1F3F8]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#F8F9FF] transition cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-3 py-3.5 text-sm text-[#374151] border-b border-[#F1F3F8]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden flex flex-col gap-2">
          {upcomingExams.map((e, i) => (
            <div
              key={i}
              className="border border-[#E8EBF2] rounded-lg p-3 bg-white hover:border-[#3525CD] hover:bg-[#F8F9FF] transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <p className="font-semibold text-[#0B1C30] text-sm">
                  {e.subject}
                </p>
                <span className="text-[11px] font-medium text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md whitespace-nowrap">
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