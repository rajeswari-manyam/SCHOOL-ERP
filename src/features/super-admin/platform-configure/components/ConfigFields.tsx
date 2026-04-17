import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export const FieldLabel = ({ text, htmlFor }: { text: string; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5">
    {text}
  </label>
);

const base = "w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 focus:bg-white transition";

// Password / secret field with show/hide toggle
interface SecretInputProps extends InputHTMLAttributes<HTMLInputElement> {
  showCopy?: boolean;
}
export const SecretInput = ({ showCopy, ...props }: SecretInputProps) => {
  const [show, setShow] = useState(false);
  const copyToClipboard = () => navigator.clipboard.writeText(String(props.value ?? ""));
  return (
    <div className="relative">
      <input {...props} type={show ? "text" : "password"} className={cn(base, "pr-20")} />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {showCopy && (
          <button type="button" onClick={copyToClipboard} className="text-gray-400 hover:text-gray-600 p-0.5">
            <Copy size={14} />
          </button>
        )}
        <button type="button" onClick={() => setShow((p) => !p)} className="text-gray-400 hover:text-gray-600 p-0.5">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
};

// Plain text input
export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={cn(base, props.className)} />
);

// Read-only display field
export const ReadOnlyField = ({ value }: { value: string }) => (
  <div className={cn(base, "flex items-center text-gray-500 cursor-default select-all")}>{value}</div>
);

// Section card wrapper
export const ConfigCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">{children}</div>
);

// Connection status badge
export const ConnectedBadge = ({ label = "Connected" }: { label?: string }) => (
  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
    <span className="w-2 h-2 rounded-full bg-emerald-500" />{label}
  </span>
);

export const ActiveBadge = () => (
  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
    <span className="w-2 h-2 rounded-full bg-emerald-500" />Active
  </span>
);

// Mode toggle (Live / Test)
export const ModeToggle = ({ value, onChange }: { value: "LIVE" | "TEST"; onChange: (v: "LIVE" | "TEST") => void }) => (
  <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden">
    {(["LIVE", "TEST"] as const).map((m) => (
      <button key={m} type="button" onClick={() => onChange(m)}
        className={cn("px-5 py-2 text-sm font-semibold transition-colors",
          value === m ? "bg-white text-gray-900 shadow-sm" : "bg-gray-50 text-gray-400 hover:text-gray-600"
        )}>
        {m.charAt(0) + m.slice(1).toLowerCase()}
      </button>
    ))}
  </div>
);
