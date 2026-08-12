// UI-only port of the provided school-admin-subscription.html mockup —
// static/mock data throughout, no billing API wired up yet. Every button
// that would need a real backend call (upgrade, update payment method,
// download invoice, contact support, ...) shows a "coming soon" toast
// instead of doing anything, so the screen reads as finished rather than
// broken while the real subscription/billing API doesn't exist yet.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft, CreditCard, Headset, ArrowUp, Download,
  Calendar, Receipt, Check, X, CircleCheck,
} from "lucide-react";

const notImplemented = (label: string) =>
  toast.info(`${label} — coming soon`, { description: "Billing isn't connected to a live subscription yet." });

// ── Mock current subscription ──────────────────────────────────────────────
const CURRENT_PLAN = {
  name: "Growth plan",
  status: "Active" as const,
  monthlyPrice: "₹12,000",
  billingNote: "/ month, billed annually",
  renewsOn: "14 March 2027",
  paymentMethod: "UPI · autopay enabled",
  lastPayment: "₹1,20,000 on 14 Mar 2026",
};

const USAGE = [
  { label: "Students enrolled", used: 612, limit: 750, note: "82% of plan limit used", warn: false },
  { label: "Staff accounts",    used: 38,  limit: 60,  note: "63% of plan limit used", warn: false },
  { label: "WhatsApp credits",  used: 4120, limit: 5000, note: "Running low — resets on renewal", warn: true },
];

