import type { FeeHead, TransportSlab, ClassFeeStructure } from "../types/fees.types";
import { formatCurrency } from "../utils/Fee.utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface FeeStructureTabProps {
  feeHeads: FeeHead[];
  transportSlabs: TransportSlab[];
  classFeeStructure: ClassFeeStructure[];
  selectedClass: string;
  onClassChange: (cls: string) => void;
}

const CLASSES = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const FEE_HEAD_COLORS: Record<string, string> = {
  "Tuition Fee": "bg-indigo-500",
  "Exam Fee": "bg-green-500",
  "Library & Digital": "bg-purple-500",
  default: "bg-gray-400",
};

export function FeeStructureTab({
  feeHeads,
  transportSlabs,
  classFeeStructure,
  selectedClass,
  onClassChange,
}: FeeStructureTabProps) {
  const totalAnnual = classFeeStructure.reduce((sum, f) => sum + f.annualTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="flex items-center gap-1.5 text-sm">
          + Add Fee Head
        </Button>
        <Button className="flex items-center gap-1.5 text-sm">
          💾 Save Fee Structure
        </Button>
      </div>

      {/* Top row: Fee Heads + Transport Slabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fee Heads */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Fee Heads</h3>
          <p className="text-xs text-gray-400 mb-4">Define and manage primary fee categories for the academic year.</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Fee Head Name</TableHead>
                  <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Code</TableHead>
                  <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Mandatory</TableHead>
                  <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Taxable</TableHead>
                  <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">GST%</TableHead>
                  <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeHeads.map((fh) => (
                  <TableRow key={fh.id} className="border-b border-gray-50">
                    <TableCell className="py-2.5 font-medium text-gray-800">{fh.name}</TableCell>
                    <TableCell className="py-2.5 text-gray-500 text-xs">{fh.code}</TableCell>
                    <TableCell className="py-2.5">
                      {fh.mandatory
                        ? <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                        : <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />}
                    </TableCell>
                    <TableCell className="py-2.5 text-gray-600">{fh.taxable ? "Yes" : "No"}</TableCell>
                    <TableCell className="py-2.5 text-gray-600">{fh.gstPercent}%</TableCell>
                    <TableCell className="py-2.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        fh.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {fh.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Transport Fee Slabs */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Transport Fee Slabs</h3>
          <p className="text-xs text-gray-400 mb-4">Tiered pricing based on bus route distance.</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Slab</TableHead>
                <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Range</TableHead>
                <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Monthly</TableHead>
                <TableHead className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportSlabs.map((slab) => (
                <TableRow key={slab.slab} className="border-b border-gray-50">
                  <TableCell className="py-2.5 font-semibold text-indigo-600">{slab.slab}</TableCell>
                  <TableCell className="py-2.5 text-gray-600">{slab.range}</TableCell>
                  <TableCell className="py-2.5 font-semibold text-gray-800">{formatCurrency(slab.monthly)}</TableCell>
                  <TableCell className="py-2.5 text-gray-600">{slab.students}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="link" className="mt-3 text-xs font-semibold uppercase tracking-wide">
            Update Slabs
          </Button>
        </div>
      </div>

      {/* Class-wise fee structure */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="font-semibold text-gray-800">Class-wise Fee Structure</h3>
            <p className="text-xs text-gray-400">Configure individual amounts for different academic levels.</p>
          </div>
          <div className="flex gap-1">
            {CLASSES.map((cls) => (
              <Button
                key={cls}
                variant={selectedClass === cls ? "default" : "outline"}
                size="sm"
                onClick={() => onClassChange(cls)}
                className="text-xs font-semibold px-3 py-1.5"
              >
                {cls}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Fee Head</th>
                <th className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Billing Cycle</th>
                <th className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Due Date</th>
                <th className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Amount (₹)</th>
                <th className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Annual Total (₹)</th>
                <th className="text-left py-2 text-xs text-gray-400 font-semibold uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classFeeStructure.map((row) => (
                <tr key={row.feeHeadId} className="border-b border-gray-50">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-1 h-8 rounded-full ${FEE_HEAD_COLORS[row.feeHeadName] || FEE_HEAD_COLORS.default}`} />
                      <div>
                        <div className="font-semibold text-gray-800">{row.feeHeadName}</div>
                        <div className="text-xs text-gray-400">{row.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{row.billingCycle}</td>
                  <td className="py-3 text-gray-600">{row.dueDate}</td>
                  <td className="py-3 font-semibold text-gray-800">{formatCurrency(row.amount)}</td>
                  <td className="py-3 font-semibold text-gray-800">{formatCurrency(row.annualTotal)}</td>
                  <TableCell className="py-3">
                    <Button variant="ghost" size="sm" className="text-indigo-500 hover:text-indigo-700 p-0">
                      ✏️
                    </Button>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Total Annual Fee ({selectedClass})</span>
          <span className="text-lg font-bold text-indigo-600">{formatCurrency(totalAnnual)}</span>
        </div>
      </div>
    </div>
  );
}