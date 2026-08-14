// src/utils/razorpay.ts
//
// Shared Razorpay Checkout.js mechanics — used by both money relationships
// this backend has (see PAYMENTS_INTEGRATION_GUIDE.md §1): subscription
// billing (school → platform) and parent fee payments (parent → school).
// The two flows hand back different `keyId`s from different Razorpay
// accounts, but the client-side widget mechanics are identical, so this is
// the one place that talks to `window.Razorpay`.

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<void> | null = null;

/** Loads Checkout.js exactly once per page session, regardless of how many callers ask for it concurrently. */
export function loadRazorpayCheckoutScript(): Promise<void> {
  if (typeof window !== "undefined" && window.Razorpay) {
    return Promise.resolve();
  }
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay Checkout")));
      return;
    }
    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
    document.body.appendChild(script);
  }).catch((err) => {
    // Let the next caller retry instead of being stuck with a rejected cache forever.
    loadPromise = null;
    throw err;
  });

  return loadPromise;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id?: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  razorpay_subscription_id?: string;
}

export interface OpenRazorpayCheckoutOptions {
  keyId: string;
  /** One-off payment — mutually exclusive with subscriptionId. */
  orderId?: string;
  /** Recurring mandate — mutually exclusive with orderId; Razorpay reads the amount from the plan. */
  subscriptionId?: string;
  /** In the smallest currency unit (paise for INR). Omit when subscriptionId is set. */
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  onSuccess: (response: RazorpaySuccessResponse) => void;
  /** Called when the user dismisses the modal without paying — not a hard error. */
  onDismiss?: () => void;
}

/** Loads Checkout.js if needed, then opens the widget. Throws only if the script itself fails to load. */
export async function openRazorpayCheckout(options: OpenRazorpayCheckoutOptions): Promise<void> {
  await loadRazorpayCheckoutScript();

  const {
    keyId, orderId, subscriptionId, amount, currency, name, description,
    prefill, theme, onSuccess, onDismiss,
  } = options;

  const rzp = new window.Razorpay({
    key: keyId,
    amount: subscriptionId ? undefined : amount,
    currency,
    name,
    description,
    order_id: orderId,
    subscription_id: subscriptionId,
    prefill,
    theme,
    handler: onSuccess,
    modal: { ondismiss: onDismiss },
  });

  rzp.on?.("payment.failed", () => onDismiss?.());
  rzp.open();
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}
