// src/features/auth/components/RoleBrandingPanel.tsx

import { useState, useEffect } from "react";

export type RoleId =
  | "superadmin"
  | "schooladmin"
  | "teacher"
  | "accountant"
  | "parent"
  | "student";

/* ── one distinct color per role ── */
const ROLE_BG: Record<RoleId, string> = {
  superadmin:  "#3525CD",   // indigo
  schooladmin: "#3525CD",   // indigo
  teacher:     "#3525CD",   // indigo
  accountant:  "#3525CD",   // indigo
  parent:      "#3525CD",   // indigo
  student:     "#3525CD",   // indigo
};

interface ChipItem  { icon: string; label: string }
interface MockupRow { label: string; value: string; color?: string }

interface PanelConfig {
  badge:       string;
  headline:    string;
  subheadline: string;
  chips:       ChipItem[];
  waNote:      string;
  mockupLines: MockupRow[];
  Illustration: React.FC<{ bg: string }>;
}

/* ── SVG illustrations ── */
const FamilyIllustration: React.FC<{ bg: string }> = ({ bg }) => (
  <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="130" cy="110" rx="115" ry="75" fill="white" fillOpacity="0.12" />
    <circle cx="90" cy="62" r="22" fill="white" fillOpacity="0.9" />
    <ellipse cx="90" cy="105" rx="20" ry="28" fill="white" fillOpacity="0.85" />
    <rect x="72" y="80" width="36" height="8" rx="4" fill={bg} fillOpacity="0.6" />
    <ellipse cx="90" cy="48" rx="22" ry="12" fill="#4a3728" />
    <circle cx="158" cy="58" r="24" fill="white" fillOpacity="0.9" />
    <ellipse cx="158" cy="103" rx="22" ry="30" fill="white" fillOpacity="0.85" />
    <rect x="138" y="76" width="40" height="8" rx="4" fill={bg} fillOpacity="0.6" />
    <ellipse cx="158" cy="43" rx="20" ry="9" fill="#2d2420" />
    <circle cx="124" cy="80" r="16" fill="white" fillOpacity="0.95" />
    <ellipse cx="124" cy="113" rx="14" ry="20" fill="white" fillOpacity="0.9" />
    <ellipse cx="124" cy="69" rx="16" ry="8" fill="#7b5c3e" />
    <rect x="100" y="118" width="52" height="36" rx="5" fill="white" fillOpacity="0.25" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
    <rect x="104" y="122" width="44" height="26" rx="3" fill={bg} fillOpacity="0.5" />
    <rect x="108" y="126" width="30" height="2.5" rx="1.25" fill="white" fillOpacity="0.7" />
    <rect x="108" y="131" width="22" height="2.5" rx="1.25" fill="white" fillOpacity="0.5" />
    <rect x="108" y="136" width="26" height="2.5" rx="1.25" fill="white" fillOpacity="0.4" />
  </svg>
);

const TeacherIllustration: React.FC<{ bg: string }> = ({ bg }) => (
  <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="130" cy="110" rx="115" ry="70" fill="white" fillOpacity="0.1" />
    <rect x="30" y="30" width="140" height="90" rx="6" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" />
    <rect x="38" y="38" width="124" height="74" rx="4" fill={bg} fillOpacity="0.4" />
    <rect x="44" y="46" width="60" height="3" rx="1.5" fill="white" fillOpacity="0.8" />
    <rect x="44" y="53" width="80" height="2.5" rx="1.25" fill="white" fillOpacity="0.55" />
    <rect x="44" y="60" width="70" height="2.5" rx="1.25" fill="white" fillOpacity="0.45" />
    <rect x="44" y="67" width="50" height="2.5" rx="1.25" fill="white" fillOpacity="0.35" />
    <circle cx="210" cy="70" r="22" fill="white" fillOpacity="0.9" />
    <ellipse cx="210" cy="115" rx="20" ry="28" fill="white" fillOpacity="0.85" />
    <ellipse cx="210" cy="56" rx="18" ry="9" fill="#2d2420" />
    <line x1="185" y1="80" x2="160" y2="65" stroke="white" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
    <circle cx="160" cy="65" r="2.5" fill="white" fillOpacity="0.8" />
    <circle cx="50" cy="148" r="12" fill="white" fillOpacity="0.8" />
    <circle cx="80" cy="148" r="12" fill="white" fillOpacity="0.8" />
    <circle cx="110" cy="148" r="12" fill="white" fillOpacity="0.8" />
  </svg>
);

