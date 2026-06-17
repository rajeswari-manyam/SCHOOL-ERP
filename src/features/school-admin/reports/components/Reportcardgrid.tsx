import { useState } from "react";
import {
  Calendar, Banknote, Users, MessageCircle, UserPlus, IdCard, Loader2,
} from "lucide-react";
import type { ReportCard, ReportType, ReportFormat } from "../types/reports.types";
import { REPORT_CARDS } from "../utils/Report config";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ReactNode> = {
  calendar:        <Calendar className="w-5 h-5" />,
  banknote:        <Banknote className="w-5 h-5" />,
  users:           <Users className="w-5 h-5" />,
  "message-circle":<MessageCircle className="w-5 h-5" />,
  "user-plus":     <UserPlus className="w-5 h-5" />,
  "id-card":       <IdCard className="w-5 h-5" />,
};

// ─── Accent colour map ────────────────────────────────────────────────────────

const ACCENT: Record<string, { icon: string; pill: string }> = {
  indigo:  { icon: "bg-indigo-50 text-indigo-600",  pill: "bg-indigo-600 text-white border-indigo-600" },
  emerald: { icon: "bg-emerald-50 text-emerald-600", pill: "bg-emerald-600 text-white border-emerald-600" },
  blue:    { icon: "bg-blue-50 text-blue-600",       pill: "bg-blue-600 text-white border-blue-600" },
  green:   { icon: "bg-green-50 text-green-600",     pill: "bg-green-600 text-white border-green-600" },
  violet:  { icon: "bg-violet-50 text-violet-600",   pill: "bg-violet-600 text-white border-violet-600" },
  amber:   { icon: "bg-amber-50 text-amber-600",     pill: "bg-amber-600 text-white border-amber-600" },
};

const BADGE_STYLE: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  green:   "bg-green-50 text-green-700 border-green-200",
};

// ─── Single card ──────────────────────────────────────────────────────────────

interface CardProps {
  card: ReportCard;
  onGenerate: (type: ReportType, period: string, format: string) => void;
  generating?: boolean;
}

function ReportCardItem({ card, onGenerate, generating }: CardProps) {
  const [period, setPeriod]   = useState(card.periods[0]);
  const [formats, setFormats] = useState<Set<ReportFormat>>(new Set([card.formats[0]]));

  const accent = ACCENT[card.accentColor] ?? ACCENT.indigo;

  const toggleFormat = (f: ReportFormat) => {
    setFormats((prev) => {
      const next = new Set(prev);
      if (next.has(f) && next.size > 1) next.delete(f); // keep at least one
      else next.add(f);
      return next;
    });
  };

  const handleGenerate = () => {
    onGenerate(card.id, period, [...formats].join(","));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">

      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent.icon}`}>
          {ICONS[card.icon]}
        </div>
        {card.badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${BADGE_STYLE[card.badge.color] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
            {card.badge.label}
          </span>
        )}
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{card.title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{card.description}</p>
      </div>

      {/* Period pills */}
      {card.periods.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {card.periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                period === p
                  ? accent.pill
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Format checkboxes */}
      <div className="flex items-center gap-4">
        {card.formats.map((f) => (
          <label
            key={f}
            className="flex items-center gap-1.5 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              checked={formats.has(f)}
              onChange={() => toggleFormat(f)}
              className="w-3.5 h-3.5 rounded accent-indigo-600 cursor-pointer"
            />
            <span className={`text-xs font-bold ${f === "PDF" ? "text-red-500" : "text-emerald-600"}`}>
              {f}
            </span>
          </label>
        ))}
        {card.formats.length === 1 && card.formats[0] === "PDF" && (
          <span className="text-[10px] text-gray-400 italic">PDF Only</span>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full mt-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 transition-colors"
      >
        {generating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
        ) : (
          "Generate Report"
        )}
      </button>
    </div>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface Props {
  onGenerate: (type: ReportType, period: string, format: string) => void;
  generatingId?: ReportType | null;
}

const ReportCardGrid = ({ onGenerate, generatingId }: Props) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {REPORT_CARDS.map((card) => (
      <ReportCardItem
        key={card.id}
        card={card}
        onGenerate={onGenerate}
        generating={generatingId === card.id}
      />
    ))}
  </div>
);

export default ReportCardGrid;
