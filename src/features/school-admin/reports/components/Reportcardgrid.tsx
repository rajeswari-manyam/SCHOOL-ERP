import { useState, type ChangeEventHandler, type ReactNode } from "react";
import { Calendar, Banknote, Users, MessageCircle, UserPlus, IdCard } from "lucide-react";
import type { ReportCard, ReportType } from "../types/reports.types";
import { REPORT_CARDS } from "../utils/Report config";
import { AutoBadge, PeriodPill } from "./Reportbadges";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Icon component
const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, ReactNode> = {
    calendar: <Calendar className="w-5 h-5" />,
    banknote: <Banknote className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    "message-circle": <MessageCircle className="w-5 h-5" />,
    "user-plus": <UserPlus className="w-5 h-5" />,
    "id-card": <IdCard className="w-5 h-5" />,
  };
  return icons[name] || null;
};

const accentColorMap: Record<string, string> = {
  indigo: "text-indigo-600 bg-indigo-50",
  emerald: "text-emerald-600 bg-emerald-50",
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  violet: "text-violet-600 bg-violet-50",
  amber: "text-amber-600 bg-amber-50",
};

const FormatCheckbox = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <Checkbox
      checked={checked}
      onChange={onChange}
      className="accent-indigo-600"
    />
    <span className="text-[11px] font-semibold text-gray-600">{label}</span>
  </label>
);

interface ReportCardItemProps {
  card: ReportCard;
  onGenerate: (type: ReportType) => void;
}

const ReportCardItem = ({ card, onGenerate }: ReportCardItemProps) => {
  const [activePeriod, setActivePeriod] = useState(card.periods[0]);
  const [formats, setFormats] = useState<Record<string, boolean>>(
    Object.fromEntries(card.formats.map(f => [f, true]))
  );

  const iconCls = accentColorMap[card.accentColor] || "text-gray-600 bg-gray-50";

  const toggleFormat = (f: string) =>
    setFormats(prev => ({ ...prev, [f]: !prev[f] }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls}`}>
          <Icon name={card.icon} />
        </div>
        {card.badge && <AutoBadge label={card.badge.label} color={card.badge.color} />}
      </div>

      {/* Title & description */}
      <div>
        <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{card.description}</p>
      </div>

      {/* Period pills */}
      <div className="flex flex-wrap gap-1.5">
        {card.periods.map(p => (
          <PeriodPill
            key={p}
            period={p}
            active={activePeriod === p}
            onClick={() => setActivePeriod(p)}
          />
        ))}
      </div>

      {/* Format checkboxes */}
      <div className="flex items-center gap-4">
        {card.formats.map(f => (
          <FormatCheckbox
            key={f}
            label={f}
            checked={!!formats[f]}
            onChange={() => toggleFormat(f)}
          />
        ))}
      </div>

      {/* Generate button */}
      <Button
        onClick={() => onGenerate(card.id)}
        className="mt-auto w-full"
      >
        Generate Report
      </Button>
    </div>
  );
};

interface ReportCardGridProps {
  onGenerate: (type: ReportType) => void;
}

const ReportCardGrid = ({ onGenerate }: ReportCardGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {REPORT_CARDS.map(card => (
      <ReportCardItem key={card.id} card={card} onGenerate={onGenerate} />
    ))}
  </div>
);

export default ReportCardGrid;