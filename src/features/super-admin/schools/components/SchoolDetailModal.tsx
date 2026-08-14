import { useEffect, useCallback } from "react";
import { X, Pencil, Building2, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSchoolDetail } from "../hooks/useSchools";

interface SchoolDetailModalProps {
  schoolId: string | null;
  onClose: () => void;
  onEdit?: (schoolId: string) => void;
}

const FEATURE_LABELS: Record<string, string> = {
  attendance: "Attendance",
  feeManagement: "Fee Management",
  reports: "Reports",
  broadcast: "Broadcast",
  admission: "Admission",
  parentApp: "Parent App",
  onlinePayment: "Online Payment",
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm text-slate-700 font-medium mt-0.5 break-words">{value || "—"}</p>
    </div>
  );
}

export default function SchoolDetailModal({ schoolId, onClose, onEdit }: SchoolDetailModalProps) {
  const open = !!schoolId;
  const { data: school, isLoading, isError } = useSchoolDetail(schoolId ?? "");

  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }, [onClose]);
  useEffect(() => {
    if (open) { document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [open, handleKey]);

  if (!open) return null;

  const activeFeatures = Object.entries(school?.subscription?.featureFlags ?? {}).filter(([, v]) => v);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-2xl flex flex-col rounded-t-2xl sm:rounded-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden border border-slate-100"
      >
        <div className="flex justify-center pt-3 sm:hidden flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        <div className="flex-shrink-0 flex items-start justify-between px-4 sm:px-7 pt-4 sm:pt-6 pb-4 sm:pb-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
              {school?.logo || school?.image ? (
                <img src={school.logo || school.image || ""} alt={school?.school_name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold text-slate-800 truncate">
                {school?.school_name ?? (isLoading ? "Loading…" : "School Details")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Code: {school?.school_code ?? "—"}</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 px-4 sm:px-7 pb-6 space-y-6">
          {isLoading && <p className="text-sm text-slate-400 py-8 text-center">Loading school details…</p>}
          {isError && <p className="text-sm text-red-500 py-8 text-center">Failed to load school details.</p>}

          {school && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                <InfoRow label="Principal Name" value={school.PrincipalName} />
                <InfoRow label="Phone" value={school.phone} />
                <InfoRow label="School Number" value={school.schoolNumber} />
                <InfoRow label="WhatsApp Number" value={school.whatsappNumber} />
                <InfoRow label="Email" value={school.email} />
                <InfoRow label="Website" value={school.website} />
                <InfoRow label="Board" value={school.board} />
                <InfoRow label="City / State" value={[school.city?.trim(), school.state?.trim()].filter(Boolean).join(", ")} />
                <InfoRow label="Pincode" value={school.pincode} />
                <InfoRow label="Established Year" value={school.establishedYear} />
                <InfoRow label="Total School Strength" value={school.totalSchoolstrength} />
                <div className="col-span-1 sm:col-span-2">
                  <InfoRow label="Address" value={school.address} />
                </div>
              </div>

              {(school.logo || school.image || school.principalphoto) && (
                <div className="flex flex-wrap gap-5">
                  {school.logo && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">School Logo</p>
                      <img src={school.logo} alt="School logo" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    </div>
                  )}
                  {school.image && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">School Photo</p>
                      <img src={school.image} alt="School" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    </div>
                  )}
                  {school.principalphoto && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">Principal Photo</p>
                      <img src={school.principalphoto} alt="Principal" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    </div>
                  )}
                </div>
              )}

              {school.subscription && (
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">Subscription Plan</p>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-slate-800 text-sm">{school.subscription.name}</p>
                      <p className="text-[#5b52f5] font-extrabold text-sm">
                        ₹{school.subscription.annualPrice.toLocaleString()}
                        <span className="text-xs font-normal text-slate-400">/yr</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-xs mb-3">
                      <p className="text-slate-500">Monthly Price: <span className="text-slate-700 font-medium">₹{school.subscription.monthlyPrice.toLocaleString()}</span></p>
                      <p className="text-slate-500">Student Limit: <span className="text-slate-700 font-medium">{school.subscription.studentLimit.toLocaleString()}</span></p>
                      <p className="text-slate-500">Pilot Fee: <span className="text-slate-700 font-medium">₹{school.subscription.pilotFee.toLocaleString()}</span></p>
                    </div>
                    {activeFeatures.length > 0 && (
                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-slate-200 pt-3">
                        {activeFeatures.map(([key]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                            <span className="text-[11px] text-slate-500">{FEATURE_LABELS[key] ?? key}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {school.subscription_status && (
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-2">Billing Status</p>
                  <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
                    <InfoRow label="Subscription Status" value={school.subscription_status} />
                    <InfoRow label="Active" value={school.is_active === false ? "No" : "Yes"} />
                    <InfoRow label="Last Payment" value={school.last_payment_date ? new Date(school.last_payment_date).toLocaleDateString() : null} />
                    <InfoRow label="Next Due Date" value={school.next_due_date ? new Date(school.next_due_date).toLocaleDateString() : null} />
                    <InfoRow label="Grace Period" value={school.grace_period_days ? `${school.grace_period_days} days` : null} />
                    {school.locked_at && (
                      <InfoRow label="Locked Reason" value={school.locked_reason} />
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-600 mb-2">Record Info</p>
                <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
                  <InfoRow label="Registered On" value={school.createdAt ? new Date(school.createdAt).toLocaleDateString() : null} />
                  <InfoRow label="Last Updated" value={school.updatedAt ? new Date(school.updatedAt).toLocaleDateString() : null} />
                  {/* Never render the encrypted secret values themselves — only whether the gateway has been set up. */}
                  <InfoRow label="Payment Gateway" value={school.razorpayKeyId ? "Configured" : "Not configured"} />
                  <InfoRow label="Tenant Database" value={school.db_name} />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-3 px-4 sm:px-7 py-4 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all">
            Close
          </Button>
          {onEdit && schoolId && (
            <Button type="button" variant="default" onClick={() => onEdit(schoolId)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Pencil className="w-3.5 h-3.5" />
              Edit School
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
