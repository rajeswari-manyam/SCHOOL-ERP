import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table, TableHeader, TableBody,
    TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { AddFeeHeadModal } from "./AddFeeStructure";
import { feeHeads, classes, classWiseFees } from "../data/fee.data";
import type { SectionType, ClassType } from "../types/fees.types";
import { formatINR } from "../utils/fee.utils";
import typography from "@/styles/typography";

const sections: SectionType[] = ["Section A", "Section B", "Both Same"];

export const FeeStructure = () => {
    const [showModal, setShowModal] = useState(false);
    const [activeClass, setActiveClass] = useState<ClassType>("Class 10");
    const [activeSection, setActiveSection] = useState<SectionType>("Both Same");

    return (
       <div className="px-5 pt-6 pb-7">
            {showModal && <AddFeeHeadModal onClose={() => setShowModal(false)} />}

            {/* ── Fee Heads ── */}
            <div className="mb-8 mt-2 overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-2">
                        <h3 className={`${typography.heading.h6} font-bold text-gray-800 uppercase tracking-tight`}>Fee Heads</h3>
                        <span className={`${typography.body.xs} font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded`}>
                            {feeHeads.length} CONFIGURED
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm" className={`${typography.body.xs} h-8 text-gray-600 flex-1 md:flex-none uppercase`}>
                            Copy Year
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`${typography.body.xs} h-8 text-[#3525CD] border border-[#3525CD] hover:bg-indigo-50 flex-1 md:flex-none uppercase`}
                            onClick={() => setShowModal(true)}
                        >
                            + Head
                        </Button>
                        <Button
                            size="sm"
                            className={`${typography.body.xs} h-8 bg-[#3525CD] hover:bg-[#2a1fb5] text-white flex-1 md:flex-none uppercase`}
                        >
                            Save
                        </Button>
                    </div>
                </div>

                <div className="hidden sm:block overflow-x-auto no-scrollbar rounded-xl border border-gray-100">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow className="bg-[#D3E4FE] hover:bg-[#D3E4FE]">
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase px-4`}>Head Name</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase`}>Code</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase`}>Description</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase`}>Mandatory</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase`}>Taxable</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase`}>GST%</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-center w-24`}>Status</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-right px-4 w-20`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {feeHeads.map((fh) => (
                                <TableRow key={fh.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0">
                                    <TableCell className={`${typography.body.small} font-medium text-gray-800 px-4`}>{fh.name}</TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-500`}>{fh.code}</TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-500`}>{fh.description}</TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-600`}>
                                        {fh.mandatory ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-600`}>
                                        {fh.taxable ? "Yes" : "No"}
                                    </TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-600`}>
                                        {fh.gst ?? "0%"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className={`${typography.body.xs} font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100`}>
                                            ACTIVE
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4">
                                        <div className="flex gap-2 justify-end">
                                            <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className={`${typography.body.small} text-indigo-600 mt-2 hover:underline`}
                >
                    + Add Fee Head
                </button>
            </div>

            {/* ── Class-wise Fee Structure ── */}
            <div>
                <h3 className={`${typography.heading.h6} font-bold text-gray-800 mb-3`}>Class-wise Fee Structure</h3>

                {/* Class + Section tabs row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex gap-2 min-w-0 overflow-x-auto no-scrollbar py-1">
                        {classes.map((cls) => (
                            <button
                                key={cls}
                                onClick={() => setActiveClass(cls)}
                                className={`px-4 py-1.5 whitespace-nowrap ${typography.body.xs} font-semibold rounded-full border transition-all ${activeClass === cls
                                    ? "bg-[#3525CD] text-white border-[#3525CD] shadow-sm"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                                    }`}
                            >
                                {cls}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-1 bg-gray-100 rounded-full p-1 self-start md:self-auto shadow-inner">
                        {sections.map((sec) => (
                            <button
                                key={sec}
                                onClick={() => setActiveSection(sec)}
                                className={`px-4 py-1 whitespace-nowrap ${typography.body.xs} font-bold rounded-full transition-all ${activeSection === sec
                                    ? "bg-white text-[#3525CD] shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {sec}
                            </button>
                        ))}
                    </div>
                </div>
{/* 📱 Mobile Fee Heads */}
<div className="sm:hidden space-y-3">
  {feeHeads.map((fh) => (
    <div key={fh.id} className="border rounded-xl p-3 bg-white shadow-sm">
      
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm">{fh.name}</span>
        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">
          ACTIVE
        </span>
      </div>

      <div className="text-xs text-gray-500 mt-1">{fh.code}</div>

      <div className="mt-2 text-xs space-y-1">
        <div><span className="text-gray-400">Mandatory:</span> {fh.mandatory ? "Yes" : "No"}</div>
        <div><span className="text-gray-400">Taxable:</span> {fh.taxable ? "Yes" : "No"}</div>
        <div><span className="text-gray-400">GST:</span> {fh.gst ?? "0%"}</div>
      </div>

      <div className="flex gap-3 mt-3">
        <button className="text-indigo-600 text-xs">Edit</button>
        <button className="text-red-500 text-xs">Delete</button>
      </div>
    </div>
  ))}
</div>
                <div className="overflow-x-auto no-scrollbar rounded-xl border border-gray-100 shadow-sm">
                    <Table className="min-w-[700px]">
                        <TableHeader>
                            <TableRow className="bg-[#D3E4FE] hover:bg-[#D3E4FE]">
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase px-4`}>Fee Head</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-center`}>Billing Cycle</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-right`}>Amount</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-center`}>Due Date</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-right`}>Annual Total</TableHead>
                                <TableHead className={`${typography.body.xs} font-semibold text-gray-500 uppercase text-right px-4 w-20`}>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classWiseFees.map((fee) => (
                                <TableRow key={fee.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                                    <TableCell className="px-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-[9px] font-bold text-indigo-600 border border-indigo-100 uppercase">
                                                {fee.feeHead[0]}
                                            </span>
                                            <span className={`${typography.body.small} font-medium text-gray-800`}>{fee.feeHead}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-500 text-center font-medium`}>{fee.billingCycle}</TableCell>
                                    <TableCell className={`${typography.body.small} text-gray-900 text-right font-bold`}>
                                        {fee.amount ? formatINR(fee.amount) : "Slab-based"}
                                    </TableCell>
                                    <TableCell className={`${typography.body.xs} text-gray-500 text-center font-medium`}>{fee.dueDate}</TableCell>
                                    <TableCell className={`${typography.body.small} font-bold text-indigo-700 text-right`}>
                                        {fee.annualTotal ? formatINR(fee.annualTotal) : "Variable"}
                                    </TableCell>
                                    <TableCell className="text-right px-4">
                                        <button className={`${typography.body.xs} font-bold text-[#3525CD] hover:underline uppercase`}>Edit</button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Total row */}
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg">
                    <span className={`${typography.body.small} font-semibold text-gray-700`}>Total Annual Fee</span>
                    <span className={`${typography.body.small} font-bold text-red-600`}>
                        {formatINR(classWiseFees.reduce((sum, f) => sum + (f.annualTotal ?? 0), 0))}
                    </span>
                </div>
            </div>
        </div>
      
    );
};