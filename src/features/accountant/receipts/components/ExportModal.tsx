import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";


const exportSchema = z.object({
  fromDate:    z.string().min(1, "From date is required"),
  toDate:      z.string().min(1, "To date is required"),
  classFilter: z.string(),
  paymentMode: z.enum(["All", "Cash", "UPI", "Cheque", "Bank Transfer"]),
  format:      z.enum(["PDF", "CSV", "Excel"]),
  include:     z.enum(["All payments", "Cash only", "UPI only", "Cheque only"]),
  emailAuto:   z.boolean(),
});

type ExportForm = z.infer<typeof exportSchema>;


const PAYMENT_MODES = ["All", "Cash", "UPI", "Cheque", "Bank Transfer"] as const;

const FORMATS = [
  { value: "PDF",   label: "PDF Report", icon: "📄" },
  { value: "CSV",   label: "CSV",        icon: "📊" },
  { value: "Excel", label: "Excel",      icon: "📗" },
] as const;

const INCLUDE_OPTIONS = [
  "All payments",
  "Cash only",
  "UPI only",
  "Cheque only",
] as const;


interface ExportModalProps {
  onClose: () => void;

  receiptCount?: number;
  totalAmount?: number;
  month?: string;
}


export const ExportModal = ({
  onClose,
  receiptCount = 248,
  totalAmount = 234000,
  month = "April 2025",
}: ExportModalProps) => {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ExportForm>({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      fromDate:    "01 Apr 2025",
      toDate:      "07 Apr 2025",
      classFilter: "All Classes",
      paymentMode: "All",
      format:      "PDF",
      include:     "All payments",
      emailAuto:   true,
    },
  });

  const values = watch();

  const onSubmit = (data: ExportForm) => {
    console.log("EXPORT DATA:", data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-gray-900">
            Export Transaction History
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Date Range */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Date Range
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From Date</label>
                 <input
        type="date"
        {...register("fromDate")}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
      />
                {errors.fromDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.fromDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To Date</label>
                 <input
        type="date"
        {...register("toDate")}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
      />
                {errors.toDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.toDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Class Filter */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Class Filter</label>
            <select
              {...register("classFilter")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-[#3525CD] focus:bg-white transition-colors"
            >
              <option>All Classes</option>
              {Array.from({ length: 10 }, (_, i) =>
                ["A", "B"].map((s) => (
                  <option key={`${i + 1}${s}`} value={`${i + 1}${s}`}>
                    {i + 1}{s}
                  </option>
                ))
              ).flat()}
            </select>
          </div>

          {/* Payment Mode */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Payment Mode
            </p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_MODES.map((mode) => (
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
          </div>

          {/* Format */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Format
            </p>
            <div className="grid grid-cols-3 gap-2">
              {FORMATS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("format", value)}
                  className={`py-2.5 px-2 border rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    values.format === value
                      ? "border-[#3525CD] bg-indigo-50 text-[#3525CD]"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Include */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Include
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INCLUDE_OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all text-xs font-medium ${
                    values.include === opt
                      ? "border-[#3525CD] bg-indigo-50 text-[#3525CD]"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="include"
                    value={opt}
                    checked={values.include === opt}
                    onChange={() => setValue("include", opt)}
                    className="accent-[#3525CD] w-3.5 h-3.5 flex-shrink-0"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* Email Auto-send */}
          <label
            className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
              values.emailAuto
                ? "border-[#3525CD] bg-indigo-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              {...register("emailAuto")}
              className="accent-[#3525CD] w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <div>
              <p className="text-xs font-medium text-gray-900">
                Email report automatically
              </p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">
                principal@school.edu
              </p>
            </div>
          </label>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Export will include{" "}
              <span className="font-semibold">{receiptCount} receipts</span> totalling{" "}
              <span className="font-semibold">Rs.{totalAmount.toLocaleString("en-IN")}</span>{" "}
              for {month}.
            </p>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0 flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="w-full flex items-center justify-center gap-2 bg-[#3525CD] hover:bg-[#2a1eb0] text-white"
          >
            <Download className="w-4 h-4" />
            Export Transaction History
          </Button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors py-1"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};