export interface AccountantSettings {
  id: string;
  notificationsEnabled: boolean;
  theme: "light" | "dark";
  language: string;
}

export interface UpdateAccountantSettingsInput {
  notificationsEnabled?: boolean;
  theme?: "light" | "dark";
  language?: string;
}
