import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CreditCard } from "lucide-react";
import { ConfigCard, FieldLabel, SecretInput, ActiveBadge, ModeToggle } from "./ConfigFields";
import { useConfigMutations } from "../hooks/useConfig";
import type { RazorpayConfig } from "../types/config.types";

const RazorpayIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
    <CreditCard className="w-5 h-5 text-blue-600" />
  </div>
);

interface RazorpayConfigCardProps { config?: Partial<RazorpayConfig>; }

const RazorpayConfigCard = ({ config }: RazorpayConfigCardProps) => {
  const { saveRazorpay, testRazorpay } = useConfigMutations();
  const [testOk, setTestOk] = useState<boolean | null>(null);

  const { register, handleSubmit, control } = useForm<RazorpayConfig>({
    defaultValues: {
      keyId: config?.keyId ?? "",
      keySecret: config?.keySecret ?? "",
      webhookSecret: config?.webhookSecret ?? "",
      mode: config?.mode ?? "LIVE",
      active: config?.active ?? true,
    },
  });

  const onSubmit = (v: RazorpayConfig) => saveRazorpay.mutate(v);

  const handleTest = () =>
    testRazorpay.mutate(undefined, {
      onSuccess: (res) => setTestOk(res.success),
      onError: () => setTestOk(false),
    });

  return (
    <ConfigCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <RazorpayIcon />
          <div>
            <p className="font-extrabold text-gray-900">RAZORPAY CONFIGURATION</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Payment Gateway</p>
          </div>
        </div>
        {config?.active && <ActiveBadge />}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <FieldLabel text="Key ID" />
            <SecretInput {...register("keyId")} />
          </div>
          <div>
            <FieldLabel text="Key Secret" />
            <SecretInput {...register("keySecret")} />
          </div>
          <div>
            <FieldLabel text="Webhook Secret" />
            <SecretInput {...register("webhookSecret")} />
          </div>
          <div>
            <FieldLabel text="Mode" />
            <Controller
              name="mode"
              control={control}
              render={({ field }) => <ModeToggle value={field.value} onChange={field.onChange} />}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button type="button" onClick={handleTest}
            disabled={testRazorpay.isPending}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
            {testRazorpay.isPending ? "Testing…" : "Test Connection"}
          </button>
          {testOk === true && <span className="text-sm text-emerald-600 font-medium">✅ Connected</span>}
          {testOk === false && <span className="text-sm text-red-500 font-medium">❌ Failed</span>}
        </div>
      </form>
    </ConfigCard>
  );
};

export default RazorpayConfigCard;
