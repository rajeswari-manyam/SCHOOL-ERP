// Real subscription-billing screen — wired to /organization/billing/* (see
// PAYMENTS_INTEGRATION_GUIDE.md §2). The school admin pays the PLATFORM
// here via Razorpay Checkout; this is a completely separate money
// relationship (and Razorpay account) from parent fee payments.
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, CreditCard, Headset, ArrowUp, Calendar, Receipt,
  RefreshCw, Tag, ShieldAlert,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { openRazorpayCheckout } from "@/utils/razorpay";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  schoolBillingApi,
  type BillingStatus,
  type PricingTier,
} from "@/services/schoolBilling.api";

const notImplemented = (label: string) =>
  toast.info(`${label} — coming soon`);

const money = (v: number) => `₹${Math.round(v).toLocaleString("en-IN")}`;

const STATUS_STYLES: Record<string, string> = {
  TRIAL:   "bg-blue-50 text-blue-700",
  ACTIVE:  "bg-emerald-50 text-emerald-700",
  PAID:    "bg-emerald-50 text-emerald-700",
  EXPIRED: "bg-red-50 text-red-700",
  GRACE:   "bg-amber-50 text-amber-700",
};

// Retries a couple of times on transient network failure — the Razorpay
// charge has already gone through by this point, so giving up on the first
// blip would strand a paying school in limbo. A real rejection (bad
// signature, etc.) still throws immediately since retrying that can't help.
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

// Blocks accidental tab-close/navigation while a just-collected payment is
// still being confirmed server-side — Razorpay already has the money, and
// `verify` is what turns that into a recorded payment on our side.
function useNavigationGuard(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
}

