import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  schoolRazorpayConfigApi,
  getCurrentSchoolId,
  type RazorpayConfigStatus,
} from "@/services/schoolRazorpayConfig.api";

// Lets a school connect its OWN Razorpay account so parents can pay fees
// online (PAYMENTS_INTEGRATION_GUIDE.md §3.0). Completely separate from the
// platform's Razorpay account used for this school's own subscription
// billing — never conflate the two `keyId`s.
const IntegrationsTab = () => {
  const schoolId = getCurrentSchoolId();

  const [config, setConfig] = useState<RazorpayConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keyId, setKeyId] = useState("");
  const [keySecret, setKeySecret] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      return;
    }
    schoolRazorpayConfigApi
      .getStatus(schoolId)
      .then((res) => {
        setConfig(res);
        if (res.razorpayKeyId) setKeyId(res.razorpayKeyId);
      })
      .catch((err) => toast.error(getErrorMessage(err, "Failed to load payment gateway settings")))
      .finally(() => setLoading(false));
  }, [schoolId]);

  const handleSave = async () => {
    if (!schoolId) return;
    if (!keyId.trim() || !keySecret.trim()) {
      toast.error("Key ID and Key Secret are both required");
      return;
    }
    setSaving(true);
    try {
      const res = await schoolRazorpayConfigApi.save(schoolId, {
        razorpayKeyId: keyId.trim(),
        razorpayKeySecret: keySecret.trim(),
        razorpayWebhookSecret: webhookSecret.trim() || undefined,
      });
      setConfig({
        configured: true,
        webhookConfigured: res.webhookConfigured,
        razorpayKeyId: res.razorpayKeyId,
      });
      // Secrets are write-only — the backend never echoes them back, so
      // clear the fields rather than leaving stale values that look saved.
      setKeySecret("");
      setWebhookSecret("");
      toast.success("Razorpay settings saved");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save Razorpay settings"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">Integrations</h2>
        <p className="text-sm text-gray-500">
          Configure external service integrations for online fee payments, WhatsApp, SMS, and other tools.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Razorpay — Online Fee Payments</h3>
              <p className="text-xs text-gray-400">Lets parents pay fees online, using your school's own Razorpay account</p>
            </div>
          </div>
          {config?.configured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Connected
            </span>
          )}
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !schoolId ? (
          <p className="text-sm text-red-600 mt-4">Couldn't determine this school's account — please log in again.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {!config?.configured && (
              <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                Online fee payments are off until you save your Razorpay keys below. Get them from your Razorpay
                Dashboard → API Keys.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Key ID</label>
                <input
                  type="text"
                  value={keyId}
                  onChange={(e) => setKeyId(e.target.value)}
                  placeholder="rzp_live_xxxxxxxx"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">Key Secret</label>
                <input
                  type="password"
                  value={keySecret}
                  onChange={(e) => setKeySecret(e.target.value)}
                  placeholder={config?.configured ? "•••••••• (leave blank to keep)" : "Enter your key secret"}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5">
                  <span>Webhook Secret (optional, recommended)</span>
                  {config?.webhookConfigured && (
                    <span className="normal-case font-semibold text-emerald-600">Configured</span>
                  )}
                </label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder={config?.webhookConfigured ? "•••••••• (leave blank to keep)" : "Enter your webhook secret"}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                  Without this, a payment is only recorded if the parent's browser stays open until it confirms — a
                  closed tab right after paying can lose the record. In your Razorpay Dashboard → Settings → Webhooks,
                  add a webhook for the <code className="px-1 py-0.5 bg-gray-100 rounded">payment.captured</code> event
                  pointing at <code className="px-1 py-0.5 bg-gray-100 rounded">/public/fee-payment/webhook</code> on
                  this API, then paste the secret it gives you here.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Razorpay settings"}
              </button>
              <a
                href="https://dashboard.razorpay.com/app/keys"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 px-4 py-2.5 hover:bg-gray-50 transition-colors"
              >
                Open Razorpay Dashboard <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationsTab;
