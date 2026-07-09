import { useEffect, useState, useCallback } from "react";
import { X, Loader2, BookOpen, GraduationCap, Calendar, Phone, Mail, Briefcase, Award, Building2, CreditCard } from "lucide-react";
import type { StaffDetails, AssignedClassSubject } from "../types/staff.types";
import { getStaffDetailsById } from "@/services/school-staff.api";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";

interface Props {
  staffId: string;
  onClose: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const s = (status ?? "").toUpperCase();
  if (s === "ACTIVE")
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />Active</span>;
  if (s === "ON_LEAVE" || s === "ONLEAVE")
    return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />On Leave</span>;
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />Inactive</span>;
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | undefined }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value ?? "—"}</p>
    </div>
  </div>
);

const AssignmentCard = ({ item }: { item: AssignedClassSubject }) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100">
    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
      {item.class_name}
    </div>
    <div>
      <p className="text-sm font-bold text-gray-900">
        Class {item.class_name} — Section {item.section_name}
      </p>
      <p className="text-xs text-gray-500">{item.subject_name}</p>
    </div>
  </div>
);

export const StaffDetailModal = ({ staffId, onClose }: Props) => {
  const [data, setData] = useState<StaffDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showPhoto, setShowPhoto] = useState(false);

  const fetchData = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getStaffDetailsById(staffId)
      .then((res) => {
        console.log("[StaffDetailModal] data received", res);
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        console.error("[StaffDetailModal] fetch failed", err);
        if (!cancelled) setError(err?.message ?? "Failed to load");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [staffId]);

  useEffect(() => {
    const cancel = fetchData();
    return cancel;
  }, [fetchData, retryCount]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {data?.image ? (
              <button
                type="button"
                title="View photo"
                onClick={(e) => { e.stopPropagation(); setShowPhoto(true); }}
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-black/5 hover:ring-2 hover:ring-indigo-400 transition"
              >
                <img src={data.image} alt={data.name} className="w-full h-full object-cover" />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-base font-bold overflow-hidden">
                {data ? data.name.split(" ").map((p: string) => p[0]).join("").slice(0, 2).toUpperCase() : "—"}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">{data?.name ?? "Staff Details"}</h2>
              <p className="text-xs text-gray-400">{data?.emp_number ?? ""}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-600 font-medium">{error}</p>
              <button onClick={() => setRetryCount((c) => c + 1)} className="mt-2 text-xs font-bold text-red-700 underline hover:no-underline">
                Retry
              </button>
            </div>
          )}
          {data && (
            <>
              {/* Status & Department */}
              <div className="flex items-center justify-between">
                <StatusBadge status={data.status} />
                {data.department && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold">
                    <Briefcase className="w-3 h-3" />
                    {data.department.departmentName}
                  </span>
                )}
              </div>

              {/* Info grid */}
              <div className="rounded-2xl border border-gray-100 divide-y divide-gray-50 px-4">
                <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={data.email} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={data.phone} />
                <InfoRow icon={<Award className="w-4 h-4" />} label="Qualification" value={data.qualification ?? undefined} />
                <InfoRow icon={<Building2 className="w-4 h-4" />} label="Bank Account Name" value={data.bank_account_name ?? undefined} />
                <InfoRow icon={<CreditCard className="w-4 h-4" />} label="Account Number" value={data.bank_account_number ?? undefined} />
                <InfoRow icon={<CreditCard className="w-4 h-4" />} label="IFSC Code" value={data.ifsc_code ?? undefined} />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={data.date_of_birth ?? undefined} />
                <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="Date of Joining" value={data.date_of_join ?? undefined} />
              </div>

              {/* Leave Balance */}
              {(data.leavesBalance != null || data.leavesTaken != null) && (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Balance", value: data.leavesBalance ?? 0, color: "bg-green-50 text-green-700 border-green-100" },
                    { label: "Taken", value: data.leavesTaken ?? 0, color: "bg-amber-50 text-amber-700 border-amber-100" },
                    { label: "Pending", value: data.leavesPending ?? 0, color: "bg-red-50 text-red-700 border-red-100" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className={`rounded-xl border px-3 py-2.5 text-center ${color}`}>
                      <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{label}</p>
                      <p className="text-lg font-extrabold leading-tight">{value}</p>
                      <p className="text-[10px] opacity-60">days</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Assigned Classes & Subjects */}
              {data.assigned_classes_subjects.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    Assigned Classes &amp; Subjects
                  </h3>
                  <div className="space-y-2">
                    {data.assigned_classes_subjects.map((item, idx) => (
                      <AssignmentCard key={`${item.class_id}-${item.section_id}-${item.subject_id}-${idx}`} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showPhoto && data?.image && (
        <ImagePreviewModal
          src={data.image}
          alt={data.name}
          title={data.name}
          subtitle={data.emp_number}
          onClose={() => setShowPhoto(false)}
        />
      )}
    </div>
  );
};
