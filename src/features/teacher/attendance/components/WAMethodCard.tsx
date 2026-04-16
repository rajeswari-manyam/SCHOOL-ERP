// teacher/attendance/components/WAMethodCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

const WA_NUMBER = "91-80000-12345";
const WA_FORMAT = "ATT 10A 14-04-2025\n1P 2A 3P 4P 5H 6P...";

const WAIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface WAMethodCardProps {
  onMarkViaWA: () => void;
  isPending?: boolean;
}

const WAMethodCard = ({ onMarkViaWA, isPending }: WAMethodCardProps) => {
  const [copied, setCopied] = useState<"number" | "format" | null>(null);

  const copy = (text: string, type: "number" | "format") => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const STEPS = [
    { n: "1", label: "Open WhatsApp",      desc: "Open WhatsApp on your phone" },
    { n: "2", label: "Send to ERP number", desc: "Message the school ERP number" },
    { n: "3", label: "Use the format",     desc: "Send in the exact format below" },
  ];

  return (
    <div className="border-2 border-[#25d366] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-[#25d366]/10 px-5 py-4 flex items-center justify-between border-b border-[#25d366]/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center text-white flex-shrink-0">
            <WAIcon />
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900">Mark via WhatsApp</p>
            <p className="text-xs text-gray-500">Fastest method — send a message to mark attendance</p>
          </div>
        </div>
        <Button
          onClick={onMarkViaWA}
          disabled={isPending}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25d366] text-white text-sm font-bold hover:bg-[#1ebe5a] disabled:opacity-60 transition-colors shadow-sm"
        >
          <WAIcon />
          {isPending ? "Sending…" : "Open WhatsApp"}
        </Button>
      </div>

      <div className="px-5 py-5 space-y-5 bg-white">
        {/* 3-step visual */}
        <div className="flex items-start gap-3">
          {STEPS.map((step, i) => (
            <div key={step.n} className="flex items-start gap-2 flex-1">
              {/* Connector line except first */}
              {i > 0 && (
                <div className="w-6 h-0.5 bg-[#25d366]/30 mt-4 flex-shrink-0" />
              )}
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className="w-8 h-8 rounded-full bg-[#25d366] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {step.n}
                </div>
                <p className="text-[11px] font-bold text-gray-700 text-center leading-tight">{step.label}</p>
                <p className="text-[10px] text-gray-400 text-center leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* WA Number row */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between gap-3 border border-gray-200">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">WhatsApp Number</p>
            <p className="text-sm font-bold text-gray-900 font-mono">{WA_NUMBER}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copy(WA_NUMBER, "number")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {copied === "number" ? (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy Number
              </>
            )}
          </Button>
        </div>

        {/* Example message box */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Message Format</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copy(WA_FORMAT, "format")}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#25d366] hover:text-[#16a34a] transition-colors"
            >
              {copied === "format" ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Format
                </>
              )}
            </Button>
          </div>

          {/* WA bubble */}
          <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs shadow-sm">
            <p className="text-[11px] font-mono text-gray-800 leading-relaxed whitespace-pre-line">
              ATT <span className="font-bold">10A</span> <span className="font-bold">14-04-2025</span>{"\n"}
              1P 2A 3P 4P 5H 6P 7A 8P...
            </p>
            <p className="text-[9px] text-gray-400 text-right mt-1.5">→ school ERP</p>
          </div>

          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <p className="text-xs text-amber-700 leading-relaxed">
              <span className="font-bold">Format:</span> ATT [Class] [DD-MM-YYYY] then roll numbers with P/A/H separated by spaces.
              E.g. <span className="font-mono font-semibold">1P 2A 3H</span> = Roll 1 Present, Roll 2 Absent, Roll 3 Half-day.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WAMethodCard;