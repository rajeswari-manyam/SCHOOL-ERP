import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calculator,
  FlaskConical,
  FileText,
  Download,
} from "lucide-react";

import {
  homeworkCardData,
  homeworkSimpleData,
} from "../data/dashboard.data";
import type { HomeworkCardProps } from "../types/dashboard.types";

const subjectConfig: Record<
  string,
  { bg: string; iconBg: string; icon: React.ReactNode }
> = {
  ENGLISH: {
    bg: "bg-[#EEF2FF]",
    iconBg: "bg-[#C7D2FE]",
    icon: <BookOpen size={18} />,
  },
  MATHS: {
    bg: "bg-[#F0FDF4]",
    iconBg: "bg-[#BBF7D0]",
    icon: <Calculator size={18} />,
  },
  SCIENCE: {
    bg: "bg-[#FFF7ED]",
    iconBg: "bg-[#FED7AA]",
    icon: <FlaskConical size={18} />,
  },
};

const simpleIcons: Record<string, React.ReactNode> = {
  Mathematics: <Calculator size={16} />,
  Physics: <FlaskConical size={16} />,
  English: <BookOpen size={16} />,
};

export const HomeworkCard = ({
  variant = "card",
  data,
}: HomeworkCardProps) => {
  const list =
    data ??
    (variant === "simple" ? homeworkSimpleData : homeworkCardData);

  // ✅ DOWNLOAD FUNCTION
  const handleDownload = (url?: string, filename?: string) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "homework";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= SIMPLE VIEW =================
  if (variant === "simple") {
    return (
      <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">
        <CardHeader className="px-5 pt-5 pb-3 border-b border-[#F4F6FA]">
          <CardTitle className="text-[15px] font-semibold text-[#0B1C30]">
            Homework This Week
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4 flex flex-col gap-2">
          {list.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-xl bg-[#F8F9FF] hover:bg-[#EEF2FF] transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E8EBF2] flex items-center justify-center shrink-0">
                {simpleIcons[item.subject] ?? <FileText size={16} />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0B1C30] truncate">
                  {item.title}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item.fileUrl, item.title);
                }}
                className="text-[12px] text-[#3525CD] font-medium flex items-center gap-1.5 hover:underline shrink-0"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // ================= CARD VIEW =================
  return (
    <Card className="w-full rounded-xl border border-[#E8EBF2] shadow-none hover:border-[#3525CD] transition-colors">
      <CardHeader className="px-5 pt-5 pb-4 border-b border-[#F4F6FA]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
              Homework Overview
            </p>

            <CardTitle className="text-[22px] font-bold leading-tight flex items-center gap-2">
              <span className="bg-[#3525CD] text-white px-2.5 py-0.5 rounded-md text-[14px]">
                {list.length}
              </span>
              <span className="text-[#0B1C30]">
                Home Work For This Week
              </span>
            </CardTitle>

            <p className="text-[12px] text-gray-400 mt-0.5">
              Pending homework for this week
            </p>
          </div>

          <span className="text-[11px] font-semibold text-[#3525CD] bg-[#EEF2FF] px-2.5 py-1 rounded-full shrink-0">
            {list.length} pending
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-2">
        {list.map((item, i) => {
          const config = subjectConfig[item.subject] ?? {
            bg: "bg-gray-50",
            iconBg: "bg-gray-200",
            icon: <FileText size={18} />,
          };

          return (
            <div
              key={i}
              className={`${config.bg} flex items-center gap-4 px-4 py-3.5 rounded-xl hover:opacity-90 transition-opacity`}
            >
              <div
                className={`${config.iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}
              >
                {config.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#0B1C30] truncate">
                  {item.title}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(item.fileUrl, item.title);
                }}
                className="text-[12px] text-[#3525CD] flex items-center gap-1.5 font-medium hover:underline shrink-0"
              >
                <Download size={14} />
                Download
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};