const AdminIllustration: React.FC<{ bg: string }> = ({ bg }) => (
  <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="130" cy="110" rx="115" ry="70" fill="white" fillOpacity="0.08" />
    <rect x="50" y="28" width="160" height="105" rx="8" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
    <rect x="58" y="36" width="144" height="89" rx="5" fill={bg} fillOpacity="0.45" />
    <rect x="64" y="42" width="62" height="36" rx="3" fill="white" fillOpacity="0.25" />
    <rect x="134" y="42" width="62" height="36" rx="3" fill="white" fillOpacity="0.2" />
    <rect x="64" y="84" width="132" height="32" rx="3" fill="white" fillOpacity="0.15" />
    <rect x="70" y="62" width="6" height="10" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="80" y="55" width="6" height="17" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="90" y="59" width="6" height="13" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="100" y="52" width="6" height="20" rx="2" fill="white" fillOpacity="0.7" />
    <rect x="140" y="50" width="30" height="5" rx="2" fill="white" fillOpacity="0.5" />
    <rect x="140" y="60" width="46" height="8" rx="2" fill="white" fillOpacity="0.75" />
    <rect x="118" y="133" width="24" height="6" rx="2" fill="white" fillOpacity="0.3" />
    <rect x="100" y="139" width="60" height="4" rx="2" fill="white" fillOpacity="0.25" />
    <circle cx="210" cy="68" r="20" fill="white" fillOpacity="0.88" />
    <ellipse cx="210" cy="108" rx="18" ry="25" fill="white" fillOpacity="0.82" />
    <ellipse cx="210" cy="54" rx="16" ry="8" fill="#1a1a2e" />
  </svg>
);

const AccountantIllustration: React.FC<{ bg: string }> = ({ bg }) => (
  <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="130" cy="110" rx="115" ry="70" fill="white" fillOpacity="0.08" />
    <rect x="45" y="25" width="120" height="140" rx="6" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
    <rect x="53" y="35" width="104" height="120" rx="4" fill={bg} fillOpacity="0.4" />
    <rect x="59" y="44" width="60" height="3" rx="1.5" fill="white" fillOpacity="0.6" />
    <rect x="59" y="57" width="40" height="3" rx="1.5" fill="white" fillOpacity="0.56" />
    <rect x="59" y="70" width="60" height="3" rx="1.5" fill="white" fillOpacity="0.52" />
    <rect x="59" y="83" width="40" height="3" rx="1.5" fill="white" fillOpacity="0.48" />
    <rect x="59" y="96" width="60" height="3" rx="1.5" fill="white" fillOpacity="0.44" />
    <rect x="59" y="109" width="40" height="3" rx="1.5" fill="white" fillOpacity="0.4" />
    <rect x="125" y="44" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.8" />
    <rect x="125" y="57" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.75" />
    <rect x="125" y="70" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.7" />
    <rect x="125" y="83" width="24" height="3" rx="1.5" fill="white" fillOpacity="0.65" />
    <line x1="55" y1="142" x2="157" y2="142" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
    <rect x="118" y="146" width="35" height="4" rx="2" fill="white" fillOpacity="0.7" />
    <ellipse cx="215" cy="90" rx="26" ry="8" fill="white" fillOpacity="0.4" />
    <rect x="189" y="70" width="52" height="20" rx="2" fill="white" fillOpacity="0.3" />
    <ellipse cx="215" cy="70" rx="26" ry="8" fill="white" fillOpacity="0.5" />
    <rect x="192" y="54" width="46" height="16" rx="2" fill="white" fillOpacity="0.35" />
    <ellipse cx="215" cy="54" rx="23" ry="7" fill="white" fillOpacity="0.6" />
  </svg>
);

