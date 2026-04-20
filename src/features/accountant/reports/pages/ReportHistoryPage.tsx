// pages/ReportHistoryPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    ChevronRight,
    Download,
    Search,
    Filter,
    FileText,
    FileSpreadsheet
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "../utils/report.utils";
import { mockReports } from "../data/report.data";

// 👇 typography import
import { typography, combineTypography } from "../../../../styles/typography";

const FORMAT_COLORS: Record<string, string> = {
    PDF: "bg-rose-100 text-rose-700",
    Excel: "bg-emerald-100 text-emerald-700",
};

export default function ReportHistoryPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [formatFilter, setFormatFilter] = useState<"All" | "PDF" | "Excel">("All");

    const filtered = mockReports.filter((report) => {
        const matchesSearch =
            report.name.toLowerCase().includes(search.toLowerCase());

        const matchesFormat =
            formatFilter === "All" || report.format === formatFilter;

        return matchesSearch && matchesFormat;
    });

    return (
        <div className="flex min-h-screen bg-[#E5EEFF]/50">
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-3 py-4 sm:p-6 space-y-6">

                    {/* Header */}
                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1 flex-wrap">
                               <Button
  onClick={() => navigate("/accountant/reports")}
  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
>
                                    ← Back to Reports
                                </Button>

                                <span>Dashboard</span>
                                <ChevronRight className="w-4 h-4" />

                                <button
                                    onClick={() => navigate("/accountant/reports")}
                                    className="hover:text-indigo-600 transition-colors"
                                >
                                    Reports
                                </button>

                                <ChevronRight className="w-4 h-4" />
                                <span className="text-gray-700 font-medium">All History</span>
                            </div>

                            <h1 className={combineTypography(typography.heading.h4, "text-gray-900")}>
                                Report History
                            </h1>

                            <p className="text-sm text-gray-600">
                                All previously generated reports
                            </p>
                        </div>

                        <Button
                            onClick={() => navigate("/accountant/reports")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                        >
                            <FileText className="w-4 h-4" />
                            Generate New Report
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">

                      <div className="relative w-full sm:flex-1 sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search reports..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 text-sm"
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-gray-400" />

                            {(["All", "PDF", "Excel"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFormatFilter(f)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                                        formatFilter === f
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead>#</TableHead>
                                        <TableHead>Report Name</TableHead>
                                        <TableHead className="hidden sm:table-cell">Generated On</TableHead>
                                        <TableHead className="hidden md:table-cell">Period</TableHead>
                                        <TableHead>Format</TableHead>
                                        <TableHead className="hidden md:table-cell">Generated By</TableHead>
                                        <TableHead className="text-center">Download</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                                                No reports found matching your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((report, idx) => (
                                           <TableRow key={report.id} className="hover:bg-gray-50/50 text-sm">

                                                <TableCell className="text-sm text-gray-400">
                                                    {idx + 1}
                                                </TableCell>

                                              <TableCell className="font-medium text-sm text-gray-900 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {report.format === "PDF" ? (
                                                            <FileText className="w-4 h-4 text-rose-400" />
                                                        ) : (
                                                            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                                                        )}
                                       <span className="truncate max-w-[140px] sm:max-w-none">
                                                            {report.name}
                                                        </span>
                                                    </div>
                                                </TableCell>

                                                <TableCell className="hidden sm:table-cell text-sm text-gray-600">
                                                    {formatDateTime(report.generatedAt)}
                                                </TableCell>

                                                <TableCell className="hidden md:table-cell text-sm text-gray-600">
                                                    {report.period}
                                                </TableCell>

                                                <TableCell>
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${FORMAT_COLORS[report.format]}`}>
                                                        {report.format}
                                                    </span>
                                                </TableCell>

                                                <TableCell className="hidden md:table-cell text-sm text-gray-600">
                                                    {report.generatedBy}
                                                </TableCell>

                                                <TableCell className="text-center">
                                                    <Button size="sm" variant="ghost">
                                                        <Download className="w-4 h-4 text-indigo-600" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}