import React from "react";

export type SettingsTab =
  | "schoolProfile"
  | "whatsapp"
  | "academicConfig"
  | "feeConfig"
  | "userAccounts"
  | "permissions"
  | "integrations";

const NAV_ITEMS: { key: SettingsTab; label: string }[] = [
  { key: "schoolProfile", label: "School Profile" },
  { key: "whatsapp", label: "WhatsApp & Notifications" },
  { key: "academicConfig", label: "Academic Configuration" },
  { key: "feeConfig", label: "Fee Configuration" },
  { key: "userAccounts", label: "User Accounts" },
  { key: "permissions", label: "Permissions" },
  { key: "integrations", label: "Integrations" },
];

interface Props {
  activeTab: SettingsTab;
  onSelectTab: (tab: SettingsTab) => void;
}

export const SettingsSidebar: React.FC<Props> = ({ activeTab, onSelectTab }) => (
  <nav className="w-56 flex-shrink-0 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 shadow-sm">
    <div className="mb-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 px-3">Settings</h3>
    </div>
    <ul className="space-y-1">
      {NAV_ITEMS.map(item => (
        <li key={item.key}>
          <button
            onClick={() => onSelectTab(item.key)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 font-medium ${
              activeTab === item.key
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "text-gray-700 hover:bg-white hover:text-indigo-600 hover:shadow-md"
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);