// components/AddFeeConcessionModal.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Search, Pencil } from "lucide-react";
import typography from "@/styles/typography";

interface Student {
  id: string;
  name: string;
  class: string;
  admissionId: string;
  avatar: string;
}

interface AddFeeConcessionModalProps {
  onClose: () => void;
}

const CONCESSION_TYPES = [
  "Sibling Discount",
  "Merit Scholarship", 
  "Financial Aid",
  "Staff Ward",
  "Sports Quota",
  "Other",
];

const FEE_TYPES = [
  { id: "tuition", label: "Tuition Fee", checked: true },
  { id: "examination", label: "Examination", checked: false },
  { id: "transport", label: "Transport", checked: false },
  { id: "activity", label: "Activity", checked: false },
  { id: "library", label: "Library", checked: false },
  { id: "all", label: "All Fees", checked: false },
];

export function AddFeeConcessionModal({ onClose }: AddFeeConcessionModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>({
    id: "1",
    name: "Ravi Kumar",
    class: "Class 10A",
    admissionId: "ID: 2024098",
    avatar: "https://i.pravatar.cc/150?img=11",
  });
  const [concessionType, setConcessionType] = useState("Sibling Discount");
  const [amountType, setAmountType] = useState<"fixed" | "percentage">("fixed");
  const [amount, setAmount] = useState("1,000");
  const [applicableFees, setApplicableFees] = useState<string[]>(["tuition"]);
  const [reason, setReason] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("01 Apr 2025");
  const [effectiveUntil, setEffectiveUntil] = useState("31 Mar 2026");

  const toggleFee = (feeId: string) => {
    if (feeId === "all") {
      if (applicableFees.includes("all")) {
        setApplicableFees(["tuition"]);
      } else {
        setApplicableFees(FEE_TYPES.map(f => f.id));
      }
    } else {
      setApplicableFees(prev => 
        prev.includes(feeId) 
          ? prev.filter(id => id !== feeId)
          : [...prev, feeId]
      );
    }
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      student: selectedStudent,
      concessionType,
      amountType,
      amount,
      applicableFees,
      reason,
      effectiveFrom,
      effectiveUntil,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className={`${typography.heading.h6} font-semibold text-gray-900`}>
              Add Fee Concession
            </h2>
            <p className={`${typography.body.xs} text-gray-500 mt-0.5`}>
              Concession requires principal approval
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Student Selection */}
          <div>
            <label className={`${typography.body.small}  font-medium text-gray-700 block mb-1.5`}>
              Student <span className="text-red-500">*</span>
            </label>
            {!selectedStudent ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or admission ID..."
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className={`${typography.body.small} font-semibold text-gray-900`}>
                      {selectedStudent.name}
                    </p>
                    <p className={`${typography.body.small} text-gray-500`}>
                      {selectedStudent.class} • {selectedStudent.admissionId}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="p-1.5 hover:bg-blue-100 rounded text-blue-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Concession Type */}
          <div>
            <label className={`${typography.body.small} font-medium text-gray-700 block mb-1.5`}>
              Concession Type <span className="text-red-500">*</span>
            </label>
            <select
              value={concessionType}
              onChange={(e) => setConcessionType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {CONCESSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Type & Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${typography.body.small} font-medium text-gray-700 block mb-1.5`}>
                Amount Type <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setAmountType("fixed")}
                  className={`flex-1 py-2 text-xs font-medium ${
                    amountType === "fixed"
                      ? "bg-[#3525CD] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Fixed Amount
                </button>
                <button
                  onClick={() => setAmountType("percentage")}
                  className={`flex-1 py-2 text-xs font-medium ${
                    amountType === "percentage"
                      ? "bg-[#3525CD] text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Percentage
                </button>
              </div>
            </div>
            <div>
              <label className={`${typography.body.small} font-medium text-gray-700 block mb-1.5`}>
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  {amountType === "fixed" ? "Rs." : "%"}
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Applicable On */}
          <div>
            <label className={`${typography.body.small} font-medium text-gray-700 block mb-2`}>
              Applicable On <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FEE_TYPES.map((fee) => (
                <label
                  key={fee.id}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={applicableFees.includes(fee.id)}
                    onChange={() => toggleFee(fee.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#3525CD] focus:ring-blue-500"
                  />
                  <span className={`${typography.body.small} text-gray-700`}>
                    {fee.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className={`${typography.body.small} font-medium text-gray-700 block mb-1.5`}>
              Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for granting concession"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Effective Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${typography.body.small} font-medium text-gray-700 block mb-1.5`}>
                Effective From <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className={`${typography.body.small} font-medium text-gray-700 block mb-1.5`}>
                Effective Until
              </label>
              <input
                type="text"
                value={effectiveUntil}
                onChange={(e) => setEffectiveUntil(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 px-4 text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="h-9 px-4 text-sm bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
          >
            Add Concession
          </Button>
        </div>
      </div>
    </div>
  );
}