import { useState, useCallback } from "react";
import type { StudyMaterial } from "../types/homework.types";
import {
  FileText,
  Image,
  Link2,
  FileType2,
  Download,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";
import { downloadStudyMaterial } from "@/services/studymaterial.api";
import { downloadBlob } from "@/features/school-admin/attendance/utils/attendance.utils";
import toast from "react-hot-toast";

interface Props {
  item: StudyMaterial;
}

const iconConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; color: string }
> = {
  pdf: { icon: <FileType2 size={20} />, bg: "bg-red-50", color: "text-red-600" },
  img: { icon: <Image size={20} />, bg: "bg-green-50", color: "text-green-600" },
  link: { icon: <Link2 size={20} />, bg: "bg-blue-50", color: "text-blue-600" },
  doc: { icon: <FileText size={20} />, bg: "bg-blue-50", color: "text-blue-600" },
};

export const StudyMaterialCard = ({ item }: Props) => {
  const isLink = item.type === "link";
  const cfg = iconConfig[item.type] ?? iconConfig.doc;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await downloadStudyMaterial(item.id);
      downloadBlob(blob, item.title || "study-material");
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloading(false);
    }
  }, [item.id, item.title]);

  return (
  <div
  className="bg-white border border-gray-100 rounded-xl
             p-3 sm:p-4 shadow-sm flex flex-col gap-3
             transition-all duration-200 ease-in-out
             hover:shadow-md hover:border-indigo-200
             hover:-translate-y-[2px]"
>
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.color}`}
        >
          {cfg.icon}
        </div>

        <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-md active:scale-95 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-[14px] font-semibold text-gray-800 leading-snug line-clamp-2">
        {item.title}
      </h3>

      {/* Meta */}
      <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
        {item.className}{item.section ? ` - ${item.section}` : ""} • {item.subject}
        <br />
        {isLink ? "Added" : "Uploaded"} {item.uploadedDate}
      </p>

      {/* Action */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        {isLink ? (
          <a
            href={item.open_link ?? item.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full
                       py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700
                       active:scale-[0.98]
                       text-white text-xs sm:text-sm font-semibold rounded-lg
                       transition"
          >
            <ExternalLink size={13} />
            Open Link
          </a>
        ) : (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-1.5 w-full
                       py-2.5 sm:py-2 border border-gray-200
                       hover:bg-gray-50 active:scale-[0.98]
                       text-gray-600 text-xs sm:text-sm font-semibold rounded-lg
                       transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={13} className={downloading ? "animate-bounce" : ""} />
            {downloading ? "Downloading…" : "Download"}
          </button>
        )}
      </div>
    </div>
  );
};