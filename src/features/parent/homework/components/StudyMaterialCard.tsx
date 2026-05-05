// src/study-material/components/StudyMaterialCard.tsx

import type { StudyMaterial } from "../types/homework.types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import typography, { combineTypography } from "@/styles/typography";
import { Download, Link } from "lucide-react";

/* ── File Icons ── */
type FileIconConfig = { bg: string; color: string; label: string };

const FILE_ICONS: Record<string, FileIconConfig> = {
  pdf: { bg: "bg-red-50", color: "text-red-500", label: "PDF" },
  jpg: { bg: "bg-emerald-50", color: "text-emerald-500", label: "IMG" },
  doc: { bg: "bg-blue-50", color: "text-blue-500", label: "DOC" },
  link: { bg: "bg-[#EEEDFE]", color: "text-[#3525CD]", label: "LINK" },
};

export function StudyMaterialCard({ item }: { item: StudyMaterial }) {
  const icon = FILE_ICONS[item.type] ?? FILE_ICONS.pdf;

  return (
    <Card className="border border-[#E8EBF2] shadow-none bg-white transition-all duration-200 hover:border-[#3525CD] hover:shadow-md hover:scale-[1.02] group">
      <CardContent className="p-4 flex flex-col gap-3 h-full">

        <div className="flex items-start justify-between">
          <span className={combineTypography(typography.body.xs, "text-gray-400 uppercase tracking-wide group-hover:text-[#3525CD]")}>
            Uploaded {item.uploaded}
          </span>

          <div className={`w-8 h-8 rounded-lg ${icon.bg} flex items-center justify-center group-hover:border group-hover:border-[#3525CD]`}>
            <span className={`text-[9px] font-bold ${icon.color} group-hover:text-[#3525CD]`}>
              {icon.label}
            </span>
          </div>
        </div>

        <h3 className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30] leading-snug group-hover:text-[#3525CD]")}>
          {item.title}
        </h3>

        <p className={combineTypography(typography.body.xs, "text-gray-400 group-hover:text-[#3525CD]/70")}>
          {item.class} • {item.subject}
        </p>

        {item.isLink ? (
          <Button className="mt-auto w-full gap-2 bg-[#3525CD] text-white hover:bg-white hover:text-[#3525CD]">
            <Link size={13} strokeWidth={1.3} />
            Open Link
          </Button>
        ) : (
          <Button variant="outline" className="mt-auto w-full gap-2 border-[#E8EBF2] text-[#3525CD] hover:border-[#3525CD]">
            <Download size={12} strokeWidth={1.5} />
            Download
          </Button>
        )}

      </CardContent>
    </Card>
  );
}