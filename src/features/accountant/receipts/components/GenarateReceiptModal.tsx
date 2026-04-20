// components/GenerateReceiptModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ========================
   ZOD SCHEMA
======================== */
const generateReceiptSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  admissionNo: z.string().min(1, "Admission number is required"),
  className: z.string().min(1, "Class is required"),
  fatherName: z.string().min(1, "Father name is required"),
  feeHead: z.string().min(1, "Fee head is required"),
  period: z.string().min(1, "Period is required"),
  amount: z.string().min(1, "Amount is required"),
  paymentMode: z.enum(["UPI", "Cash", "Cheque", "Bank Transfer"]),
  referenceNo: z.string().optional(),
  collectedBy: z.string().min(1, "Collected by is required"),
  sendWhatsApp: z.boolean(),
  sendEmail: z.boolean(),
  date: z.string().min(1, "Date is required"),
});

type GenerateReceiptForm = z.infer<typeof generateReceiptSchema>;

interface GenerateReceiptModalProps {
  onClose: () => void;
  onSuccess?: (receiptNo: string) => void;
}

const FEE_HEADS = [
  "Tuition Fee",
  "Exam Fee",
  "Transport Fee",
  "Activity Fee",
  "Library Fee",
  "Lab Fee",
  "Sports Fee",
];

const CLASSES = [
  "1A","1B","2A","2B","3A","3B","4A","4B",
  "5A","5B","6A","6B","7A","7B","8A","8B",
  "9A","9B","10A","10B",
];

const PERIODS = [
  "April 2025","May 2025","June 2025","July 2025",
  "August 2025","September 2025","October 2025",
  "November 2025","December 2025","January 2026",
  "February 2026","March 2026",
];

export const GenerateReceiptModal = ({ onClose, onSuccess }: GenerateReceiptModalProps) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [generatedReceiptNo, setGeneratedReceiptNo] = useState("");

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateReceiptForm>({
    resolver: zodResolver(generateReceiptSchema),
    defaultValues: {
      paymentMode: "UPI",
      sendWhatsApp: true,
      sendEmail: false,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      }),
      collectedBy: "Ramu Teja",
    },
  });

  const values = watch();

  const onSubmit = (data: GenerateReceiptForm) => {
    const receiptNo = `RCP-2025-0${Math.floor(800 + Math.random() * 100)}`;
    setGeneratedReceiptNo(receiptNo);
    setStep("success");
    onSuccess?.(receiptNo);
  };

  /* ── SUCCESS STATE ─────────────────────────────── */
  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-9 h-9 text-green-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Receipt Generated!</h3>
              <p className="text-sm text-gray-500 mt-1">
                Receipt <span className="font-semibold text-[#3525CD]">{generatedReceiptNo}</span> has been created successfully.
              </p>
            </div>
            {values.sendWhatsApp && (
              <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                ✓ Sent via WhatsApp
              </p>
            )}
            <div className="flex gap-2 w-full pt-2">
              <Button
                className="flex-1 bg-[#3525CD] hover:bg-[#2a1fb5] text-white text-xs h-9"
                onClick={onClose}
              >
                View Receipt
              </Button>
              <Button
                variant="outline"
                className="flex-1 text-xs h-9 border-gray-200"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORM STATE ────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[92vh] overflow-hidden">

        {/* HEADER — fixed */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#3525CD]" />
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900 tracking-tight">
              Generate Receipt
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* BODY — scrollable */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* SECTION: Student Info */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Student Information
            </p>
            <div className="space-y-3">

              {/* Student Name + Adm No */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Student Name
                  </label>
                  <input
                    {...register("studentName")}
                    placeholder="e.g. Ravi Kumar"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  />
                  {errors.studentName && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.studentName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Adm No
                  </label>
                  <input
                    {...register("admissionNo")}
                    placeholder="ADM001"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  />
                  {errors.admissionNo && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.admissionNo.message}</p>
                  )}
                </div>
              </div>

              {/* Father Name + Class */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Father's Name
                  </label>
                  <input
                    {...register("fatherName")}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  />
                  {errors.fatherName && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.fatherName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Class
                  </label>
                  <select
                    {...register("className")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  >
                    <option value="">Select</option>
                    {CLASSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {errors.className && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.className.message}</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION: Fee Details */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Fee Details
            </p>
            <div className="space-y-3">

              {/* Fee Head + Period */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Fee Head
                  </label>
                  <select
                    {...register("feeHead")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  >
                    <option value="">Select</option>
                    {FEE_HEADS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                  {errors.feeHead && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.feeHead.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Period
                  </label>
                  <select
                    {...register("period")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  >
                    <option value="">Select</option>
                    {PERIODS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  {errors.period && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.period.message}</p>
                  )}
                </div>
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Amount (Rs.)
                  </label>
                  <input
                    {...register("amount")}
                    placeholder="e.g. 8500"
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  />
                  {errors.amount && (
                    <p className="text-[10px] text-red-500 mt-1">{errors.amount.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Date
                  </label>
                  <input
                    {...register("date")}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* SECTION: Payment Mode */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Payment Mode
            </p>
            <div className="flex flex-wrap gap-2">
              {(["UPI", "Cash", "Cheque", "Bank Transfer"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setValue("paymentMode", mode)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    values.paymentMode === mode
                      ? "bg-[#3525CD] border-[#3525CD] text-white shadow-sm"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:border-[#3525CD] hover:text-[#3525CD]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Reference No — only for non-cash */}
            {values.paymentMode !== "Cash" && (
              <div className="mt-3">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Reference / Transaction No
                </label>
                <input
                  {...register("referenceNo")}
                  placeholder="e.g. 123456789012"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors font-mono"
                />
              </div>
            )}
          </div>

          {/* SECTION: Collected By */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Collected By
            </label>
            <input
              {...register("collectedBy")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
            />
          </div>

          {/* SECTION: Notify */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              Notify Parent
            </p>
            <div className="space-y-2">
              <label
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  values.sendWhatsApp
                    ? "border-green-400 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  {...register("sendWhatsApp")}
                  className="w-4 h-4 accent-green-500 flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Send via WhatsApp</p>
                  <p className="text-[10px] text-gray-500">Receipt PDF sent to parent's number</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  values.sendEmail
                    ? "border-[#3525CD] bg-indigo-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  {...register("sendEmail")}
                  className="w-4 h-4 accent-[#3525CD] flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Send via Email</p>
                  <p className="text-[10px] text-gray-500">Receipt PDF sent to parent's email</p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* FOOTER — fixed */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full flex items-center justify-center gap-2 bg-[#3525CD] hover:bg-[#2a1fb5] text-white h-10"
          >
            <FileText className="w-4 h-4" />
            Generate Receipt
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors py-1 text-center"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};