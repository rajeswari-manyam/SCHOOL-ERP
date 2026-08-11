import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Camera, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAllSubscriptions } from "@/features/super-admin/billing/hooks/useBilling";
import type { Subscription } from "@/features/super-admin/billing/types/billing.types";
import { useSchoolMutations, useSchoolDetail } from "../hooks/useSchools";
import { mapSchoolDetailToFormValues, buildSchoolUpdatePayload } from "../utils/school.utils";
import type { SchoolFormValues } from "../types/school.types";

// ─── Types ────────────────────────────────────────────────────────────────────
type SchoolInfoData = SchoolFormValues;
interface BillingData {
  billingCycle: "Annual" | "Monthly";
  pilotFeeCollected: boolean;
  razorpayOrderId: string;
}
interface AdminData {
  adminEmail: string;
}
type FormErrors<T> = Partial<Record<keyof T, string>>;

interface ExistingPhotos {
  image?: string | null;
  logo?: string | null;
  principalPhoto?: string | null;
}

const FEATURE_LABELS: Record<string, string> = {
  attendance: "Attendance",
  feeManagement: "Fee Management",
  reports: "Reports",
  broadcast: "Broadcast",
  admission: "Admission",
  parentApp: "Parent App",
  onlinePayment: "Online Payment",
};

// ─── Schemas ──────────────────────────────────────────────────────────────────
const schoolInfoSchema = z.object({
  school_name: z.string().min(1, "School name is required"),
  email: z.string().email("Valid email required").or(z.literal("")),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit phone required"),
  schoolNumber: z.string().regex(/^[0-9]{10,12}$/, "Valid school contact number required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  board: z.string().min(1, "Board is required"),
  pincode: z.string().min(1, "Pincode is required"),
  website: z.string().url("Valid website URL is required").or(z.literal("")),
  address: z.string().min(1, "Address is required"),
  whatsappNumber: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit WhatsApp number required"),
  school_code: z.string().min(1, "School code is required"),
  PrincipalName: z.string().min(1, "Principal name is required"),
  establishedYear: z.union([z.literal(""), z.string().regex(/^(?:18|19|20)\d{2}$/, "Enter valid year")]),
  totalSchoolstrength: z.union([z.literal(""), z.string().regex(/^[0-9]+$/, "Enter a valid number")]),
  subscriptionId: z.string().min(1, "Please select a plan"),
  image: z.custom<File | null>().nullable(),
  logo: z.custom<File | null>().nullable(),
  principalPhoto: z.custom<File | null>().nullable(),
});
const billingSchema = z.object({
  billingCycle: z.enum(["Annual", "Monthly"]),
  pilotFeeCollected: z.boolean(),
  razorpayOrderId: z.string(),
});
const adminSchema = z.object({
  adminEmail: z.string().email("Valid email required"),
});
const pageFormSchema = z.object({
  schoolInfo: schoolInfoSchema,
  billing: billingSchema,
  admin: adminSchema,
});
type PageFormValues = z.infer<typeof pageFormSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { label: "School Info" },
  { label: "Plan & Billing" },
  { label: "Admin Setup" },
] as const;

// Field paths validated before moving past Step 1 — Admin Phone, Principal
// Name/Photo, and the subscription plan are collected on later steps, so
// they're checked there instead.
const STEP1_FIELDS = [
  "schoolInfo.school_name", "schoolInfo.school_code", "schoolInfo.schoolNumber",
  "schoolInfo.email", "schoolInfo.city", "schoolInfo.state", "schoolInfo.board", "schoolInfo.pincode",
  "schoolInfo.website", "schoolInfo.establishedYear", "schoolInfo.totalSchoolstrength",
  "schoolInfo.address", "schoolInfo.whatsappNumber",
] as const;

