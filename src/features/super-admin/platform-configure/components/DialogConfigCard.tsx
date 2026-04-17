import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageSquare, Check, CheckCircle } from "lucide-react";
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
    <MessageSquare size={18} className="text-indigo-500" />
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
              <Check size={14} />
              {testMsg}
            </span>
          )}
          {!testMsg && config?.lastTested && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
              <CheckCircle size={14} />
              Tested {config.lastTested}
            </span>
          )}
        </div>
      </form>
    </ConfigCard>
  );
};

export default DialogConfigCard;
