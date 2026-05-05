

import { useState, useEffect, useCallback, Fragment } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ArrowRight, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";


// ─── Types ────────────────────────────────────────────────────────────────────
interface SchoolInfoData {
  schoolName: string;
  phone: string;
  city: string;
  email: string;
  state: string;
  board: string;
  pincode: string;
  estYear: string;
  address: string;
  waNumber: string;
}

interface BillingData {
  plan: "basic" | "pro" | "enterprise";
  billingCycle: string;
  paymentMethod: string;
  gst: string;
}

interface AdminData {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  designation: string;
  tempPass: string;
  confirmPass: string;
}

type FormErrors<T> = Partial<Record<keyof T, string>>;

interface AddNewSchoolModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: { school: SchoolInfoData; billing: BillingData; admin: AdminData }) => void;
}

const schoolInfoSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  phone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit phone required"),
  city: z.string().min(1, "City is required"),
  email: z.union([z.literal(""), z.string().email("Valid email required")]),
  state: z.string().min(1, "State is required"),
  board: z.string().min(1, "Board is required"),
  pincode: z.string(),
  estYear: z.union([z.literal(""), z.string().regex(/^(?:18|19|20)\d{2}$/, "Enter valid year")]),
  address: z.string(),
  waNumber: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit WhatsApp number required"),
});

const billingSchema = z.object({
  plan: z.enum(["basic", "pro", "enterprise"]),
  billingCycle: z.string().min(1, "Billing cycle is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  gst: z.string(),
});

const adminSchema = z.object({
  adminName: z.string().min(1, "Admin name is required"),
  adminEmail: z.string().email("Valid email required"),
  adminPhone: z.string().regex(/^[0-9]{10}$/, "Valid 10-digit phone required"),
  designation: z.string().min(1, "Designation is required"),
  tempPass: z.string().min(8, "Password must be at least 8 characters"),
  confirmPass: z.string().min(8, "Confirm password is required"),
}).superRefine((data, ctx) => {
  if (data.confirmPass !== data.tempPass) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["confirmPass"], message: "Passwords do not match" });
  }
});

const schoolModalSchema = z.object({
  schoolInfo: schoolInfoSchema,
  billing: billingSchema,
  admin: adminSchema,
});

type SchoolModalFormValues = z.infer<typeof schoolModalSchema>;

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { label: "School Info" },
  { label: "Plan & Billing" },
  { label: "Admin Setup" },
] as const;

const STATES = ["Telangana","Andhra Pradesh","Maharashtra","Karnataka","Tamil Nadu","Kerala","Gujarat","Rajasthan","Delhi","Uttar Pradesh","West Bengal"];
const BOARDS = ["CBSE","ICSE","State Board","IB","IGCSE"];
const PLANS = [
  { id: "basic" as const, name: "Basic", price: "₹4,999", features: ["Up to 500 students","Core modules","Email support"] },
  { id: "pro" as const, name: "Pro", price: "₹9,999", badge: "Most Popular", features: ["Up to 2000 students","All modules","WhatsApp support"] },
  { id: "enterprise" as const, name: "Enterprise", price: "₹19,999", features: ["Unlimited students","Custom modules","Dedicated manager"] },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

// Stepper
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center px-7 pb-6">
      {STEPS.map((step, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200 relative z-10",
                done  && "bg-[#5b52f5] border-[#5b52f5] text-white",
                active && "bg-[#5b52f5] border-[#5b52f5] text-white",
                !done && !active && "bg-white border-slate-200 text-slate-400"
              )}>
                {done ? (
                  <Check className="w-4 h-4" />
                ) : idx}
              </div>
              <span className={cn(
                "text-xs font-medium whitespace-nowrap",
                (done || active) ? "text-[#5b52f5] font-semibold" : "text-slate-400"
              )}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mt-[-22px] relative z-0 transition-colors duration-300",
                idx < current ? "bg-[#5b52f5]" : "bg-slate-200"
              )} />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

