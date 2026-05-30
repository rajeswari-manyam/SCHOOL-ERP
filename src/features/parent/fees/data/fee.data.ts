import { Zap, CreditCard, Landmark } from "lucide-react";
import type { PaymentMethod } from "../types/fee.types";

// ── Static UI config (not student data) ───────────────────────────────────────

export const helpBarBannerData = {
  title: "Need help with fee payments?",
  description: "Contact the school accounts department for any discrepancies.",
  buttons: {
    call: "Call Office",
    query: "Raise Query",
  },
};

export const helpBarCardsData = {
  needHelp: {
    title: "Need Help?",
    description:
      "Questions regarding fee structure or missed payments? Contact our administrative office.",
    button: "Contact Admin",
  },
  refund: {
    title: "Refund Policy",
    description:
      "Read about our fee refund guidelines and cancellation policies for the academic year.",
    button: "View Policy",
  },
  quickPay: {
    title: "Quick Pay",
    description:
      "You have no upcoming dues for the next 30 days. You're all caught up!",
    status: "Excellent",
  },
};

export const paymentMethods: PaymentMethod[] = [
  { id: "upi", label: "UPI Payment", Icon: Zap },
  { id: "card", label: "Credit / Debit Card", Icon: CreditCard },
  { id: "bank", label: "Net Banking", Icon: Landmark },
];
