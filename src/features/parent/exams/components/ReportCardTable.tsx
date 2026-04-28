import type { ReportCard, ReportCardEntry } from "../types/exam.types";
import { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { TrendingUp, BookOpen, AlertCircle, Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ─── Types ────────────────────────────────────────────────────────────────────

type TableRow = ReportCardEntry & {
  ut3?: number | null;
  final?: number | null;
  total?: number | null;
  grade?: string | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeGrade(total?: number | null): string | null {
  if (total == null) return null;
  const pct = (total / 350) * 100; // 50+50+100+50+100 = 350 max
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "D";
}

const GRADE_STYLES: Record<string, string> = {
  "A+": "bg-emerald-50 text-emerald-700",
  A: "bg-emerald-50 text-emerald-700",
  "B+": "bg-blue-50 text-blue-700",
  B: "bg-blue-50 text-blue-700",
  C: "bg-amber-50 text-amber-700",
  D: "bg-red-50 text-red-600",
};

// ─── Column helper ────────────────────────────────────────────────────────────

const col = createColumnHelper<TableRow>();

const columns: ColumnDef<TableRow, any>[] = [
  col.accessor("subject", {
    header: "Subject",
    cell: (info) => (
      <span className="font-medium text-[#0B1C30]">{info.getValue()}</span>
    ),
    size: 160,
  }),
  col.accessor("ut1", {
    header: "UT1 (50)",
    cell: (info) =>
      info.getValue() != null ? (
        <span className="text-gray-700">{info.getValue()}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
    size: 90,
  }),
  col.accessor("ut2", {
    header: "UT2 (50)",
    cell: (info) =>
      info.getValue() != null ? (
        <span className="text-gray-700">{info.getValue()}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
    size: 90,
  }),
  col.accessor("midterm", {
    header: "Midterm (100)",
    cell: (info) =>
      info.getValue() != null ? (
        <span className="text-gray-700">{info.getValue()}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
    size: 120,
  }),
  col.accessor("ut3", {
    header: "UT3 (50)",
    cell: () => <span className="text-gray-300">—</span>,
    size: 90,
  }),
  col.accessor("final", {
    header: "Final (100)",
    cell: () => <span className="text-gray-300">—</span>,
    size: 100,
  }),
  col.accessor("total", {
    header: "Total",
    cell: (info) =>
      info.getValue() != null ? (
        <span className="font-semibold text-[#0B1C30]">{info.getValue()}</span>
      ) : (
        <span className="text-gray-300">—</span>
      ),
    size: 80,
  }),
  col.accessor("grade", {
    header: "Grade",
    cell: (info) => {
      const grade = info.getValue();
      if (!grade) return <span className="text-gray-300">—</span>;
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            GRADE_STYLES[grade] ?? "bg-gray-100 text-gray-500"
          }`}
        >
          {grade}
        </span>
      );
    },
    size: 70,
  }),
];

// ─── Main component ───────────────────────────────────────────────────────────

export function ReportCardTable({ data }: { data: ReportCard }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,           // retina quality
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`report-card-${data.entries[0]?.subject ? "student" : "report"}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  // Enrich entries with computed total & grade
  const rows: TableRow[] = useMemo(
    () =>
      data.entries.map((e) => {
        const known = [e.ut1, e.ut2, e.midterm].filter((v) => v != null);
        const total = known.length === 3 ? known.reduce((a, b) => a! + b!, 0) : null;
        return {
          ...e,
          ut3: null,
          final: null,
          total,
          grade: computeGrade(total),
        };
      }),
    [data.entries]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const tableRows = table.getRowModel().rows;

  return (
    <div className="flex flex-col gap-4">

      {/* ── CAPTURE ZONE (ref wraps everything printed to PDF) ──────────── */}
      <div ref={cardRef} className="flex flex-col gap-4 bg-white p-4 rounded-2xl">

      {/* ── TABLE CARD ──────────────────────────────────────────────────── */}
      <Card className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {/* TableVirtuoso handles virtualised rows; fixedHeaderContent pins the <thead> */}
            <TableVirtuoso
              data={tableRows}
              style={{ height: Math.min(rows.length * 48 + 44, 340), minWidth: 900 }}
              fixedHeaderContent={() =>
                headerGroups.map((hg) => (
                  <tr key={hg.id} className="bg-[#F8FAFC] border-0">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        className="px-4 py-3 text-left text-[12px] font-medium text-gray-400 border-0 whitespace-nowrap"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))
              }
              itemContent={(_, row) => (
                <>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="px-4 py-3 text-[13px] border-0 border-b border-gray-50"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </>
              )}
              components={{
                // Renders the wrapping <table> so Virtuoso works inside our scroll container
                Table: ({ style, ...props }) => (
                  <table
                    {...props}
                    style={{ ...style, tableLayout: "fixed", width: "100%" }}
                    className="min-w-[900px]"
                  />
                ),
                TableRow: ({ style, ...props }) => (
                  <tr
                    {...props}
                    style={style}
                    className="border-0 hover:bg-[#F8FAFC] transition-colors"
                  />
                ),
              }}
            />
          </div>
        </CardContent>
      </Card>

      </div>{/* end cardRef capture zone */}

      {/* ── NOTE + DOWNLOAD ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className={combineTypography(typography.body.small, "text-gray-400")}>
          — Upcoming exam score will be updated upon result declaration.
        </p>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-[#006C49] hover:bg-[#0F0F1E] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          {downloading ? (
            <Loader2 size={13} strokeWidth={2.2} className="animate-spin" />
          ) : (
            <Download size={13} strokeWidth={2.2} />
          )}
          {downloading ? "Generating PDF…" : "Download Report Card PDF"}
        </button>
      </div>

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* Class Percentile */}
        <Card className="rounded-2xl border-0 shadow-sm bg-[#EFF4FF] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <CardContent className="p-5">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center mb-3">
              <TrendingUp size={15} color="#3525CD" strokeWidth={2} />
            </div>
            <p className="text-[11px] text-gray-500 mb-1">Class Percentile</p>
            <div className="text-[28px] font-extrabold text-[#3525CD] leading-none">
              {data.classPercentile}
              <span className="text-[14px] font-normal text-gray-400 ml-0.5">th</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
              Top 15% of Class 10A based on Midterm performance.
            </p>
          </CardContent>
        </Card>

        {/* Strongest Subject */}
        <Card className="rounded-2xl border-0 shadow-sm bg-[#EFF4FF] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <CardContent className="p-5">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center mb-3">
              <BookOpen size={15} color="#3525CD" strokeWidth={2} />
            </div>
            <p className="text-[11px] text-gray-500 mb-1">Strongest Subject</p>
            <p className={combineTypography(typography.heading.h4, "text-[#0B1C30]")}>
              {data.strongestSubject}
            </p>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
              Average score: 87%. Consistently high performance in all UTs.
            </p>
          </CardContent>
        </Card>

        {/* Attention Required */}
        <Card className="rounded-2xl border-0 shadow-sm bg-[#EFF4FF] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <CardContent className="p-5">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3">
              <AlertCircle size={15} color="#F97316" strokeWidth={2} />
            </div>
            <p className="text-[11px] text-orange-500 mb-1">Attention Required</p>
            <p className={combineTypography(typography.heading.h4, "text-[#0B1C30]")}>
              {data.attentionSubject}
            </p>
            <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
              {data.attentionNote}
            </p>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}