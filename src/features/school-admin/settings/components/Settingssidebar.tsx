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
  <nav className="w-56 flex-shrink-0">
    <ul className="space-y-0.5">
      {NAV_ITEMS.map(item => (
        <li key={item.key}>
          <button
            onClick={() => onSelectTab(item.key)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              activeTab === item.key
                ? "bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600 pl-2"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);