import type { StudyMaterial } from "../types/types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import typography, { combineTypography } from "@/styles/typography";

/* ── Icons ── */
const DownloadIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path
      d="M7 1v8M4 6l3 3 3-3M1 12h12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M5.5 8.5l3-3M8 5l1.5-1.5a2.12 2.12 0 013 3L11 8M6 9l-1.5 1.5a2.12 2.12 0 01-3-3L3 6"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

/* ── File Icons ── */
const FILE_ICONS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  pdf: { bg: "bg-red-50", color: "text-red-500", label: "PDF" },
  jpg: { bg: "bg-emerald-50", color: "text-emerald-500", label: "IMG" },
  doc: { bg: "bg-blue-50", color: "text-blue-500", label: "DOC" },
  link: { bg: "bg-[#EEEDFE]", color: "text-[#3525CD]", label: "LINK" },
};

/* =========================
   StudyMaterialCard
========================= */
export function StudyMaterialCard({ item }: { item: StudyMaterial }) {
  const icon = FILE_ICONS[item.type] ?? FILE_ICONS.pdf;

  return (
    <Card
      className="
        border border-[#E8EBF2]
        shadow-none
        bg-white
        transition-all duration-200

        hover:border-[#3525CD]
        hover:shadow-md
        hover:scale-[1.02]

        group
      "
    >
      <CardContent className="p-4 flex flex-col gap-3 h-full">

        {/* Top row */}
        <div className="flex items-start justify-between">
          <span
            className={combineTypography(
              typography.body.xs,
              "text-gray-400 uppercase tracking-wide group-hover:text-[#3525CD]"
            )}
          >
            Uploaded {item.uploaded}
          </span>

          <div
            className={`w-8 h-8 rounded-lg ${icon.bg} flex items-center justify-center group-hover:border group-hover:border-[#3525CD]`}
          >
            <span
              className={`text-[9px] font-bold ${icon.color} group-hover:text-[#3525CD]`}
            >
              {icon.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={combineTypography(
            typography.body.small,
            "font-semibold text-[#0B1C30] leading-snug group-hover:text-[#3525CD]"
          )}
        >
          {item.title}
        </h3>

        {/* Meta */}
        <p
          className={combineTypography(
            typography.body.xs,
            "text-gray-400 group-hover:text-[#3525CD]/70"
          )}
        >
          {item.class} • {item.subject}
        </p>

        {/* Button */}
        {item.isLink ? (
          <Button className="mt-auto w-full gap-2 bg-[#3525CD] text-white hover:bg-white hover:text-[#3525CD] transition-all">
            <LinkIcon />
            Open Link
          </Button>
        ) : (
          <Button
            variant="outline"
            className="mt-auto w-full gap-2 border-[#E8EBF2] text-[#3525CD] hover:border-[#3525CD] hover:text-[#3525CD] hover:bg-white transition-all"
          >
            <DownloadIcon />
            Download
          </Button>
        )}

      </CardContent>
    </Card>
  );
}