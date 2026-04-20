import type { AdmissionStage, EnquirySource } from "../types/admissions.types";

export const StageBadge = ({ stage }: { stage: AdmissionStage }) => {
  const map: Record<AdmissionStage, { cls: string; label: string }> = {
    ENQUIRY:      { cls: "bg-blue-50 text-blue-700 border border-blue-200",     label: "Enquiry" },
    INTERVIEW:    { cls: "bg-amber-50 text-amber-700 border border-amber-200",  label: "Interview" },
    DOCS_VERIFIED:{ cls: "bg-violet-50 text-violet-700 border border-violet-200", label: "Docs Verified" },
    CONFIRMED:    { cls: "bg-emerald-50 text-emerald-700 border border-emerald-200", label: "Confirmed" },
    DECLINED:     { cls: "bg-red-50 text-red-700 border border-red-200",        label: "Declined" },
  };
  const { cls, label } = map[stage];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
};

export const SourceBadge = ({ source }: { source: EnquirySource }) => {
  const map: Record<EnquirySource, string> = {
    "Walk-in":     "bg-gray-100 text-gray-600 border border-gray-200",
    "Phone Inquiry": "bg-sky-50 text-sky-700 border border-sky-200",
    "Social Media": "bg-purple-50 text-purple-700 border border-purple-200",
    "Referral":    "bg-green-50 text-green-700 border border-green-200",
    "Website":     "bg-blue-50 text-blue-700 border border-blue-200",
    "Newspaper Ad": "bg-orange-50 text-orange-700 border border-orange-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[source] ?? "bg-gray-100 text-gray-600"}`}>
      {source}
    </span>
  );
};