const PlanBillingPage = () => {
  const navigate = useNavigate();
  const goBackToSettings = () => navigate("/schooladmin/settings");
  const user = useAuthStore((s) => s.user);

  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [cancellingAutopay, setCancellingAutopay] = useState(false);
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
  const [autopayPlanId, setAutopayPlanId] = useState<string | null>(null);
  const [promoInputs, setPromoInputs] = useState<Record<string, string>>({});
  const [promoPreview, setPromoPreview] = useState<Record<string, { discountApplied: number; amount: number } | null>>({});
  const [validatingPromo, setValidatingPromo] = useState<string | null>(null);

  useNavigationGuard(confirming);

  const loadStatus = useCallback(async () => {
    try {
      const data = await schoolBillingApi.getStatus();
      setStatus(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load billing status"));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadStatus().finally(() => setLoading(false));
  }, [loadStatus]);

  const handleValidatePromo = async (planId: string) => {
    const code = (promoInputs[planId] ?? "").trim();
    if (!code) return;
    setValidatingPromo(planId);
    try {
      const res = await schoolBillingApi.validatePromo(code, planId);
      setPromoPreview((p) => ({ ...p, [planId]: { discountApplied: res.discountApplied, amount: res.amount } }));
      toast.success(`Code applied — ${money(res.discountApplied)} off`);
    } catch (err) {
      setPromoPreview((p) => ({ ...p, [planId]: null }));
      toast.error(getErrorMessage(err, "That promo code isn't valid"));
    } finally {
      setValidatingPromo(null);
    }
  };

  const handlePayNow = async (plan: PricingTier) => {
    const promoCode = (promoInputs[plan.id] ?? "").trim() || undefined;
    setPayingPlanId(plan.id);
    try {
      const order = await schoolBillingApi.createOrder(plan.id, promoCode);
      await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: "Subscription payment",
        description: `${order.pricingPlan.name} plan`,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        onSuccess: async (resp) => {
          setConfirming(true);
          try {
            await withRetry(() =>
              schoolBillingApi.verifyPayment({
                razorpay_order_id: resp.razorpay_order_id!,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                pricingPlanId: plan.id,
                promoCode,
              })
            );
            toast.success("Payment successful — your subscription is up to date");
            await loadStatus();
          } catch (err) {
            toast.error(getErrorMessage(err, "We collected your payment but couldn't confirm it automatically — contact support with your payment ID: " + resp.razorpay_payment_id));
          } finally {
            setConfirming(false);
          }
        },
        onDismiss: () => setPayingPlanId(null),
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to start checkout"));
    } finally {
      setPayingPlanId(null);
    }
  };

  const handleEnableAutopay = async (plan: PricingTier) => {
    setAutopayPlanId(plan.id);
    try {
      const sub = await schoolBillingApi.createAutopay(plan.id);
      await openRazorpayCheckout({
        keyId: sub.keyId,
        subscriptionId: sub.razorpaySubscriptionId,
        name: "Subscription autopay",
        description: `${plan.name} plan — recurring`,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        onSuccess: async (resp) => {
          setConfirming(true);
          try {
            await withRetry(() =>
              schoolBillingApi.verifyAutopay({
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_subscription_id: resp.razorpay_subscription_id ?? sub.razorpaySubscriptionId,
                razorpay_signature: resp.razorpay_signature,
              })
            );
            toast.success("Autopay enabled");
            await loadStatus();
          } catch (err) {
            toast.error(getErrorMessage(err, "We collected your first payment but couldn't confirm autopay automatically — contact support with your payment ID: " + resp.razorpay_payment_id));
          } finally {
            setConfirming(false);
          }
        },
        onDismiss: () => setAutopayPlanId(null),
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to set up autopay"));
    } finally {
      setAutopayPlanId(null);
    }
  };

  const handleCancelAutopay = async () => {
    if (!window.confirm("Cancel autopay? Your access continues until the current paid period ends, then it won't renew automatically.")) return;
    setCancellingAutopay(true);
    try {
      await schoolBillingApi.cancelAutopay();
      toast.success("Autopay cancelled");
      await loadStatus();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to cancel autopay"));
    } finally {
      setCancellingAutopay(false);
    }
  };

  if (loading || !status) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  const badgeClass = STATUS_STYLES[status.status] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBackToSettings} className="hover:text-gray-600 transition-colors">
          Settings
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">Plan &amp; Billing</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-100 text-indigo-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">Plan &amp; billing</h1>
            <p className="text-xs text-gray-400 truncate">View your subscription and pay online via Razorpay</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => notImplemented("Contact support")}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Headset className="w-3.5 h-3.5" /> Contact support
          </button>
          <button
            type="button"
            onClick={goBackToSettings}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {confirming && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs font-semibold text-amber-800">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          Confirming your payment — please don't close or refresh this page.
        </div>
      )}

      {/* ── Current status card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 space-y-4">
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}>
            {status.isTrial ? "Trial" : status.status}
          </span>
          {!status.isActive && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-700">
              Access suspended
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {status.nextDueDate && (
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {status.isTrial ? "Trial ends" : "Renews / due"} on{" "}
              {new Date(status.nextDueDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              {status.daysRemaining != null && (
                <span className={status.daysRemaining <= 5 ? "text-amber-600 font-semibold" : ""}>
                  {" "}({status.daysRemaining >= 0 ? `${status.daysRemaining} days left` : `${-status.daysRemaining} days overdue`})
                </span>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {status.autopay ? (
              <>
                Autopay enabled — {status.autopay.pricingPlanName ?? "current plan"} ({status.autopay.status})
              </>
            ) : (
              "Autopay not enabled — pick a plan below to set it up"
            )}
          </div>
        </div>

        {status.autopay && (
          <div>
            <button
              onClick={handleCancelAutopay}
              disabled={cancellingAutopay}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 px-4 py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {cancellingAutopay ? "Cancelling…" : "Cancel autopay"}
            </button>
          </div>
        )}
      </div>

      {/* ── Compare plans ── */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3">Plans</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {status.pricingTiers.map((plan) => {
            const preview = promoPreview[plan.id];
            const displayPrice = preview ? preview.amount : plan.price;
            const isPaying = payingPlanId === plan.id;
            const isSettingUpAutopay = autopayPlanId === plan.id;
            const anyBusy = payingPlanId != null || autopayPlanId != null || confirming;

            return (
              <div
                key={plan.id}
                className="relative bg-white rounded-2xl p-5 sm:p-6 flex flex-col border border-gray-100 shadow-sm"
              >
                <h3 className="text-sm font-bold text-gray-900 mt-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.durationMonths}-month plan</p>

                <div className="mb-1">
                  {plan.discountPercent > 0 && !preview && (
                    <span className="text-xs text-gray-400 line-through mr-1.5">{money(plan.basePrice)}</span>
                  )}
                  <span className="text-2xl font-extrabold text-gray-900">{money(displayPrice)}</span>
                </div>
                {plan.discountPercent > 0 && !preview && (
                  <p className="text-xs text-emerald-600 font-semibold mb-4">{plan.discountPercent}% off</p>
                )}
                {preview && (
                  <p className="text-xs text-emerald-600 font-semibold mb-4">
                    Promo applied — {money(preview.discountApplied)} off
                  </p>
                )}
                {!plan.discountPercent && !preview && <div className="mb-4" />}

                {/* Promo code */}
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-gray-300 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={promoInputs[plan.id] ?? ""}
                      onChange={(e) => setPromoInputs((p) => ({ ...p, [plan.id]: e.target.value.toUpperCase() }))}
                      disabled={anyBusy}
                      className="w-full pl-7 pr-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleValidatePromo(plan.id)}
                    disabled={anyBusy || validatingPromo === plan.id || !(promoInputs[plan.id] ?? "").trim()}
                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 shrink-0"
                  >
                    {validatingPromo === plan.id ? "…" : "Apply"}
                  </button>
                </div>

                <div className="mt-auto flex flex-col gap-2">
                  <button
                    onClick={() => handlePayNow(plan)}
                    disabled={anyBusy}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 transition-colors disabled:opacity-60"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    {isPaying ? "Opening checkout…" : "Pay now"}
                  </button>
                  <button
                    onClick={() => handleEnableAutopay(plan)}
                    disabled={anyBusy}
                    className="w-full rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 py-2.5 hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    {isSettingUpAutopay ? "Setting up…" : "Set up autopay"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {status.pricingTiers.length === 0 && (
          <p className="text-xs text-gray-400">No pricing plans are configured yet — contact the platform team.</p>
        )}
      </div>

      {/* ── Legend / notes ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex items-start gap-3">
        <Receipt className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-xs text-gray-500 leading-relaxed">
          Payments are processed securely by Razorpay. A promo code replaces the plan's own discount rather than
          stacking with it. Paying before your due date extends your access from your current due date, not from today.
        </p>
      </div>
    </div>
  );
};

export default PlanBillingPage;
