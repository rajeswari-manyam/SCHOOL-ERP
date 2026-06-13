// src/features/homework/components/StudyMaterialCard.tsx

import type { StudyMaterial } from "../../../../services/studymaterial.api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import typography, { combineTypography } from "@/styles/typography";
import { Download, Link } from "lucide-react";

/* ── File icon config ── */
type FileIconConfig = { bg: string; color: string; label: string };

const FILE_ICONS: Record<string, FileIconConfig> = {
  pdf:  { bg: "bg-red-50",       color: "text-red-500",      label: "PDF"  },
  jpg:  { bg: "bg-emerald-50",   color: "text-emerald-500",  label: "IMG"  },
  doc:  { bg: "bg-blue-50",      color: "text-blue-500",     label: "DOC"  },
  link: { bg: "bg-[#EEEDFE]",    color: "text-[#3525CD]",    label: "LINK" },
};

/** Derive icon type from pdf url or open_link presence */
function resolveIconType(item: StudyMaterial): string {
  if (item.open_link) return "link";
  if (item.pdf) {
    const ext = item.pdf.split(".").pop()?.toLowerCase() ?? "pdf";
    return FILE_ICONS[ext] ? ext : "pdf";
  }
  return "pdf";
}

/** Format upload_date → human-readable (e.g. "2 Apr") */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function StudyMaterialCard({ item }: { item: StudyMaterial }) {
  const iconType = resolveIconType(item);
  const icon     = FILE_ICONS[iconType] ?? FILE_ICONS.pdf;
  const isLink   = iconType === "link";

  const handleAction = () => {
    if (isLink && item.open_link) {
      window.open(item.open_link, "_blank", "noopener,noreferrer");
    } else if (item.pdf) {
      window.open(item.pdf, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card className="border border-[#E8EBF2] shadow-none bg-white transition-all duration-200 hover:border-[#3525CD] hover:shadow-md hover:scale-[1.02] group">
      <CardContent className="p-4 flex flex-col gap-3 h-full">

        <div className="flex items-start justify-between">
          <span className={combineTypography(typography.body.xs, "text-gray-400 uppercase tracking-wide group-hover:text-[#3525CD]")}>
            Uploaded {formatDate(item.upload_date)}
          </span>

          <div className={`w-8 h-8 rounded-lg ${icon.bg} flex items-center justify-center group-hover:border group-hover:border-[#3525CD]`}>
            <span className={`text-[9px] font-bold ${icon.color} group-hover:text-[#3525CD]`}>
              {icon.label}
            </span>
          </div>
        </div>

        {/* Title — use subject name */}
        <h3 className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30] leading-snug group-hover:text-[#3525CD]")}>
          {item.subject?.name ?? item.title}
        </h3>

        <p className={combineTypography(typography.body.xs, "text-gray-400 group-hover:text-[#3525CD]/70")}>
          {item.class?.name}
          {item.section?.name ? ` • ${item.section.name}` : ""}
        </p>

        {/* Download count badge */}
        {item.download > 0 && (
          <span className={combineTypography(typography.body.xs, "text-gray-300")}>
            {item.download} download{item.download !== 1 ? "s" : ""}
          </span>
        )}

        {isLink ? (
          <Button
            onClick={handleAction}
            className="mt-auto w-full gap-2 bg-[#3525CD] text-white hover:bg-white hover:text-[#3525CD]"
          >
            <Link size={13} strokeWidth={1.3} />
            Open Link
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleAction}
            className="mt-auto w-full gap-2 border-[#E8EBF2] text-[#3525CD] hover:border-[#3525CD]"
          >
            <Download size={12} strokeWidth={1.5} />
            Download
          </Button>
        )}

      </CardContent>
    </Card>
  );
}