const STATES = ["Telangana","Andhra Pradesh","Maharashtra","Karnataka","Tamil Nadu","Kerala","Gujarat","Rajasthan","Delhi","Uttar Pradesh","West Bengal"];
const BOARDS = ["CBSE","ICSE","State Board","IB","IGCSE"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center px-0">
      {STEPS.map((step, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all duration-200 relative z-10",
                (done || active) ? "bg-[#5b52f5] border-[#5b52f5] text-white" : "bg-white border-slate-200 text-slate-400"
              )}>
                {done ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : idx}
              </div>
              <span className={cn(
                "text-[10px] sm:text-xs font-medium whitespace-nowrap",
                (done || active) ? "text-[#5b52f5] font-semibold" : "text-slate-400"
              )}>
                <span className="sm:hidden">
                  {idx === 1 ? "Info" : idx === 2 ? "Plan" : "Admin"}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mt-[-18px] sm:mt-[-22px] relative z-0 transition-colors duration-300",
                idx < current ? "bg-[#5b52f5]" : "bg-slate-200"
              )} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function PhoneInput({ id, value, onChange, placeholder, error }: {
  id: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string;
}) {
  return (
    <div>
      <div className="flex">
        <div className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-[10px] text-sm font-medium text-slate-500 whitespace-nowrap">
          +91
        </div>
        <Input
          id={id} type="tel" value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("rounded-r-[10px] rounded-l-none border-l-0", error && "border-red-500 focus:border-red-500 focus:ring-red-200")}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Field({ label, required, children, hint, error }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-500" required={required}>
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-slate-400 leading-relaxed">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function FileUploadField({ label, hint, file, onChange, existingUrl, readOnly }: {
  label: string; hint?: string; file: File | null; onChange: (file: File | null) => void;
  existingUrl?: string | null; readOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const displayUrl = preview ?? existingUrl ?? null;

  if (readOnly) {
    return (
      <div className="flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-500">{label}</Label>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {displayUrl ? <img src={displayUrl} alt={label} className="w-full h-full object-cover" /> : <Camera className="w-4 h-4 text-gray-300" />}
          </div>
          <p className="text-xs text-slate-400">{displayUrl ? "Current photo" : "No photo uploaded"}</p>
        </div>
        {hint && <p className="text-xs text-slate-400 leading-relaxed">{hint}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-500">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {displayUrl ? <img src={displayUrl} alt={label} className="w-full h-full object-cover" /> : <Camera className="w-4 h-4 text-gray-300" />}
        </div>
        <button type="button" onClick={() => inputRef.current?.click()}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-gray-600 hover:bg-gray-50 transition-colors">
          {file ? "Change" : "Upload"}
        </button>
        {file && (
          <button type="button" onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = ""; }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </div>
      {hint && <p className="text-xs text-slate-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function StepSchoolInfo({ data, errors, onChange, mode, existingPhotos }: {
  data: SchoolInfoData; errors: FormErrors<SchoolInfoData>;
  onChange: (k: keyof SchoolInfoData, v: string | File | null) => void;
  mode: "create" | "edit"; existingPhotos?: ExistingPhotos;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
      <Field label="School Name" required error={errors.school_name}>
        <Input value={data.school_name} onChange={(e) => onChange("school_name", e.target.value)}
          placeholder="St. Mary's CBSE School" variant={errors.school_name ? "error" : "default"} />
      </Field>
      <Field label="School Code" required error={errors.school_code}
        hint={mode === "edit" ? "School code cannot be changed" : undefined}>
        <Input value={data.school_code} onChange={(e) => onChange("school_code", e.target.value)}
          placeholder="STMARYS001" variant={errors.school_code ? "error" : "default"}
          disabled={mode === "edit"} />
      </Field>
      <Field label="School Phone Number" required error={errors.schoolNumber} hint="Landline or main contact number for the school">
        <Input value={data.schoolNumber} onChange={(e) => onChange("schoolNumber", e.target.value)}
          placeholder="7998877665" variant={errors.schoolNumber ? "error" : "default"} />
      </Field>
      <Field label="Email" error={errors.email} hint="Optional: school contact email">
        <Input type="email" value={data.email} onChange={(e) => onChange("email", e.target.value)}
          placeholder="principal@school.com" variant={errors.email ? "error" : "default"} />
      </Field>
      <Field label="City" required error={errors.city}>
        <Input value={data.city} onChange={(e) => onChange("city", e.target.value)}
          placeholder="Hanamkonda" variant={errors.city ? "error" : "default"} />
      </Field>
      <Field label="State" required error={errors.state}>
        <Select value={data.state} onChange={(e) => onChange("state", e.target.value)}
          placeholder="Select state" options={STATES.map((s) => ({ value: s, label: s }))}
          className={errors.state ? "border-red-500" : undefined} />
      </Field>
      <Field label="Board" required error={errors.board}>
        <Select value={data.board} onChange={(e) => onChange("board", e.target.value)}
          placeholder="Select board" options={BOARDS.map((b) => ({ value: b, label: b }))}
          className={errors.board ? "border-red-500" : undefined} />
      </Field>
      <Field label="Pincode" required error={errors.pincode}>
        <Input value={data.pincode} maxLength={6} onChange={(e) => onChange("pincode", e.target.value)} placeholder="506001"
          variant={errors.pincode ? "error" : "default"} />
      </Field>
      <Field label="Website" hint="Optional: add the school website">
        <Input type="url" value={data.website} onChange={(e) => onChange("website", e.target.value)}
          placeholder="https://www.stmarys.edu" variant={errors.website ? "error" : "default"} />
      </Field>
      <Field label="Established Year" error={errors.establishedYear}>
        <Input type="number" value={data.establishedYear} min={1800} max={2024}
          onChange={(e) => onChange("establishedYear", e.target.value)} placeholder="2005" />
      </Field>
      <Field label="Total School Strength" error={errors.totalSchoolstrength} hint="Optional: total number of students">
        <Input type="number" value={data.totalSchoolstrength} min={0}
          onChange={(e) => onChange("totalSchoolstrength", e.target.value)} placeholder="500"
          variant={errors.totalSchoolstrength ? "error" : "default"} />
      </Field>
      <FileUploadField label="School Logo" hint={mode === "edit" ? "Managed separately" : "Optional: upload the school logo"}
        file={data.logo} onChange={(file) => onChange("logo", file)}
        existingUrl={existingPhotos?.logo} readOnly={mode === "edit"} />
      <FileUploadField label="School Image" hint={mode === "edit" ? "Managed separately" : "Optional: upload a school photo"}
        file={data.image} onChange={(file) => onChange("image", file)}
        existingUrl={existingPhotos?.image} readOnly={mode === "edit"} />
      <div className="col-span-1 sm:col-span-2">
        <Field label="Address" required error={errors.address}>
          <textarea
            className="w-full rounded-[10px] border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none h-20"
            value={data.address} onChange={(e) => onChange("address", e.target.value)}
            placeholder="Enter full school address..." />
        </Field>
      </div>
      <div className="col-span-1 sm:col-span-2">
        <Field label="WhatsApp Business Number" required error={errors.whatsappNumber}
          hint="This number will send all automated WhatsApp messages to parents">
          <PhoneInput id="whatsappNumber" value={data.whatsappNumber} onChange={(v) => onChange("whatsappNumber", v)}
            placeholder="90000 12345" error={errors.whatsappNumber} />
        </Field>
      </div>
    </div>
  );
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function StepPlanBilling({ data, subscriptionId, subscriptionIdError, subscriptions, loading, onSubscriptionChange, onBillingChange }: {
  data: BillingData;
  subscriptionId: string;
  subscriptionIdError?: string;
  subscriptions: Subscription[];
  loading: boolean;
  onSubscriptionChange: (id: string) => void;
  onBillingChange: (k: keyof BillingData, v: string | boolean) => void;
}) {
  const selected = subscriptions.find((s) => s.id === subscriptionId);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-700">Choose a plan</p>
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5">
          {(["Annual", "Monthly"] as const).map((cycle) => (
            <button key={cycle} type="button" onClick={() => onBillingChange("billingCycle", cycle)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-semibold transition-colors",
                data.billingCycle === cycle ? "bg-[#5b52f5] text-white" : "text-slate-500 hover:text-slate-700"
              )}>
              {cycle}
            </button>
          ))}
        </div>
      </div>
      {data.billingCycle === "Annual" && (
        <p className="text-xs text-emerald-600 font-semibold mb-3">Save with annual billing</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-400 mb-5">Loading plans…</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-sm text-slate-400 mb-5">No subscription plans available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
          {subscriptions.map((sub) => {
            const price = data.billingCycle === "Annual" ? sub.annualPrice : sub.monthlyPrice;
            const activeFeatures = Object.entries(sub.featureFlags ?? {})
              .filter(([, v]) => v)
              .map(([k]) => FEATURE_LABELS[k] ?? k);
            return (
              <div key={sub.id} onClick={() => onSubscriptionChange(sub.id)}
                className={cn(
                  "relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-150",
                  subscriptionId === sub.id ? "border-[#5b52f5] bg-[#f5f4ff]" : "border-slate-200 hover:border-purple-300"
                )}>
                <p className="font-bold text-slate-800 text-sm mb-0.5">{sub.name}</p>
                <p className="text-[#5b52f5] font-extrabold text-base sm:text-lg mb-1">
                  ₹{price.toLocaleString()}
                  <span className="text-xs font-normal text-slate-400">/{data.billingCycle === "Annual" ? "yr" : "mo"}</span>
                </p>
                <p className="text-[11px] text-slate-400 mb-2">Up to {sub.studentLimit.toLocaleString()} students</p>
                <div className="space-y-1">
                  {activeFeatures.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 flex-shrink-0 text-emerald-500" />
                      <span className="text-[11px] text-slate-500">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {subscriptionIdError && <p className="text-xs text-red-500 mb-3">{subscriptionIdError}</p>}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800">30-Day Pilot</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {selected ? `₹${selected.pilotFee.toLocaleString()}` : "A refundable amount"} collected as security deposit for training &amp; setup period.
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 mt-3 cursor-pointer">
          <input type="checkbox" checked={data.pilotFeeCollected}
            onChange={(e) => onBillingChange("pilotFeeCollected", e.target.checked)}
            className="w-4 h-4 rounded border-amber-300 accent-amber-500" />
          <span className="text-xs font-medium text-amber-800">Pilot fee collected via Razorpay</span>
        </label>
        <div className="mt-3">
          <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-amber-700">Razorpay Order ID</Label>
          <Input value={data.razorpayOrderId} onChange={(e) => onBillingChange("razorpayOrderId", e.target.value)}
            placeholder="RZP_ORD_XXXXXX" className="mt-1 bg-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function StepAdminSetup({
  data, errors, principalName, principalNameError, onPrincipalNameChange,
  adminPhone, adminPhoneError, onAdminPhoneChange,
  principalPhoto, onPrincipalPhotoChange, onChange, school, billing, planLabel, mode, existingPhotos,
}: {
  data: AdminData; errors: FormErrors<AdminData>;
  principalName: string; principalNameError?: string;
  onPrincipalNameChange: (v: string) => void;
  adminPhone: string; adminPhoneError?: string;
  onAdminPhoneChange: (v: string) => void;
  principalPhoto: File | null; onPrincipalPhotoChange: (file: File | null) => void;
  onChange: (k: keyof AdminData, v: string) => void;
  school: SchoolInfoData; billing: BillingData; planLabel: string;
  mode: "create" | "edit"; existingPhotos?: ExistingPhotos;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-400 mb-3">Principal / Admin Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <Field label="Principal Name" required error={principalNameError}>
          <Input value={principalName} onChange={(e) => onPrincipalNameChange(e.target.value)}
            placeholder="Mr. Ramesh Kumar" variant={principalNameError ? "error" : "default"} />
        </Field>
        <Field label="Admin Phone Number" required error={adminPhoneError}>
          <PhoneInput id="adminPhone" value={adminPhone} onChange={onAdminPhoneChange}
            placeholder="98765 43210" error={adminPhoneError} />
        </Field>
        <Field label="Admin Email" required error={errors.adminEmail}>
          <Input type="email" value={data.adminEmail} onChange={(e) => onChange("adminEmail", e.target.value)}
            placeholder="admin@school.com" variant={errors.adminEmail ? "error" : "default"} />
        </Field>
        <FileUploadField label="Principal Photo" hint={mode === "edit" ? "Managed separately" : "Optional: upload the principal's photo"}
          file={principalPhoto} onChange={onPrincipalPhotoChange}
          existingUrl={existingPhotos?.principalPhoto} readOnly={mode === "edit"} />
      </div>

      <p className="text-xs font-bold text-slate-600 mb-2 mt-5">Setup Summary</p>
      <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4">
        <div>
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">School</p>
          <p className="text-slate-700 font-medium text-xs mt-0.5">{school.school_name || "—"}</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Plan</p>
          <p className="text-slate-700 font-medium text-xs mt-0.5">{planLabel}</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">City</p>
          <p className="text-slate-700 font-medium text-xs mt-0.5">
            {[school.city, school.state].filter(Boolean).join(", ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Billing</p>
          <p className="text-slate-700 font-medium text-xs mt-0.5">{billing.billingCycle}</p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">WhatsApp</p>
          <p className="text-slate-700 font-medium text-xs mt-0.5">
            {school.whatsappNumber ? `+91 ${school.whatsappNumber}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-slate-400 font-semibold uppercase tracking-wide text-[10px]">Pilot Fee</p>
          <p className={cn("font-medium text-xs mt-0.5", billing.pilotFeeCollected ? "text-emerald-600" : "text-slate-700")}>
            {billing.pilotFeeCollected ? "Collected" : "Pending"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Initial state ────────────────────────────────────────────────────────────
const INITIAL_SCHOOL: SchoolInfoData = {
  school_name: "",
  email: "",
  phone: "",
  schoolNumber: "",
  city: "",
  state: "",
  board: "",
  pincode: "",
  website: "",
  address: "",
  whatsappNumber: "",
  school_code: "",
  PrincipalName: "",
  establishedYear: "",
  totalSchoolstrength: "",
  subscriptionId: "",
  image: null,
  logo: null,
  principalPhoto: null,
};
const INITIAL_BILLING: BillingData = { billingCycle: "Annual", pilotFeeCollected: true, razorpayOrderId: "" };
const INITIAL_ADMIN: AdminData = { adminEmail: "" };

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AddSchoolPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const mode: "create" | "edit" = id ? "edit" : "create";

  const goBack = () => navigate("/superadmin/schools");

  const { data: editDetail, isLoading: editLoading } = useSchoolDetail(mode === "edit" ? id! : "");
  const { createSchool, updateSchool } = useSchoolMutations();
  const { data: subsData, isLoading: subsLoading } = useAllSubscriptions();
  const subscriptions: Subscription[] = Array.isArray(subsData?.data)
    ? subsData.data
    : subsData?.data
    ? [subsData.data]
    : [];

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const { control, setValue, trigger, reset: resetForm, formState: { errors } } = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    mode: "onChange",
    defaultValues: {
      schoolInfo: INITIAL_SCHOOL,
      billing: INITIAL_BILLING,
      admin: INITIAL_ADMIN,
    },
  });

  // Edit mode: hydrate the form once the school's detail record has loaded.
  useEffect(() => {
    if (mode === "edit" && editDetail) {
      resetForm({
        schoolInfo: { ...INITIAL_SCHOOL, ...mapSchoolDetailToFormValues(editDetail) },
        billing: INITIAL_BILLING,
        admin: INITIAL_ADMIN,
      });
    }
  }, [mode, editDetail, resetForm]);

  const existingPhotos: ExistingPhotos | undefined = editDetail
    ? { image: editDetail.image, logo: editDetail.logo, principalPhoto: editDetail.principalphoto }
    : undefined;

  const school = (useWatch({ control, name: "schoolInfo" }) ?? INITIAL_SCHOOL) as SchoolInfoData;
  const billing = (useWatch({ control, name: "billing" }) ?? INITIAL_BILLING) as BillingData;
  const admin = (useWatch({ control, name: "admin" }) ?? INITIAL_ADMIN) as AdminData;

  const planLabel = subscriptions.find((s) => s.id === school.subscriptionId)?.name ?? "—";

  const schoolErrors = (Object.keys(errors.schoolInfo ?? {}) as Array<keyof SchoolInfoData>).reduce(
    (acc, key) => {
      const fe = errors.schoolInfo?.[key];
      if (fe && typeof fe !== "string" && "message" in fe) acc[key] = fe.message ?? "";
      return acc;
    }, {} as FormErrors<SchoolInfoData>
  );
  const adminErrors = (Object.keys(errors.admin ?? {}) as Array<keyof AdminData>).reduce(
    (acc, key) => {
      const fe = errors.admin?.[key];
      if (fe && typeof fe !== "string" && "message" in fe) acc[key] = fe.message ?? "";
      return acc;
    }, {} as FormErrors<AdminData>
  );

  const handleNext = async () => {
    if (step === 1) {
      const ok = await trigger(STEP1_FIELDS as any);
      if (!ok) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      const ok = await trigger(["schoolInfo.subscriptionId", "billing"] as any);
      if (!ok) return;
      setStep(3);
      return;
    }
    if (step === 3) {
      const ok = await trigger(["schoolInfo.PrincipalName", "schoolInfo.phone", "admin"] as any);
      if (!ok) return;
      setSubmitting(true);
      if (mode === "edit" && id) {
        updateSchool.mutate(
          { id, payload: buildSchoolUpdatePayload(school) },
          {
            onSuccess: () => {
              toast.success(`${school.school_name} has been updated`);
              setSubmitting(false);
              goBack();
            },
            onError: (error) => {
              toast.error(error instanceof Error ? error.message : "Failed to update school");
              setSubmitting(false);
            },
          }
        );
      } else {
        createSchool.mutate(school, {
          onSuccess: () => {
            toast.success(`${school.school_name} has been added to the platform`);
            setSubmitting(false);
            goBack();
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Failed to register school");
            setSubmitting(false);
          },
        });
      }
      return;
    }
  };

  if (mode === "edit" && editLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-500">Loading school details…</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <button onClick={goBack} className="hover:text-gray-600 transition-colors">
          Schools
        </button>
        <span>›</span>
        <span className="text-gray-700 font-semibold">
          {mode === "edit" ? "Edit School" : "Add New School"}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
              {mode === "edit" ? "Edit School" : "Add New School"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {mode === "edit" ? "Update this school's details" : "Set up a new school on the platform"}
            </p>
          </div>
          <button
            type="button"
            onClick={goBack}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex-shrink-0 px-5 sm:px-6 pt-5 pb-4">
          <Stepper current={step} />
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 pb-4">
          {step === 1 && (
            <StepSchoolInfo data={school} errors={schoolErrors}
              onChange={(k, v) => setValue(`schoolInfo.${k}` as any, v as any, { shouldValidate: true })}
              mode={mode} existingPhotos={existingPhotos} />
          )}
          {step === 2 && (
            <StepPlanBilling data={billing}
              subscriptionId={school.subscriptionId} subscriptionIdError={schoolErrors.subscriptionId}
              subscriptions={subscriptions} loading={subsLoading}
              onSubscriptionChange={(id) => setValue("schoolInfo.subscriptionId", id, { shouldValidate: true })}
              onBillingChange={(k, v) => setValue(`billing.${k}` as any, v as any, { shouldValidate: true })} />
          )}
          {step === 3 && (
            <StepAdminSetup data={admin} errors={adminErrors}
              principalName={school.PrincipalName} principalNameError={schoolErrors.PrincipalName}
              onPrincipalNameChange={(v) => setValue("schoolInfo.PrincipalName", v, { shouldValidate: true })}
              adminPhone={school.phone} adminPhoneError={schoolErrors.phone}
              onAdminPhoneChange={(v) => setValue("schoolInfo.phone", v, { shouldValidate: true })}
              principalPhoto={school.principalPhoto}
              onPrincipalPhotoChange={(file) => setValue("schoolInfo.principalPhoto", file, { shouldValidate: true })}
              onChange={(k, v) => setValue(`admin.${k}` as any, v as any, { shouldValidate: true })}
              school={school} billing={billing} planLabel={planLabel}
              mode={mode} existingPhotos={existingPhotos} />
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 px-5 sm:px-6 py-4 border-t border-gray-100">
          <Button type="button" variant="ghost" disabled={submitting}
            onClick={() => step === 1 ? goBack() : setStep((s) => s - 1)}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
            {step === 1 ? "Cancel" : "← Back"}
          </Button>
          <Button type="button" variant="default" onClick={handleNext} disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {step === 1 && "Next: Plan & Billing"}
            {step === 2 && "Next: Admin Setup"}
            {step === 3 && (
              submitting
                ? (mode === "edit" ? "Saving…" : "Adding School…")
                : (mode === "edit" ? "Save Changes" : "Add School & Go Live")
            )}
            {!(step === 3 && submitting) && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
