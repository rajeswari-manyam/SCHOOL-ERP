import { useMemo, useEffect, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUpcomingExams } from "../../../../services/examtimetable.api"
import type { UpcomingExamItem } from "../../../../services/examtimetable.api"
import { useStudentById } from "../../dashboard/hooks/useStudent"
import { useOutletContext } from "react-router-dom"

// ── Types ─────────────────────────────────────────────────────────────────────

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
    studentId?: string;
  };
};

const columnHelper = createColumnHelper<UpcomingExamItem>()

// ── Helpers ───────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i} className="px-3 py-3.5 border-b border-[#F1F3F8]">
          <div className="h-3.5 rounded bg-gray-200 animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

// Format "09:00:00" → "09:00 AM"
function fmtTime(t: string) {
  if (!t) return "—"
  const [h, m] = t.split(":").map(Number)
  const suffix = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`
}

// Format "2025-04-16" → "16 April 2025"
function fmtDate(d: string) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })
}

// "2025-04-16" → "Wednesday"
function fmtDay(d: string) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-IN", { weekday: "long" })
}

// ── Component ─────────────────────────────────────────────────────────────────

export const UpcomingExamsTable = () => {
  const { activeChild } = useOutletContext<ParentLayoutContext>()

  const studentId = String(activeChild?.studentId ?? activeChild?.id ?? "")
  const { student } = useStudentById(studentId)

  const [exams,     setExams]     = useState<UpcomingExamItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [filterDate, setFilterDate] = useState("")   // "" = no filter (all upcoming)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const classId   = student?.classDetail?.id
    const sectionId = student?.sectionDetail?.id

    if (!classId) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    const params: { class_id: string; section_id?: string; date?: string } = {
      class_id:   classId,
      section_id: sectionId,
    }
    if (filterDate) params.date = filterDate

    getUpcomingExams(params)
      .then((res) => {
        if (cancelled) return
        if (res.status && Array.isArray(res.data)) setExams(res.data)
        else setError("Failed to load exams.")
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err?.message ?? "Something went wrong.")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [student?.classDetail?.id, student?.sectionDetail?.id, filterDate])

  const upcoming = [...exams].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  )

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.subject?.subject_name ?? "—", {
        id: "subject",
        header: "Subject",
        cell: (info) => (
          <span className="font-semibold text-[#0B1C30] text-sm">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("exam_date", {
        header: "Date",
        cell: (info) => (
          <span className="text-sm text-[#374151]">{fmtDate(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor((row) => row.exam_date, {
        id: "day",
        header: "Day",
        cell: (info) => (
          <span className="text-sm text-[#374151]">{fmtDay(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor((row) => `${fmtTime(row.start_time)} – ${fmtTime(row.end_time)}`, {
        id: "time",
        header: "Time",
        cell: (info) => (
          <span className="text-sm text-[#374151]">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("room_no", {
        header: "Venue",
        cell: (info) => (
          <span className="text-[11px] font-medium text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md whitespace-nowrap">
            {info.getValue() || "—"}
          </span>
        ),
      }),
    ],
    []
  )

  const table = useReactTable({
    data: upcoming,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">
      <CardHeader className="px-5 sm:px-6 pt-5 pb-3 border-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-[15px] font-semibold text-[#0B1C30]">
            Upcoming Exams
          </CardTitle>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-[12px] text-[#374151] border border-[#D0D8FF] rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#3525CD] focus:border-[#3525CD] cursor-pointer"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate("")}
                className="text-[11px] text-[#6B7280] border border-[#E8EBF2] px-2 py-1.5 rounded-md hover:bg-gray-50 transition whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 sm:px-6 pb-5">

        {/* ── DESKTOP ── */}
        <div className="hidden md:block w-full">
          <table className="w-full table-fixed border-separate border-spacing-y-1">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[18%]" />
              <col className="w-[23%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wide px-3 py-2 text-left border-b border-[#F1F3F8]"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {/* Show skeleton while student resolves OR while fetching */}
              {!student?.classDetail?.id || isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              ) : error ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[12px] text-red-400">
                    {error}
                  </td>
                </tr>
              ) : upcoming.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-[12px] text-gray-400">
                    No upcoming exams scheduled
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-[#F8F9FF] transition cursor-default">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-3 py-3.5 text-sm text-[#374151] border-b border-[#F1F3F8]"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── MOBILE ── */}
        <div className="md:hidden flex flex-col gap-2">
          {!student?.classDetail?.id || isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
            ))
          ) : error ? (
            <p className="text-center text-[12px] text-red-400 py-4">{error}</p>
          ) : upcoming.length === 0 ? (
            <p className="text-center text-[12px] text-gray-400 py-4">
              No upcoming exams scheduled
            </p>
          ) : (
            upcoming.map((e, i) => (
              <div
                key={i}
                className="border border-[#E8EBF2] rounded-lg p-3 bg-white hover:border-[#3525CD] hover:bg-[#F8F9FF] transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="font-semibold text-[#0B1C30] text-sm">
                    {e.subject?.subject_name ?? "—"}
                  </p>
                  <span className="text-[11px] font-medium text-[#374151] bg-[#F4F6FA] border border-[#E8EBF2] px-2.5 py-1 rounded-md whitespace-nowrap">
                    {e.room_no || "—"}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <p><span className="font-medium text-gray-700">Date:</span> {fmtDate(e.exam_date)}</p>
                  <p><span className="font-medium text-gray-700">Day:</span> {fmtDay(e.exam_date)}</p>
                  <p><span className="font-medium text-gray-700">Time:</span> {fmtTime(e.start_time)} – {fmtTime(e.end_time)}</p>
                </div>
              </div>
            ))
          )}
        </div>

      </CardContent>
    </Card>
  )
}