const StudentIllustration: React.FC<{ bg: string }> = () => (
  <svg viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="130" cy="110" rx="115" ry="70" fill="white" fillOpacity="0.08" />
    <path d="M40 50 Q130 42 130 50 L130 155 Q40 163 40 155 Z" fill="white" fillOpacity="0.22" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
    <path d="M220 50 Q130 42 130 50 L130 155 Q220 163 220 155 Z" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.3" strokeWidth="1.2" />
    <line x1="130" y1="50" x2="130" y2="155" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
    <line x1="55" y1="70" x2="105" y2="70" stroke="white" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="55" y1="84" x2="100" y2="84" stroke="white" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="55" y1="98" x2="108" y2="98" stroke="white" strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="55" y1="112" x2="95" y2="112" stroke="white" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="145" y1="70" x2="195" y2="70" stroke="white" strokeOpacity="0.4" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="145" y1="84" x2="190" y2="84" stroke="white" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="145" y1="98" x2="193" y2="98" stroke="white" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="96" y="24" width="68" height="10" rx="3" fill="white" fillOpacity="0.75" />
    <polygon points="130,8 164,24 130,24 96,24" fill="white" fillOpacity="0.85" />
    <line x1="164" y1="24" x2="164" y2="38" stroke="white" strokeOpacity="0.7" strokeWidth="2" />
    <circle cx="164" cy="40" r="4" fill="white" fillOpacity="0.8" />
  </svg>
);

/* ── panel config per role ── */
const PANEL_CONFIGS: Record<RoleId, PanelConfig> = {
  superadmin: {
    badge: "Super admin portal",
    headline: "Manage all schools\non one platform.",
    subheadline: "Full visibility across every institution.",
    chips: [
      { icon: "🏫", label: "School management" },
      { icon: "📊", label: "Platform analytics" },
      { icon: "🔐", label: "Audit logs" },
    ],
    waNote: "Alerts also sent via WhatsApp — no app needed",
    mockupLines: [
      { label: "Active schools", value: "500+",  color: "#a5f3fc" },
      { label: "Total users",    value: "1.2M",  color: "#86efac" },
      { label: "Alerts today",   value: "3,847", color: "#fde68a" },
    ],
    Illustration: AdminIllustration,
  },
  schooladmin: {
    badge: "School admin portal",
    headline: "Everything your school\nneeds, automated.",
    subheadline: "Attendance, fees and broadcasts on WhatsApp.",
    chips: [
      { icon: "✅", label: "Attendance alerts" },
      { icon: "💰", label: "Fee reminders" },
      { icon: "📢", label: "Broadcasts" },
    ],
    waNote: "Alerts also sent via WhatsApp — no app needed",
    mockupLines: [
      { label: "Students enrolled", value: "1,240", color: "#a5f3fc" },
      { label: "Fee collected",     value: "98%",   color: "#86efac" },
      { label: "Alerts sent",       value: "Daily", color: "#fde68a" },
    ],
    Illustration: AdminIllustration,
  },
  teacher: {
    badge: "Teacher portal",
    headline: "Mark attendance,\nshare results instantly.",
    subheadline: "Homework and exam results sent to parents automatically.",
    chips: [
      { icon: "📋", label: "Attendance" },
      { icon: "📝", label: "Exam results" },
      { icon: "📚", label: "Homework" },
    ],
    waNote: "Alerts also sent via WhatsApp — no app needed",
    mockupLines: [
      { label: "My classes",    value: "6",   color: "#a5f3fc" },
      { label: "Students",      value: "184", color: "#86efac" },
      { label: "Pending marks", value: "2",   color: "#fde68a" },
    ],
    Illustration: TeacherIllustration,
  },
  accountant: {
    badge: "Accountant portal",
    headline: "Fee collection,\ntracked and automated.",
    subheadline: "Receipts and reminders delivered on WhatsApp.",
    chips: [
      { icon: "💳", label: "Fee collection" },
      { icon: "🧾", label: "Receipts" },
      { icon: "📈", label: "Reports" },
    ],
    waNote: "Alerts also sent via WhatsApp — no app needed",
    mockupLines: [
      { label: "Collected today", value: "₹42,500", color: "#a5f3fc" },
      { label: "Pending",         value: "₹8,500",  color: "#fca5a5" },
      { label: "Collection rate", value: "98%",     color: "#86efac" },
    ],
    Illustration: AccountantIllustration,
  },
  parent: {
    badge: "Parent portal",
    headline: "Stay connected with\nyour child's school.",
    subheadline: "Real-time updates on attendance, fees and exams.",
    chips: [
      { icon: "📅", label: "Attendance alerts" },
      { icon: "💰", label: "Fee payments" },
      { icon: "🎓", label: "Exam results" },
    ],
    waNote: "Alerts also sent via WhatsApp — no app needed",
    mockupLines: [
      { label: "Today's attendance", value: "Present", color: "#86efac" },
      { label: "Fee status",         value: "Paid",    color: "#86efac" },
      { label: "Next exam",          value: "9 days",  color: "#fde68a" },
    ],
    Illustration: FamilyIllustration,
  },
  student: {
    badge: "Student portal",
    headline: "Your academics,\nall in one place.",
    subheadline: "Timetable, homework, results and fee status.",
    chips: [
      { icon: "📅", label: "Timetable" },
      { icon: "📊", label: "Results" },
      { icon: "📚", label: "Homework" },
    ],
    waNote: "Alerts also sent via WhatsApp — no app needed",
    mockupLines: [
      { label: "Attendance",       value: "92%",    color: "#86efac" },
      { label: "Pending homework", value: "2",      color: "#fde68a" },
      { label: "Next exam",        value: "Friday", color: "#a5f3fc" },
    ],
    Illustration: StudentIllustration,
  },
};

