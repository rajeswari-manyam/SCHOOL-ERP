import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfigCard, FieldLabel, SecretInput, TextInput, ReadOnlyField, ConnectedBadge } from "./ConfigFields";
import { useConfigMutations } from "../hooks/useConfig";
import type { DialogConfig } from "../types/config.types";

const schema = z.object({
  apiKey: z.string().min(1),
  partnerId: z.string().min(1),
  webhookUrl: z.string().url(),
  baseUrl: z.string().url(),
});

type FormValues = z.infer<typeof schema>;

const DialogIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  </div>
);

interface DialogConfigCardProps { config?: Partial<DialogConfig>; }

const DialogConfigCard = ({ config }: DialogConfigCardProps) => {
  const { saveDialog, testDialog } = useConfigMutations();
  const [testMsg, setTestMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { isDirty } } = useForm<FormValues>({
    defaultValues: {
      apiKey: config?.apiKey ?? "",
      partnerId: config?.partnerId ?? "MANYAM-001",
      webhookUrl: config?.webhookUrl ?? "https://erp.manyam.in/webhook/wa",
      baseUrl: config?.baseUrl ?? "https://waba.360dialog.io",
    },
  });

  const onSubmit = (values: FormValues) =>
    saveDialog.mutate({ ...values, connected: true });

  const handleTest = () => {
    testDialog.mutate(undefined, {
      onSuccess: (res) => setTestMsg(res.message ?? "Connection successful"),
      onError: () => setTestMsg("Connection failed"),
    });
  };

  return (
    <ConfigCard>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DialogIcon />
          <div>
            <p className="font-extrabold text-gray-900">360DIALOG CONFIGURATION</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">WhatsApp Gateway</p>
          </div>
        </div>
        {config?.connected && <ConnectedBadge />}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <FieldLabel text="API Key" />
            <SecretInput showCopy {...register("apiKey")} defaultValue="••••••••••••••••••••" />
          </div>
          <div>
            <FieldLabel text="Partner ID" />
            <TextInput {...register("partnerId")} />
          </div>
          <div>
            <FieldLabel text="Webhook URL" />
            <ReadOnlyField value={config?.webhookUrl ?? "https://erp.manyam.in/webhook/wa"} />
          </div>
          <div>
            <FieldLabel text="Base URL" />
            <TextInput {...register("baseUrl")} />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button type="button" onClick={handleTest}
            disabled={testDialog.isPending}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60">
            {testDialog.isPending ? "Testing…" : "Test Connection"}
          </button>
          {testMsg && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              {testMsg}
            </span>
          )}
          {!testMsg && config?.lastTested && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/><circle cx="12" cy="12" r="10"/></svg>
              Tested {config.lastTested}
            </span>
          )}
        </div>
      </form>
    </ConfigCard>
  );
};

export default DialogConfigCard;
