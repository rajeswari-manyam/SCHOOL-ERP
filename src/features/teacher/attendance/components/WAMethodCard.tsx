// teacher/attendance/components/WAMethodCard.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Copy, Check, AlertTriangle } from "lucide-react";

const WA_NUMBER = "91-80000-12345";
const WA_FORMAT = "ATT 10A 14-04-2025\n1P 2A 3P 4P 5H 6P...";

interface WAMethodCardProps {
  onMarkViaWA: () => void;
  isPending?: boolean;
}

const STEPS = [
  {
    n: "1",
    label: "Open WhatsApp",
    desc: "Open WhatsApp on your phone",
  },
  {
    n: "2",
    label: "Send to ERP number",
    desc: "Message the school ERP number",
  },
  {
    n: "3",
    label: "Use the format",
    desc: "Send in the exact format below",
  },
] as const;

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({
  text,
  type,
  copied,
  onCopy,
  variant = "outline",
  className = "",
}: {
  text: string;
  type: "number" | "format";
  copied: "number" | "format" | null;
  onCopy: (text: string, type: "number" | "format") => void;
  variant?: "outline" | "ghost";
  className?: string;
}) {
  const isCopied = copied === type;
  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={() => onCopy(text, type)}
      aria-label={isCopied ? "Copied!" : `Copy ${type === "number" ? "WhatsApp number" : "message format"}`}
      className={[
        "flex shrink-0 items-center gap-1.5 text-xs font-semibold transition-colors duration-150",
        "focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-1",
        className,
      ].join(" ")}
    >
      {isCopied ? (
        <>
          <Check size={12} className="text-emerald-600" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <Copy size={12} aria-hidden="true" />
          {type === "number" ? "Copy" : "Copy format"}
        </>
      )}
    </Button>
  );
}

// ─── WAMethodCard ─────────────────────────────────────────────────────────────
const WAMethodCard = ({ onMarkViaWA, isPending }: WAMethodCardProps) => {
  const [copied, setCopied] = useState<"number" | "format" | null>(null);

  const copy = (text: string, type: "number" | "format") => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <article
      aria-label="Mark attendance via WhatsApp"
      className="overflow-hidden rounded-2xl border-2 border-[#25d366] dark:border-[#1ebe5a]"
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-[#25d366]/20 bg-[#25d366]/10 dark:bg-[#25d366]/[0.08] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        {/* Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white shadow-sm"
          >
            <MessageCircle size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-gray-900 dark:text-white leading-tight">
              Mark via WhatsApp
            </p>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400 leading-snug">
              Fastest method — send a message to mark attendance
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button
          type="button"
          onClick={onMarkViaWA}
          disabled={isPending}
          className={[
            "flex w-full items-center justify-center gap-1.5 sm:w-auto",
            "rounded-xl px-5 py-2.5 text-sm font-bold text-white",
            "bg-[#25d366] hover:bg-[#1ebe5a] active:scale-95",
            "disabled:cursor-not-allowed disabled:opacity-60",
            "transition-all duration-150 shadow-sm",
            "focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2",
          ].join(" ")}
        >
          <MessageCircle size={16} aria-hidden="true" />
          {isPending ? "Sending…" : "Open WhatsApp"}
        </Button>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="space-y-4 bg-white dark:bg-slate-900 px-4 py-5 sm:px-5 sm:space-y-5">

        {/* 3-step visual */}
        <ol
          aria-label="Steps to mark attendance via WhatsApp"
          className="flex items-start gap-1 sm:gap-2"
        >
          {STEPS.map((step, i) => (
            <li key={step.n} className="flex flex-1 items-start gap-1 sm:gap-2">
              {/* Connector line — not on first step */}
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="mt-4 h-0.5 w-4 shrink-0 rounded-full bg-[#25d366]/30 sm:w-6"
                />
              )}
              <div className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-xs font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-sm"
                >
                  {step.n}
                </div>
                <p className="text-center text-[10px] font-bold leading-tight text-gray-700 dark:text-slate-200 sm:text-[11px]">
                  {step.label}
                </p>
                <p className="text-center text-[9px] leading-snug text-gray-400 dark:text-slate-500 sm:text-[10px]">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* WA number row */}
        <div className="flex flex-col gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-0.5">
              WhatsApp Number
            </p>
            <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">
              {WA_NUMBER}
            </p>
          </div>
          <CopyButton
            text={WA_NUMBER}
            type="number"
            copied={copied}
            onCopy={copy}
            variant="outline"
            className="w-full justify-center rounded-lg border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-gray-600 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600 sm:w-auto"
          />
        </div>

        {/* Message format */}
        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 sm:text-[11px]">
              Message Format
            </p>
            <CopyButton
              text={WA_FORMAT}
              type="format"
              copied={copied}
              onCopy={copy}
              variant="ghost"
              className="text-[#25d366] hover:text-[#16a34a] dark:text-[#4ade80]"
            />
          </div>

          {/* WA bubble */}
          <div className="max-w-[280px] rounded-2xl rounded-tl-sm bg-[#dcf8c6] dark:bg-[#1a3a28] px-4 py-3 shadow-sm sm:max-w-xs">
            <p className="font-mono text-[11px] leading-relaxed whitespace-pre-line text-gray-800 dark:text-slate-200">
              {"ATT "}
              <strong>10A</strong>
              {" "}
              <strong>14-04-2025</strong>
              {"\n1P 2A 3P 4P 5H 6P 7A 8P..."}
            </p>
            <p className="mt-1.5 text-right text-[9px] text-gray-400 dark:text-slate-500">
              → school ERP
            </p>
          </div>

          {/* Tip box */}
          <div className="mt-3 flex gap-2.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 px-3 py-2.5">
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-amber-500"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300">
              <span className="font-bold">Format:</span> ATT [Class] [DD-MM-YYYY] then roll
              numbers with P/A/H separated by spaces. E.g.{" "}
              <span className="font-mono font-semibold">1P 2A 3H</span> = Roll 1 Present, Roll 2
              Absent, Roll 3 Half-day.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default WAMethodCard;