

import { useState, useEffect, useCallback, Fragment } from "react";
import { cn } from "@/utils/cn";

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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
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
        <input
          id={id}
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "flex-1 border border-slate-200 rounded-r-[10px] px-3 py-2.5 text-sm outline-none transition-all",
            "focus:border-[#5b52f5] focus:ring-2 focus:ring-[#5b52f5]/10",
            error && "border-red-400 focus:border-red-400 focus:ring-red-100"
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
      <label className="text-[11px] font-bold uppercase tracking-[0.07em] text-slate-500">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// Shared input styles
const inputCls = (error?: string) => cn(
  "w-full border border-slate-200 rounded-[10px] px-3 py-2.5 text-sm outline-none transition-all",
  "placeholder:text-slate-300 focus:border-[#5b52f5] focus:ring-2 focus:ring-[#5b52f5]/10",
  error && "border-red-400 focus:border-red-400 focus:ring-red-100"
);
const selectCls = (error?: string) => cn(inputCls(error), "bg-white cursor-pointer appearance-none pr-9",
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")] bg-no-repeat bg-[right_12px_center]"
);

// ─── Step 1: School Info ──────────────────────────────────────────────────────
function StepSchoolInfo({ data, errors, onChange }: {
  data: SchoolInfoData;
  errors: FormErrors<SchoolInfoData>;
  onChange: (k: keyof SchoolInfoData, v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
      <Field label="School Name" required error={errors.schoolName}>
        <input className={inputCls(errors.schoolName)} value={data.schoolName}
          onChange={(e) => onChange("schoolName", e.target.value)} placeholder="St. Mary's CBSE School" />
      </Field>
      <Field label="Phone Number" required error={errors.phone}>
        <PhoneInput id="phone" value={data.phone} onChange={(v) => onChange("phone", v)}
          placeholder="98765 43210" error={undefined} />
      </Field>
      <Field label="City" required error={errors.city}>
        <input className={inputCls(errors.city)} value={data.city}
          onChange={(e) => onChange("city", e.target.value)} placeholder="Hanamkonda" />
      </Field>
      <Field label="Email" error={errors.email}>
        <input type="email" className={inputCls(errors.email)} value={data.email}
          onChange={(e) => onChange("email", e.target.value)} placeholder="principal@school.com" />
      </Field>
      <Field label="State" required error={errors.state}>
        <select className={selectCls(errors.state)} value={data.state}
          onChange={(e) => onChange("state", e.target.value)}>
          <option value="">Select state</option>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Board" required error={errors.board}>
        <select className={selectCls(errors.board)} value={data.board}
          onChange={(e) => onChange("board", e.target.value)}>
          <option value="">Select board</option>
          {BOARDS.map((b) => <option key={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Pincode">
        <input className={inputCls()} value={data.pincode} maxLength={6}
          onChange={(e) => onChange("pincode", e.target.value)} placeholder="506001" />
      </Field>
      <Field label="Established Year">
        <input type="number" className={inputCls()} value={data.estYear} min={1800} max={2024}
          onChange={(e) => onChange("estYear", e.target.value)} placeholder="2005" />
      </Field>
      <div className="col-span-2">
        <Field label="Address">
          <textarea className={cn(inputCls(), "resize-none h-20")} value={data.address}
            onChange={(e) => onChange("address", e.target.value)} placeholder="Enter full school address..." />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="WhatsApp Business Number" required error={errors.waNumber}
          hint="This number will send all automated WhatsApp messages to parents">
          <PhoneInput id="waNumber" value={data.waNumber} onChange={(v) => onChange("waNumber", v)}
            placeholder="90000 12345" error={undefined} />
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
          <select className={selectCls()} value={data.billingCycle}
            onChange={(e) => onChange("billingCycle", e.target.value)}>
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Annually (save 20%)</option>
          </select>
        </Field>
        <Field label="Payment Method" required>
          <select className={selectCls()} value={data.paymentMethod}
            onChange={(e) => onChange("paymentMethod", e.target.value)}>
            <option>UPI</option>
            <option>Bank Transfer</option>
            <option>Credit Card</option>
          </select>
        </Field>
        <div className="col-span-2">
          <Field label="GST Number" hint="Optional — enter to receive GST invoices">
            <input className={inputCls()} value={data.gst}
              onChange={(e) => onChange("gst", e.target.value)} placeholder="22AAAAA0000A1Z5" />
          </Field>
        </div>
      </div>

      {/* Included modules */}
      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-700 mb-3">Included modules</p>
        {["Student & Teacher Management","Attendance & Timetable","Fee Management & Receipts","WhatsApp Parent Notifications"].map((m) => (
          <div key={m} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-none">
            <div className="w-5 h-5 rounded-[5px] bg-[#5b52f5] flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
        <input className={inputCls(errors.adminName)} value={data.adminName}
          onChange={(e) => onChange("adminName", e.target.value)} placeholder="Ramesh Kumar" />
      </Field>
      <Field label="Admin Email" required error={errors.adminEmail}>
        <input type="email" className={inputCls(errors.adminEmail)} value={data.adminEmail}
          onChange={(e) => onChange("adminEmail", e.target.value)} placeholder="admin@school.com" />
      </Field>
      <Field label="Admin Phone" required error={errors.adminPhone}>
        <PhoneInput id="adminPhone" value={data.adminPhone} onChange={(v) => onChange("adminPhone", v)}
          placeholder="98765 43210" error={undefined} />
      </Field>
      <Field label="Designation">
        <select className={selectCls()} value={data.designation}
          onChange={(e) => onChange("designation", e.target.value)}>
          <option>Principal</option>
          <option>Vice Principal</option>
          <option>Administrator</option>
          <option>IT Manager</option>
        </select>
      </Field>
      <div className="col-span-2">
        <Field label="Temporary Password" required error={errors.tempPass}
          hint="Admin will be prompted to change this on first login">
          <input type="password" className={inputCls(errors.tempPass)} value={data.tempPass}
            onChange={(e) => onChange("tempPass", e.target.value)} placeholder="Min 8 characters" />
        </Field>
      </div>
      <div className="col-span-2">
        <Field label="Confirm Password" required error={errors.confirmPass}>
          <input type="password" className={inputCls(errors.confirmPass)} value={data.confirmPass}
            onChange={(e) => onChange("confirmPass", e.target.value)} placeholder="Re-enter password" />
        </Field>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ schoolName, onAddAnother, onClose }: {
  schoolName: string; onAddAnother: () => void; onClose: () => void;
}) {
  return (
    <div className="text-center py-10 px-6">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">School Created Successfully!</h3>
      <p className="text-sm text-slate-500 mb-1">{schoolName} has been added to the platform.</p>
      <p className="text-sm text-slate-500 mb-8">Login credentials sent to the admin's email.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
          Close
        </button>
        <button onClick={onAddAnother}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#5b52f5] text-white hover:bg-[#4740e8] transition-colors flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Another School
        </button>
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
  const [school, setSchool] = useState<SchoolInfoData>(INITIAL_SCHOOL);
  const [billing, setBilling] = useState<BillingData>(INITIAL_BILLING);
  const [admin, setAdmin] = useState<AdminData>(INITIAL_ADMIN);
  const [schoolErr, setSchoolErr] = useState<FormErrors<SchoolInfoData>>({});
  const [adminErr, setAdminErr] = useState<FormErrors<AdminData>>({});

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
    setSchool(INITIAL_SCHOOL); setBilling(INITIAL_BILLING); setAdmin(INITIAL_ADMIN);
    setSchoolErr({}); setAdminErr({});
  };

  const validateSchool = (): boolean => {
    const errs: FormErrors<SchoolInfoData> = {};
    if (!school.schoolName.trim()) errs.schoolName = "School name is required";
    if (!school.phone.trim()) errs.phone = "Phone number is required";
    if (!school.city.trim()) errs.city = "City is required";
    if (!school.state) errs.state = "State is required";
    if (!school.board) errs.board = "Board is required";
    if (!school.waNumber.trim()) errs.waNumber = "WhatsApp number is required";
    setSchoolErr(errs);
    return Object.keys(errs).length === 0;
  };

  const validateAdmin = (): boolean => {
    const errs: FormErrors<AdminData> = {};
    if (!admin.adminName.trim()) errs.adminName = "Admin name is required";
    if (!admin.adminEmail.trim() || !/\S+@\S+\.\S+/.test(admin.adminEmail)) errs.adminEmail = "Valid email required";
    if (!admin.adminPhone.trim()) errs.adminPhone = "Phone is required";
    if (!admin.tempPass || admin.tempPass.length < 8) errs.tempPass = "Password must be at least 8 characters";
    if (admin.confirmPass !== admin.tempPass) errs.confirmPass = "Passwords do not match";
    setAdminErr(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateSchool()) return;
    if (step === 3) {
      if (!validateAdmin()) return;
      setDone(true);
      onSuccess?.({ school, billing, admin });
      return;
    }
    setStep((s) => s + 1);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm "
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-[20px] w-full max-w-2xl
          flex flex-col
          h-[90vh] max-h-[700px]
          overflow-hidden
          border border-slate-100"
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
          <button onClick={onClose} aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
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
              {step === 1 && <StepSchoolInfo data={school} errors={schoolErr}
                onChange={(k, v) => { setSchool((p) => ({ ...p, [k]: v })); setSchoolErr((p) => ({ ...p, [k]: undefined })); }} />}
              {step === 2 && <StepPlanBilling data={billing}
                onChange={(k, v) => setBilling((p) => ({ ...p, [k]: v }))} />}
              {step === 3 && <StepAdminSetup data={admin} errors={adminErr}
                onChange={(k, v) => { setAdmin((p) => ({ ...p, [k]: v })); setAdminErr((p) => ({ ...p, [k]: undefined })); }} />}
            </>
          )}
        </div>

        {/* Footer */}
        {!done && (
          <div className="flex-shrink-0 justify-between items-center px-7 py-5 border-t border-slate-100 mt-2">
            <button
              onClick={() => step === 1 ? onClose() : setStep((s) => s - 1)}
              className="px-4 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-all">
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button onClick={handleNext}
              className="bg-[#5b52f5] hover:bg-[#4740e8] active:scale-[0.98] text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-all">
              {step === 1 && "Next: Plan & Billing"}
              {step === 2 && "Next: Admin Setup"}
              {step === 3 && "Add School & Go Live"}
             
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

