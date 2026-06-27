// src/features/homework/components/StudyMaterialCard.tsx

import { useState, useCallback } from "react";
import type { StudyMaterial } from "../../../../services/studymaterial.api";
import { downloadStudyMaterial } from "../../../../services/studymaterial.api";
import { downloadBlob } from "@/features/school-admin/attendance/utils/attendance.utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import typography, { combineTypography } from "@/styles/typography";
import { Download, Link } from "lucide-react";

import toast from "react-hot-toast";

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
  const [downloading, setDownloading] = useState(false);

  const handleAction = useCallback(async () => {
    if (isLink && item.open_link) {
      window.open(item.open_link, "_blank", "noopener,noreferrer");
      return;
    }
    setDownloading(true);
    try {
      const blob = await downloadStudyMaterial(item.id);
      const filename = item.title || "study-material";
      downloadBlob(blob, filename);
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloading(false);
    }
  }, [isLink, item.open_link, item.id, item.title]);
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

        {/* Title */}
        <h3 className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30] leading-snug group-hover:text-[#3525CD]")}>
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className={combineTypography(typography.body.xs, "text-gray-500 line-clamp-2")}>
            {item.description}
          </p>
        )}

        {/* Meta: subject · class · section */}
        <p className={combineTypography(typography.body.xs, "text-gray-400 group-hover:text-[#3525CD]/70")}>
          {item.subject?.name && <span className="font-medium">{item.subject.name}</span>}
          {item.subject?.name && (item.class?.name || item.section?.name) && " · "}
          {item.class?.name}
          {item.section?.name ? ` · ${item.section.name}` : ""}
        </p>

        {/* Teacher */}
        {item.teacher?.name && (
          <p className={combineTypography(typography.body.xs, "text-gray-400")}>
            By {item.teacher.name}
          </p>
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
            disabled={downloading}
            className="mt-auto w-full gap-2 border-[#E8EBF2] text-[#3525CD] hover:border-[#3525CD] disabled:opacity-50"
          >
            <Download size={12} strokeWidth={1.5} className={downloading ? "animate-bounce" : ""} />
            {downloading ? "Downloading…" : "Download"}
          </Button>
        )}

      </CardContent>
    </Card>
  );
}
