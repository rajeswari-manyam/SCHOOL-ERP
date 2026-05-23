import { useForm } from "react-hook-form";
import { Mail, ChevronDown } from "lucide-react";
import { ConfigCard, FieldLabel, TextInput } from "./ConfigFields";
import { useConfigMutations } from "../hooks/useConfig";
import type { EmailSmsConfig, SmsProvider } from "../types/config.types";

const EmailIcon = () => (
  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
    <Mail size={18} className="text-indigo-500" />
  </div>
);

const SMS_PROVIDERS: SmsProvider[] = ["Twilio", "MSG91", "Kaleyra"];

interface EmailSmsConfigCardProps { config?: Partial<EmailSmsConfig>; }

const EmailSmsConfigCard = ({ config }: EmailSmsConfigCardProps) => {
  const { saveEmailSms } = useConfigMutations();
  const { register, handleSubmit } = useForm<EmailSmsConfig>({
    defaultValues: {
      smtpHost: config?.smtpHost ?? "smtp.gmail.com",
      fromEmail: config?.fromEmail ?? "noreply@manyam.in",
      smsProvider: config?.smsProvider ?? "Twilio",
    },
  });

  const onSubmit = (v: EmailSmsConfig) => saveEmailSms.mutate(v);

  return (
    <ConfigCard>
      <div className="flex items-center gap-3 mb-6">
        <EmailIcon />
        <div>
          <p className="font-extrabold text-gray-900">EMAIL & SMS SETTINGS</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">System Communications</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <FieldLabel text="SMTP Host" />
            <TextInput {...register("smtpHost")} placeholder="smtp.gmail.com" />
          </div>
          <div>
            <FieldLabel text="From Email" />
            <TextInput {...register("fromEmail")} type="email" placeholder="noreply@manyam.in" />
          </div>
          <div className="sm:col-span-2">
            <FieldLabel text="SMS Provider" />
            <div className="relative">
              <select {...register("smsProvider")}
                className="w-full h-11 px-4 pr-10 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 transition cursor-pointer">
                {SMS_PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button type="submit"
            disabled={saveEmailSms.isPending}
            className="px-4 py-2 rounded-xl border border-indigo-200 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors disabled:opacity-60">
            {saveEmailSms.isPending ? "Saving…" : "Save Email Config"}
          </button>
        </div>
      </form>
    </ConfigCard>
  );
};

export default EmailSmsConfigCard;
