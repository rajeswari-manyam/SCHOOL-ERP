// teacher/attendance/components/WAMethodCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {Wallet, Copy, Check } from "lucide-react";

const WA_NUMBER = "91-80000-12345";
const WA_FORMAT = "ATT 10A 14-04-2025\n1P 2A 3P 4P 5H 6P...";


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
            <Wallet size={18} />
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
          <Wallet size={18} />
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
                <Check size={12} stroke="#16a34a" strokeWidth={2.5} />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={12} />
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
                  <Check size={12} strokeWidth={2.5} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={12} />
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