import type { StudyMaterial } from "../types/homework.types";
import { FileText, Image, Link2, FileType2, Download, ExternalLink, MoreHorizontal } from "lucide-react";

interface Props {
  item: StudyMaterial;
}

const iconConfig: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  pdf:  { icon: <FileType2 size={20} />, bg: "bg-red-50",    color: "text-red-600"   },
  img:  { icon: <Image size={20} />,     bg: "bg-green-50",  color: "text-green-600" },
  link: { icon: <Link2 size={20} />,     bg: "bg-blue-50",   color: "text-blue-600"  },
  doc:  { icon: <FileText size={20} />,  bg: "bg-blue-50",   color: "text-blue-600"  },
};

export const StudyMaterialCard = ({ item }: Props) => {
  const isLink = item.type === "link";
  const cfg = iconConfig[item.type] ?? iconConfig.doc;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col gap-3">

      {/* Icon + More menu */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.color}`}>
          {cfg.icon}
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
        {item.title}
      </h3>

      {/* Meta */}
      <p className="text-xs text-gray-400 leading-relaxed">
        Class 10A • {item.subject}
        <br />
        {isLink ? "Added" : "Uploaded"} {item.uploadedDate}
      </p>

      {/* Action button */}
      <div className="mt-auto pt-3 border-t border-gray-100">
        {isLink ? (
          <button className="flex items-center justify-center gap-1.5 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition">
            <ExternalLink size={13} />
            Open Link
          </button>
        ) : (
          <button className="flex items-center justify-center gap-1.5 w-full py-2 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition">
            <Download size={13} />
            Download
          </button>
        )}
      </div>
    </div>
  );
};