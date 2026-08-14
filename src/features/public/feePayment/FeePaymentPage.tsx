
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, ShieldAlert, CheckCircle2, Clock, Ban, School } from "lucide-react";
import { openRazorpayCheckout } from "@/utils/razorpay";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  publicFeePaymentApi,
  type PublicFeePaymentLink,
} from "@/services/publicFeePayment.api";

const money = (v: number, currency = "INR") =>
  currency === "INR" ? `₹${v.toLocaleString("en-IN")}` : `${currency} ${v.toLocaleString("en-IN")}`;

async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 1500));
    }
  }
  throw lastErr;
}

// Keeps search engines out of a page whose URL is itself a bearer credential.
function useNoIndex() {
  useEffect(() => {
    const tag = document.createElement("meta");
    tag.name = "robots";
    tag.content = "noindex, nofollow";
    document.head.appendChild(tag);
    return () => { document.head.removeChild(tag); };
  }, []);
}

function useNavigationGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
}

const Shell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {children}
    </div>
  </div>
);

const FeePaymentPage = () => {
  const { token } = useParams<{ token: string }>();
  useNoIndex();

  const [link, setLink] = useState<PublicFeePaymentLink | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<{ receiptNo?: string; amount?: number } | null>(null);

  useNavigationGuard(confirming);

  useEffect(() => {
    if (!token) return;
    publicFeePaymentApi
      .getLink(token)
      .then(setLink)
      .catch((err) => setLoadError(getErrorMessage(err, "Couldn't load this payment link")))
      .finally(() => setLoading(false));
  }, [token]);

  const handlePay = async () => {
    if (!token || !link) return;
    setPaying(true);
    try {
      const order = await publicFeePaymentApi.createOrder(token);
      await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: link.schoolName,
        description: `${link.feeName} — ${link.studentName}`,
        onSuccess: async (resp) => {
          setConfirming(true);
          try {
            const verified = await withRetry(() =>
              publicFeePaymentApi.verify(token, {
                razorpay_order_id: resp.razorpay_order_id!,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
              })
            );
            setResult(verified.alreadyProcessed ? {} : verified);
            setLink((prev) => (prev ? { ...prev, status: "PAID" } : prev));
          } catch (err) {
            setLoadError(
              getErrorMessage(
                err,
                `We collected your payment but couldn't confirm it automatically. Please keep your payment ID (${resp.razorpay_payment_id}) and contact the school.`
              )
            );
          } finally {
            setConfirming(false);
          }
        },
        onDismiss: () => setPaying(false),
      });
    } catch (err) {
      setLoadError(getErrorMessage(err, "Couldn't start the payment"));
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading payment details…</p>
        </div>
      </Shell>
    );
  }

  if (!link) {
    return (
      <Shell>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <ShieldAlert className="w-10 h-10 text-red-400" />
          <p className="text-sm font-semibold text-gray-700">{loadError ?? "Payment link not found"}</p>
        </div>
      </Shell>
    );
  }

  const paidJustNow = link.status === "PAID" && (result !== null);

  return (
    <Shell>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
          <School className="w-4.5 h-4.5 text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{link.schoolName}</p>
          <p className="text-xs text-gray-400 truncate">Fee payment</p>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 px-4 py-3.5 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Student</span>
          <span className="font-semibold text-gray-900">{link.studentName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Fee</span>
          <span className="font-semibold text-gray-900">{link.feeName}</span>
        </div>
        <div className="flex justify-between text-sm pt-1 border-t border-gray-200 mt-1.5">
          <span className="text-gray-600 font-medium">Amount</span>
          <span className="font-extrabold text-gray-900">{money(link.amount, link.currency)}</span>
        </div>
      </div>

      {link.status === "PENDING" && !paidJustNow && (
        <>
          {confirming && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs font-semibold text-amber-800">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              Confirming your payment — please don't close this page.
            </div>
          )}
          {loadError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-xs text-red-700">
              {loadError}
            </div>
          )}
          <button
            onClick={handlePay}
            disabled={paying || confirming}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 transition-colors disabled:opacity-60"
          >
            {paying || confirming ? "Processing…" : `Pay ${money(link.amount, link.currency)}`}
          </button>
          <p className="text-[11px] text-gray-400 text-center">
            Link expires {new Date(link.expiresAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5" /> Secure payment powered by Razorpay
          </div>
        </>
      )}

      {(link.status === "PAID" || paidJustNow) && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          <p className="text-sm font-bold text-gray-900">Payment received</p>
          {result?.receiptNo && (
            <p className="text-xs text-gray-500">Receipt No: {result.receiptNo}</p>
          )}
          <p className="text-xs text-gray-400">This fee has already been paid for {link.studentName}.</p>
        </div>
      )}

      {link.status === "EXPIRED" && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <Clock className="w-10 h-10 text-amber-500" />
          <p className="text-sm font-bold text-gray-900">This link has expired</p>
          <p className="text-xs text-gray-400">Please ask the school for a new payment link.</p>
        </div>
      )}

      {link.status === "CANCELLED" && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <Ban className="w-10 h-10 text-gray-400" />
          <p className="text-sm font-bold text-gray-900">This link was cancelled</p>
          <p className="text-xs text-gray-400">Please ask the school for a new payment link.</p>
        </div>
      )}
    </Shell>
  );
};

export default FeePaymentPage;
