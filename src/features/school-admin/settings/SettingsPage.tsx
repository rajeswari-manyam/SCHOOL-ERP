import React from "react";
import { useNavigate } from "react-router-dom";
import { useSetupStatus } from "@/features/school-admin/dashboard/hooks/useSetupStatus";
import { SetupProgressBanner } from "@/features/school-admin/dashboard/components/SetupProgressBanner";
import { Building2, MessageSquare, Calendar, Banknote, Users, Shield, ChevronRight, CheckCircle2, CreditCard, Plug } from "lucide-react";

// ── Settings card config ───────────────────────────────────────────────────────

const SETTINGS_CARDS: {
  id: string;
  path: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}[] = [
  { id: "schoolProfile",  path: "school-profile",  title: "School Profile",           description: "Manage school name, board, and principal details",        icon: "building",  color: "bg-indigo-100 text-indigo-600" },
  { id: "whatsapp",       path: "whatsapp",        title: "WhatsApp & Notifications", description: "Configure message templates and alert settings",           icon: "message",   color: "bg-green-100 text-green-600"   },
  { id: "academicConfig", path: "academic-config", title: "Academic Configuration",   description: "Set working days, classes, and academic years",            icon: "calendar",  color: "bg-blue-100 text-blue-600"     },
  { id: "feeConfig",      path: "fee-config",      title: "Fee Configuration",        description: "Manage fee heads, structures, and transport slabs",        icon: "banknote",  color: "bg-emerald-100 text-emerald-600"},
  { id: "userAccounts",   path: "user-accounts",   title: "User Accounts",            description: "Create and manage staff login credentials",                icon: "users",     color: "bg-amber-100 text-amber-600"   },
  { id: "permissions",    path: "permissions",     title: "Permissions",              description: "Set module access for different roles",                    icon: "shield",    color: "bg-rose-100 text-rose-600"     },
  { id: "billing",        path: "billing",         title: "Plan & Billing",           description: "View your subscription, track usage, and manage payments", icon: "billing",   color: "bg-violet-100 text-violet-600" },
  { id: "integrations",   path: "integrations",    title: "Integrations",             description: "Connect Razorpay so parents can pay fees online",          icon: "plug",      color: "bg-sky-100 text-sky-600"       },
];

// ── Icon map ───────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  building:  <Building2  className="w-5 h-5 sm:w-6 sm:h-6" />,
  message:   <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
  calendar:  <Calendar   className="w-5 h-5 sm:w-6 sm:h-6" />,
  banknote:  <Banknote   className="w-5 h-5 sm:w-6 sm:h-6" />,
  users:     <Users      className="w-5 h-5 sm:w-6 sm:h-6" />,
  shield:    <Shield     className="w-5 h-5 sm:w-6 sm:h-6" />,
  billing:   <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />,
  plug:      <Plug       className="w-5 h-5 sm:w-6 sm:h-6" />,
};

// ── Main page ──────────────────────────────────────────────────────────────────

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: setupData } = useSetupStatus();
  const setupStatusList = setupData?.items ?? [];
  const academicConfigDone = setupStatusList.find(s => s.id === 'settings')?.done ?? false;

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

        {/* ── Page header ── */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-base font-semibold text-gray-900 leading-tight">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            Configure and manage your school's operational preferences
          </p>
        </div>

        <SetupProgressBanner />

        {/* ── Settings cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {SETTINGS_CARDS.map((card) => {
            const isAcademicConfig = card.id === 'academicConfig';
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => navigate(card.path)}
                className="w-full text-left bg-white rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6 flex flex-col gap-3 sm:gap-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 cursor-pointer hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                    {ICON_MAP[card.icon]}
                  </div>
                  {isAcademicConfig && academicConfigDone && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Done
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{card.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{card.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-600">Configure</span>
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