interface RoleBrandingPanelProps {
  roleId: RoleId;
}

export const RoleBrandingPanel = ({ roleId }: RoleBrandingPanelProps) => {
  const cfg  = PANEL_CONFIGS[roleId];
  const bg   = ROLE_BG[roleId];
  const { Illustration } = cfg;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, [roleId]);

  const slide = (delay: number): React.CSSProperties => ({
    opacity:    visible ? 1 : 0,
    transform:  visible ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`,
  });

  return (
    <div
      className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
      style={{ background: bg, transition: "background 0.5s ease" }}
    >
      {/* decorative blobs */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.07)" }} />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)" }} />

      <div className="relative z-10 flex flex-col justify-center h-full px-10 xl:px-14 py-12">

        {/* badge */}
        <div className="inline-flex items-center gap-2 mb-6 self-start" style={slide(0)}>
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="text-[11px] uppercase tracking-widest text-white/70 font-medium">{cfg.badge}</span>
        </div>

        {/* headline */}
        <h2 className="text-[28px] xl:text-[32px] font-bold text-white leading-snug mb-3 whitespace-pre-line" style={slide(0.06)}>
          {cfg.headline}
        </h2>

        <p className="text-[13px] text-white/65 mb-8 leading-relaxed" style={slide(0.1)}>
          {cfg.subheadline}
        </p>

        {/* phone mockup */}
        <div
          className="relative mx-auto w-[220px] xl:w-[240px]"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
            transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
          }}
        >
          <div
            className="rounded-[28px] border-[3px] overflow-hidden"
            style={{ borderColor: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.08)" }}
          >
            {/* notch */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-16 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
            </div>

            {/* illustration */}
            <div className="mx-3 rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", height: 130 }}>
              <Illustration bg={bg} />
            </div>

            {/* data rows */}
            <div className="px-4 py-3 space-y-2">
              {cfg.mockupLines.map((line) => (
                <div key={line.label} className="flex items-center justify-between">
                  <span className="text-[10px] text-white/55">{line.label}</span>
                  <span className="text-[11px] font-semibold" style={{ color: line.color ?? "white" }}>{line.value}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp strip */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 mx-3 mb-3 rounded-xl"
              style={{ background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.35)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-[9.5px] text-white/80 leading-tight">{cfg.waNote}</span>
            </div>
          </div>

          {/* floating chip 1 — top right */}
          <div
            className="absolute -right-10 top-6 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium text-white whitespace-nowrap"
            style={{
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
              opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(10px)",
              transition: "opacity 0.4s ease 0.35s, transform 0.4s ease 0.35s",
            }}
          >
            <span style={{ fontSize: 12 }}>{cfg.chips[0].icon}</span>{cfg.chips[0].label}
          </div>

          {/* floating chip 2 — left center */}
          <div
            className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium text-white whitespace-nowrap"
            style={{
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
              opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-10px)",
              transition: "opacity 0.4s ease 0.42s, transform 0.4s ease 0.42s",
            }}
          >
            <span style={{ fontSize: 12 }}>{cfg.chips[1].icon}</span>{cfg.chips[1].label}
          </div>

          {/* floating chip 3 — bottom right */}
          <div
            className="absolute -right-10 bottom-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-medium text-white whitespace-nowrap"
            style={{
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)",
              opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(10px)",
              transition: "opacity 0.4s ease 0.49s, transform 0.4s ease 0.49s",
            }}
          >
            <span style={{ fontSize: 12 }}>{cfg.chips[2].icon}</span>{cfg.chips[2].label}
          </div>
        </div>

      </div>

      <div className="relative z-10 pb-5 px-10 xl:px-14">
        <p className="text-[10px] text-white/35">© 2024 Academic Curator ERP</p>
      </div>
    </div>
  );
};