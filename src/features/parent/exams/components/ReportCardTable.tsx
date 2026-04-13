import type { ReportCard } from "../types/exam.types";
import { Card, CardContent } from "@/components/ui/card";
import typography, { combineTypography } from "@/styles/typography";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

export function ReportCardTable({ data }: { data: ReportCard }) {
  return (
    <div className="flex flex-col gap-4">

      {/* TABLE CARD */}
      <Card className="rounded-2xl overflow-hidden hover:shadow-md transition-shadow border-0 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="border-0">
                {["Subject", "UT1 (50)", "UT2 (50)", "Midterm (100)", "UT3 (50)", "Final (100)", "Total", "Grade"].map((h) => (
                  <TableHead key={h} className="border-0 text-gray-400">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.entries.map((e) => (
                <TableRow key={e.subject} className="border-0 hover:bg-[#F8FAFC] transition-colors">
                  <TableCell className="border-0 font-medium">{e.subject}</TableCell>
                  <TableCell className="border-0 text-gray-600">{e.ut1 ?? "—"}</TableCell>
                  <TableCell className="border-0 text-gray-600">{e.ut2 ?? "—"}</TableCell>
                  <TableCell className="border-0 text-gray-600">{e.midterm ?? "—"}</TableCell>
                  <TableCell className="border-0 text-gray-500">—</TableCell>
                  <TableCell className="border-0 text-gray-500">—</TableCell>
                  <TableCell className="border-0 text-gray-500">—</TableCell>
                  <TableCell className="border-0 text-gray-500">—</TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* NOTE + DOWNLOAD ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className={combineTypography(typography.body.small, "text-gray-400")}>
          — Upcoming exam score will be updated upon result declaration.
        </p>
        <button className="flex items-center gap-2 bg-[#006C49] hover:bg-[#0F0F1E] text-white text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap">
          ↓ Download Report Card PDF
        </button>
      </div>

      {/* GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

        {/* Class Percentile */}
        <Card className="rounded-2xl border-0 shadow-sm bg-[#EFF4FF] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
          <CardContent className="p-5">
            <div className="w-8 h-8 rounded-full bg-[#DBEAFE] flex items-center justify-center mb-3">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 12 L5 8 L8 10 L11 5 L14 7" stroke="#3525CD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="#3525CD" strokeWidth="1.3" />
                <path d="M5 8h6M5 5.5h6M5 10.5h4" stroke="#3525CD" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
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
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" stroke="#F97316" strokeWidth="1.3" />
                <path d="M8 5v3.5M8 10.5h.01" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
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