// ── Mock plan comparison — annual price is the discounted (Save 17%) rate ──
interface PlanFeature { label: string; included: boolean; }
interface Plan {
  id: string;
  name: string;
  tagline: string;
  annualPerMonth: number;
  monthlyPerMonth: number;
  limit: string;
  features: PlanFeature[];
  isCurrent?: boolean;
  isPopular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For small schools getting started",
    annualPerMonth: 4500,
    monthlyPerMonth: 5400,
    limit: "Up to 250 students",
    features: [
      { label: "Attendance", included: true },
      { label: "Fee management", included: true },
      { label: "Basic reports", included: true },
      { label: "Broadcast & admissions", included: false },
      { label: "Parent app", included: false },
      { label: "Online payments", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing schools that need more reach",
    annualPerMonth: 12000,
    monthlyPerMonth: 14400,
    limit: "Up to 750 students",
    features: [
      { label: "Attendance", included: true },
      { label: "Fee management", included: true },
      { label: "Reports", included: true },
      { label: "Broadcast & admissions", included: true },
      { label: "Parent app", included: false },
      { label: "Online payments", included: false },
    ],
    isCurrent: true,
    isPopular: true,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "For large institutions with no limits",
    annualPerMonth: 35000,
    monthlyPerMonth: 42000,
    limit: "Unlimited students",
    features: [
      { label: "Attendance", included: true },
      { label: "Fee management", included: true },
      { label: "All reports", included: true },
      { label: "Broadcast & admissions", included: true },
      { label: "Parent app", included: true },
      { label: "Online payments", included: true },
    ],
  },
];

const PAYMENT_HISTORY = [
  { date: "14 Mar 2026", description: "Growth plan — annual renewal",      amount: "₹1,20,000", status: "Paid" as const },
  { date: "14 Mar 2025", description: "Growth plan — annual renewal",      amount: "₹1,20,000", status: "Paid" as const },
  { date: "02 Jan 2025", description: "Starter → Growth upgrade, pro-rated", amount: "₹18,400",   status: "Paid" as const },
];

const PlanBillingPage = () => {
  const navigate = useNavigate();
  const goBackToSettings = () => navigate("/schooladmin/settings");
  const [billingCycle, setBillingCycle] = useState<"annual" | "monthly">("annual");

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
            <p className="text-xs text-gray-400 truncate">View your subscription, track usage, and manage payments</p>
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

      {/* ── Current plan card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-lg font-bold text-gray-900">{CURRENT_PLAN.name}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700">
              {CURRENT_PLAN.status}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-4">Your subscription renews automatically each billing cycle</p>

          <div className="flex items-baseline gap-1.5 mb-4">
            <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{CURRENT_PLAN.monthlyPrice}</span>
            <span className="text-xs text-gray-500 font-medium">{CURRENT_PLAN.billingNote}</span>
          </div>

          <div className="flex flex-col gap-2 mb-5">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Renews on {CURRENT_PLAN.renewsOn}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" /> {CURRENT_PLAN.paymentMethod}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Receipt className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Last payment {CURRENT_PLAN.lastPayment}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => notImplemented("Upgrade plan")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" /> Upgrade plan
            </button>
            <button
              onClick={() => notImplemented("Update payment method")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" /> Update payment method
            </button>
            <button
              onClick={() => notImplemented("Download invoice")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 px-4 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download invoice
            </button>
          </div>
        </div>

        {/* Usage box */}
        <div className="bg-gray-50 rounded-xl p-4 sm:p-5 flex flex-col justify-center gap-4">
          {USAGE.map((u) => {
            const pct = Math.round((u.used / u.limit) * 100);
            return (
              <div key={u.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500 font-semibold">{u.label}</span>
                  <span className="text-gray-900 font-bold tabular-nums">
                    {u.used.toLocaleString("en-IN")} / {u.limit.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${u.warn ? "bg-amber-500" : "bg-indigo-600"}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{u.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Compare plans ── */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Compare plans</h2>
          <div className="inline-flex bg-gray-100 rounded-lg p-1 gap-0.5">
            <button
              onClick={() => setBillingCycle("annual")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-md transition-colors ${
                billingCycle === "annual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Annual <span className="text-emerald-600 font-bold">Save 17%</span>
            </button>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-md transition-colors ${
                billingCycle === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const price = billingCycle === "annual" ? plan.annualPerMonth : plan.monthlyPerMonth;
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-5 sm:p-6 flex flex-col border shadow-sm ${
                  plan.isCurrent || plan.isPopular ? "border-indigo-300 border-[1.5px]" : "border-gray-100"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-2.5 left-5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                    Most popular
                  </span>
                )}
                <h3 className="text-sm font-bold text-gray-900 mt-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.tagline}</p>
                <p className="text-2xl font-extrabold text-gray-900">
                  ₹{price.toLocaleString("en-IN")}<span className="text-xs font-semibold text-gray-500"> /mo</span>
                </p>
                <p className="text-xs text-gray-500 mb-4">{plan.limit}</p>
                <ul className="flex flex-col gap-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.label} className={`flex items-center gap-2 text-xs ${f.included ? "text-gray-700" : "text-gray-400"}`}>
                      {f.included
                        ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        : <X className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                      {f.label}
                    </li>
                  ))}
                </ul>
                {plan.isCurrent ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 py-2">
                    <CircleCheck className="w-4 h-4" /> Your current plan
                  </div>
                ) : (
                  <button
                    onClick={() => notImplemented(plan.id === "pro" ? "Upgrade to Pro" : "Downgrade")}
                    className={`w-full rounded-xl text-xs font-semibold py-2.5 transition-colors ${
                      plan.id === "pro"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {plan.id === "pro" ? "Upgrade to Pro" : "Downgrade"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Payment history ── */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">Payment history</h2>
          <button onClick={() => notImplemented("View all payments")} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            View all
          </button>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {["Date", "Description", "Amount", "Status", "Invoice"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 border-b border-gray-100 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYMENT_HISTORY.map((row, i) => (
                  <tr key={i} className="last:[&>td]:border-b-0">
                    <td className="px-5 py-3.5 border-b border-gray-100 text-gray-700 whitespace-nowrap">{row.date}</td>
                    <td className="px-5 py-3.5 border-b border-gray-100 text-gray-700">{row.description}</td>
                    <td className="px-5 py-3.5 border-b border-gray-100 font-bold text-gray-900 whitespace-nowrap">{row.amount}</td>
                    <td className="px-5 py-3.5 border-b border-gray-100">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 border-b border-gray-100">
                      <button onClick={() => notImplemented("Download invoice")} className="text-xs font-semibold text-indigo-600 hover:underline">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanBillingPage;
