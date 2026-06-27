import { useState } from "react";
import { Loader2, Tag, GraduationCap, CalendarDays, Info } from "lucide-react";

interface ConcessionRecord {
  id: string;
  discountType?: string;
  discountValue?: number;
  amount_type?: string;
  amount?: number;
  concessionType?: string;
  concession_type?: string;
  feeHeadName?: string;
  feeheadName?: string;
  effectiveFrom?: string;
  effective_until?: string;
  effectiveUntil?: string;
  effective_from?: string;
  reason?: string;
  className?: string;
  sectionName?: string;
  academicYear?: string;
}

const formatDate = (d?: string) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return d; }
};

const formatAmount = (row: ConcessionRecord) => {
  const type = row.discountType ?? row.amount_type;
  const value = row.discountValue ?? row.amount;
  if (type === "PERCENTAGE" || type === "percentage") return `${value ?? 0}%`;
  if (value != null) return `₹${Number(value).toLocaleString("en-IN")}`;
  return "—";
};

const TYPE_COLORS: Record<string, string> = {
  "Sibling Discount":     "bg-indigo-100 text-indigo-700",
  "Merit Scholarship":    "bg-emerald-100 text-emerald-700",
  "Staff Ward Discount":  "bg-amber-100 text-amber-700",
  "Financial Aid":        "bg-rose-100 text-rose-700",
};
const getTypeCls = (type?: string) =>
  TYPE_COLORS[type ?? ""] ?? "bg-blue-50 text-blue-700";

interface Props {
  studentId: string;
}

export const StudentConcessions = (_props: Props) => {
  const [concessions] = useState<ConcessionRecord[]>([]);
  const [loading]     = useState(false);

  const totalSaved = concessions
    .filter((c) => {
      const t = c.discountType ?? c.amount_type;
      return t === "fixed" || t === "FIXED";
    })
    .reduce((s, c) => s + (c.discountValue ?? c.amount ?? 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 animate-spin text-[#3525CD]" />
      </div>
    );
  }

  if (concessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <Tag className="w-7 h-7 text-blue-300" />
        </div>
        <p className="text-slate-700 font-semibold text-sm mb-1">No concessions applied</p>
        <p className="text-slate-400 text-xs">Contact the school office to enquire about fee concessions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Total Concessions
          </p>
          <p className="text-xl font-bold text-slate-800">{concessions.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">applied to your account</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
            Total Savings
          </p>
          <p className="text-xl font-bold text-emerald-600">
            {totalSaved > 0 ? `₹${totalSaved.toLocaleString("en-IN")}` : "—"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">in fixed discounts</p>
        </div>
      </div>

      {/* Concession cards */}
      <div className="flex flex-col gap-3">
        {concessions.map((c) => {
          const type  = c.concessionType ?? c.concession_type;
          const head  = c.feeHeadName ?? c.feeheadName;
          const from  = c.effectiveFrom ?? c.effective_from;
          const until = c.effectiveUntil ?? c.effective_until;

          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center shrink-0">
                <Tag className="w-5 h-5 text-[#3525CD]" />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getTypeCls(type)}`}>
                    {type ?? "Concession"}
                  </span>
                  {c.academicYear && (
                    <span className="text-[11px] text-slate-400">{c.academicYear}</span>
                  )}
                </div>

                {head && (
                  <p className="text-sm font-semibold text-slate-800 truncate">{head}</p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                  {(c.className || c.sectionName) && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <GraduationCap className="w-3 h-3" />
                      {[c.className, c.sectionName].filter(Boolean).join(" – ")}
                    </span>
                  )}
                  {from && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <CalendarDays className="w-3 h-3" />
                      {formatDate(from)}{until ? ` → ${formatDate(until)}` : ""}
                    </span>
                  )}
                  {c.reason && (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Info className="w-3 h-3" />
                      {c.reason}
                    </span>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div className="shrink-0 text-right">
                <p className="text-2xl font-bold text-[#3525CD]">{formatAmount(c)}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {(c.discountType ?? c.amount_type) === "PERCENTAGE" ||
                   (c.discountType ?? c.amount_type) === "percentage"
                    ? "percentage off"
                    : "fixed discount"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
