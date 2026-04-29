import type { AdmissionStage, EnquirySource } from "../types/Admissions.types";
import { Badge } from "@/components/ui/badge";

export const StageBadge = ({ stage }: { stage: AdmissionStage }) => {
  const map: Record<AdmissionStage, { variant: string; label: string }> = {
    ENQUIRY:      { variant: "blue", label: "Enquiry" },
    INTERVIEW:    { variant: "amber", label: "Interview" },
    DOCS_VERIFIED:{ variant: "violet", label: "Docs Verified" },
    CONFIRMED:    { variant: "emerald", label: "Confirmed" },
    DECLINED:     { variant: "red", label: "Declined" },
  };
  const { variant, label } = map[stage];
  return (
    <Badge variant={variant as any} className="text-[10px] font-bold uppercase tracking-wider">
      {label}
    </Badge>
  );
};

export const SourceBadge = ({ source }: { source: EnquirySource }) => {
  const map: Record<EnquirySource, string> = {
    "Walk-in":     "gray",
    "Phone Inquiry": "sky",
    "Social Media": "purple",
    "Referral":    "green",
    "Website":     "blue",
    "Newspaper Ad": "orange",
  };
  return (
    <Badge variant={map[source] as any} className="text-[10px] font-bold uppercase tracking-wider">
      {source}
    </Badge>
  );
};