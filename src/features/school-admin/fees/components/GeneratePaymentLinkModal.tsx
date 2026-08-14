import { useState } from "react";
import { toast } from "sonner";
import { Link2, Copy, Check, X, MessageCircle } from "lucide-react";
import { formatCurrency } from "../utils/Fee.utils";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { feePaymentLinkApi, type CreatePaymentLinkResponse } from "@/services/feePaymentLink.api";
import type { PendingFee } from "../types/fees.types";

interface GeneratePaymentLinkModalProps {
  fee: PendingFee;
  onClose: () => void;
}


export function GeneratePaymentLinkModal({ fee, onClose }: GeneratePaymentLinkModalProps) {
  const [amount, setAmount] = useState<number>(fee.amount);
  const [creating, setCreating] = useState(false);
  const [link, setLink] = useState<CreatePaymentLinkResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setCreating(true);
    try {
      const res = await feePaymentLinkApi.create({
        student_id: fee.studentId,
        feeHeadMappingId: fee.feeType === "feehead" ? fee.feeStructureId : undefined,
        transportfeeId: fee.feeType === "transport" ? fee.transportfeeId : undefined,
        feeConcessionId: fee.feeType === "concession" ? fee.feeConcessionId : undefined,
        amount: amount !== fee.amount ? amount : undefined,
      });
      setLink(res);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create payment link"));
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select and copy the link manually");
    }
  };

  const whatsappHref = link
    ? `https://wa.me/?text=${encodeURIComponent(
        `Fee payment link for ${fee.studentName} (${link.feeName}, ${formatCurrency(link.amount)}): ${link.url}`
      )}`
    : "#";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Link2 className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Send payment link</h2>
              <p className="text-xs text-gray-400">{fee.studentName} — {fee.feeHead}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1.5" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-2 space-y-4">
          {!link ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  Amount
                </label>
                <input
                  type="number"
                  min={1}
                  max={fee.amount}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Remaining balance: {formatCurrency(fee.amount)}. Defaults to the full balance.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                disabled={creating || amount <= 0 || amount > fee.amount}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 transition-colors disabled:opacity-60"
              >
                {creating ? "Generating…" : "Generate link"}
              </button>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs text-emerald-800">
                Link created for {formatCurrency(link.amount)} — valid until{" "}
                {new Date(link.expiresAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}.
                {" "}If the parent has an email on file, it's already been sent to them.
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
                <span className="flex-1 text-xs text-gray-600 truncate">{link.url}</span>
                <button
                  onClick={handleCopy}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 py-2.5 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-600" /> Share via WhatsApp
              </a>
              <button
                onClick={onClose}
                className="w-full rounded-xl text-xs font-semibold text-gray-500 py-2 hover:text-gray-700"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