// Phone input with +91 prefix
function PhoneInput({
  id, value, onChange, placeholder, error,
}: { id: string; value: string; onChange: (v: string) => void; placeholder?: string; error?: string }) {
  return (
    <div>
      <div className="flex">
        <div className="flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-[10px] text-sm font-medium text-slate-500 whitespace-nowrap">
          +91
        </div>
        <Input
          id={id}
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "rounded-r-[10px] rounded-l-none border-l-0",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200"
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// Form field wrapper
function Field({ label, required, children, hint, error }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string; error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-500" required={required}>
        {label}
      </Label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Step 1: School Info ──────────────────────────────────────────────────────
function StepSchoolInfo({ data, errors, onChange }: {
  data: SchoolInfoData;
  errors: FormErrors<SchoolInfoData>;
  onChange: (k: keyof SchoolInfoData, v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
      <Field label="School Name" required error={errors.schoolName}>
        <Input
          value={data.schoolName}
          onChange={(e) => onChange("schoolName", e.target.value)}
          placeholder="St. Mary's CBSE School"
          variant={errors.schoolName ? "error" : "default"}
        />
      </Field>
      <Field label="Phone Number" required error={errors.phone}>
        <PhoneInput id="phone" value={data.phone} onChange={(v) => onChange("phone", v)} placeholder="98765 43210" error={errors.phone} />
      </Field>
      <Field label="City" required error={errors.city}>
        <Input
          value={data.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="Hanamkonda"
          variant={errors.city ? "error" : "default"}
        />
      </Field>
      <Field label="Email" error={errors.email}>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="principal@school.com"
          variant={errors.email ? "error" : "default"}
        />
      </Field>
      <Field label="State" required error={errors.state}>
        <Select
          value={data.state}
          onChange={(e) => onChange("state", e.target.value)}
          placeholder="Select state"
          options={STATES.map((s) => ({ value: s, label: s }))}
          className={errors.state ? "border-red-500" : undefined}
        />
      </Field>
      <Field label="Board" required error={errors.board}>
        <Select
          value={data.board}
          onChange={(e) => onChange("board", e.target.value)}
          placeholder="Select board"
          options={BOARDS.map((b) => ({ value: b, label: b }))}
          className={errors.board ? "border-red-500" : undefined}
        />
      </Field>
      <Field label="Pincode">
        <Input
          value={data.pincode}
          maxLength={6}
          onChange={(e) => onChange("pincode", e.target.value)}
          placeholder="506001"
        />
      </Field>
      <Field label="Established Year">
        <Input
          type="number"
          value={data.estYear}
          min={1800}
          max={2024}
          onChange={(e) => onChange("estYear", e.target.value)}
          placeholder="2005"
        />
      </Field>
      <div className="col-span-2">
        <Field label="Address">
          <textarea
            className="w-full rounded-[10px] border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none h-20"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Enter full school address..."
          />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="WhatsApp Business Number" required error={errors.waNumber}
          hint="This number will send all automated WhatsApp messages to parents">
          <PhoneInput
            id="waNumber"
            value={data.waNumber}
            onChange={(v) => onChange("waNumber", v)}
            placeholder="90000 12345"
            error={errors.waNumber}
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Step 2: Plan & Billing ───────────────────────────────────────────────────
function StepPlanBilling({ data, onChange }: {
  data: BillingData;
  onChange: (k: keyof BillingData, v: string) => void;
}) {
  return (
    <div>
      {/* Plan cards */}
      <p className="text-sm font-semibold text-slate-700 mb-3">Choose a plan</p>
      <div className="grid grid-cols-3 gap-3 mb-5">
        {PLANS.map((plan) => (
          <div key={plan.id} onClick={() => onChange("plan", plan.id)}
            className={cn(
              "relative border-2 rounded-2xl p-4 cursor-pointer transition-all duration-150",
              data.plan === plan.id
                ? "border-[#5b52f5] bg-[#f5f4ff]"
                : "border-slate-200 hover:border-purple-300"
            )}>
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5b52f5] text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                {plan.badge}
              </span>
            )}
            <p className="font-bold text-slate-800 text-sm mb-1">{plan.name}</p>
            <p className="text-[#5b52f5] font-extrabold text-lg mb-2">
              {plan.price}<span className="text-xs font-normal text-slate-400">/mo</span>
            </p>
            {plan.features.map((f) => (
              <p key={f} className="text-[11px] text-slate-500 leading-relaxed">{f}</p>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-5">
        <Field label="Billing Cycle" required>
          <Select
            value={data.billingCycle}
            onChange={(e) => onChange("billingCycle", e.target.value)}
            options={[
              { value: "Monthly", label: "Monthly" },
              { value: "Quarterly", label: "Quarterly" },
              { value: "Annually (save 20%)", label: "Annually (save 20%)" },
            ]}
          />
        </Field>
        <Field label="Payment Method" required>
          <Select
            value={data.paymentMethod}
            onChange={(e) => onChange("paymentMethod", e.target.value)}
            options={[
              { value: "UPI", label: "UPI" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Credit Card", label: "Credit Card" },
            ]}
          />
        </Field>
        <div className="col-span-2">
          <Field label="GST Number" hint="Optional — enter to receive GST invoices">
            <Input
              value={data.gst}
              onChange={(e) => onChange("gst", e.target.value)}
              placeholder="22AAAAA0000A1Z5"
            />
          </Field>
        </div>
      </div>

      {/* Included modules */}
      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-700 mb-3">Included modules</p>
        {["Student & Teacher Management","Attendance & Timetable","Fee Management & Receipts","WhatsApp Parent Notifications"].map((m) => (
          <div key={m} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-none">
            <div className="w-5 h-5 rounded-[5px] bg-[#5b52f5] flex items-center justify-center flex-shrink-0">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs text-slate-500">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Admin Setup ──────────────────────────────────────────────────────
function StepAdminSetup({ data, errors, onChange }: {
  data: AdminData;
  errors: FormErrors<AdminData>;
  onChange: (k: keyof AdminData, v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
      <Field label="Admin Name" required error={errors.adminName}>
        <Input
          value={data.adminName}
          onChange={(e) => onChange("adminName", e.target.value)}
          placeholder="Ramesh Kumar"
          variant={errors.adminName ? "error" : "default"}
        />
      </Field>
      <Field label="Admin Email" required error={errors.adminEmail}>
        <Input
          type="email"
          value={data.adminEmail}
          onChange={(e) => onChange("adminEmail", e.target.value)}
          placeholder="admin@school.com"
          variant={errors.adminEmail ? "error" : "default"}
        />
      </Field>
      <Field label="Admin Phone" required error={errors.adminPhone}>
        <PhoneInput
          id="adminPhone"
          value={data.adminPhone}
          onChange={(v) => onChange("adminPhone", v)}
          placeholder="98765 43210"
          error={errors.adminPhone}
        />
      </Field>
      <Field label="Designation">
        <Select
          value={data.designation}
          onChange={(e) => onChange("designation", e.target.value)}
          options={[
            { value: "Principal", label: "Principal" },
            { value: "Vice Principal", label: "Vice Principal" },
            { value: "Administrator", label: "Administrator" },
            { value: "IT Manager", label: "IT Manager" },
          ]}
        />
      </Field>
      <div className="col-span-2">
        <Field label="Temporary Password" required error={errors.tempPass}
          hint="Admin will be prompted to change this on first login">
          <Input
            type="password"
            value={data.tempPass}
            onChange={(e) => onChange("tempPass", e.target.value)}
            placeholder="Min 8 characters"
            variant={errors.tempPass ? "error" : "default"}
          />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Confirm Password" required error={errors.confirmPass}>
          <Input
            type="password"
            value={data.confirmPass}
            onChange={(e) => onChange("confirmPass", e.target.value)}
            placeholder="Re-enter password"
            variant={errors.confirmPass ? "error" : "default"}
          />
        </Field>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
import { Plus } from "lucide-react";
// ...existing code...
function SuccessScreen({ schoolName, onAddAnother, onClose }: {
  schoolName: string; onAddAnother: () => void; onClose: () => void;
}) {
  return (
    <div className="text-center py-10 px-6">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">School Created Successfully!</h3>
      <p className="text-sm text-slate-500 mb-1">{schoolName} has been added to the platform.</p>
      <p className="text-sm text-slate-500 mb-8">Login credentials sent to the admin's email.</p>
      <div className="flex gap-3 justify-center">
        <Button type="button" variant="outline" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Close
        </Button>
        <Button type="button" variant="default" onClick={onAddAnother} className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2">
          <Plus width={14} height={14} strokeWidth={2.5} className="inline-block" />
          Add Another School
        </Button>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
const INITIAL_SCHOOL: SchoolInfoData = { schoolName:"", phone:"", city:"", email:"", state:"", board:"", pincode:"", estYear:"", address:"", waNumber:"" };
const INITIAL_BILLING: BillingData = { plan:"pro", billingCycle:"Annually (save 20%)", paymentMethod:"Bank Transfer", gst:"" };
const INITIAL_ADMIN: AdminData = { adminName:"", adminEmail:"", adminPhone:"", designation:"Administrator", tempPass:"", confirmPass:"" };

export default function AddNewSchoolModal({ open, onClose, onSuccess }: AddNewSchoolModalProps) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);

  const {
    control,
    setValue,
    trigger,
    reset: resetForm,
    formState: { errors },
  } = useForm<SchoolModalFormValues>({
    resolver: zodResolver(schoolModalSchema),
    mode: "onChange",
    defaultValues: {
      schoolInfo: INITIAL_SCHOOL,
      billing: INITIAL_BILLING,
      admin: INITIAL_ADMIN,
    },
  });

  const school = useWatch({ control, name: "schoolInfo" }) ?? INITIAL_SCHOOL;
  const billing = useWatch({ control, name: "billing" }) ?? INITIAL_BILLING;
  const admin = useWatch({ control, name: "admin" }) ?? INITIAL_ADMIN;

  const schoolErrors = (Object.keys(errors.schoolInfo ?? {}) as Array<keyof SchoolInfoData>).reduce(
    (acc, key) => {
      const fieldError = errors.schoolInfo?.[key];
      if (fieldError && typeof fieldError !== "string" && "message" in fieldError) {
        acc[key] = fieldError.message ?? "";
      }
      return acc;
    },
    {} as FormErrors<SchoolInfoData>
  );

  const adminErrors = (Object.keys(errors.admin ?? {}) as Array<keyof AdminData>).reduce(
    (acc, key) => {
      const fieldError = errors.admin?.[key];
      if (fieldError && typeof fieldError !== "string" && "message" in fieldError) {
        acc[key] = fieldError.message ?? "";
      }
      return acc;
    },
    {} as FormErrors<AdminData>
  );

  // Close on Escape
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);
  useEffect(() => {
    if (open) { document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden"; }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [open, handleKey]);

  const reset = () => {
    setStep(1); setDone(false);
    resetForm({ schoolInfo: INITIAL_SCHOOL, billing: INITIAL_BILLING, admin: INITIAL_ADMIN });
  };

  const handleNext = async () => {
    if (step === 1) {
      const valid = await trigger("schoolInfo");
      if (!valid) return;
      setStep(2);
      return;
    }

    if (step === 2) {
      const valid = await trigger("billing");
      if (!valid) return;
      setStep(3);
      return;
    }

    if (step === 3) {
      const valid = await trigger("admin");
      if (!valid) return;
      setDone(true);
      onSuccess?.({ school, billing, admin });
      return;
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm "
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-2xl flex flex-col h-[90vh] max-h-[700px] overflow-hidden border border-slate-100"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex-shrink-0 justify-between items-start px-7 pt-6 pb-5">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-slate-800">
              {done ? "School Added" : "Add New School"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {done ? "Everything is set up and ready." : "Set up a new school on the platform"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
 <div className="flex-shrink-0 px-7 pb-5">
        {!done && <Stepper current={step} />}
</div>
        {/* Body */}
        <div className=" flex-1 overflow-y-auto min-h-0 px-7 pb-4" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {done ? (
            <SuccessScreen schoolName={school.schoolName || "The school"} onAddAnother={() => { reset(); }} onClose={onClose} />
          ) : (
            <>
              {step === 1 && <StepSchoolInfo data={school} errors={schoolErrors}
                onChange={(k, v) => setValue(`schoolInfo.${k}`, v, { shouldValidate: true })} />}
              {step === 2 && <StepPlanBilling data={billing}
                onChange={(k, v) => setValue(`billing.${k}`, v, { shouldValidate: true })} />}
              {step === 3 && <StepAdminSetup data={admin} errors={adminErrors}
                onChange={(k, v) => setValue(`admin.${k}`, v, { shouldValidate: true })} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <CardFooter className="justify-between px-7 py-5 border-t border-slate-100 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => step === 1 ? onClose() : setStep((s) => s - 1)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all"
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2"
            >
              {step === 1 && "Next: Plan & Billing"}
              {step === 2 && "Next: Admin Setup"}
              {step === 3 && "Add School & Go Live"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

