export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: ["*"],
  school_admin: [
    "dashboard.view",
    "attendance.manage",
    "fees.manage",
    "students.manage",
  ],

};

export const hasPermission = (role: string, permission: string) => {
  const perms = (ROLE_PERMISSIONS[role] || []) as string[];
  return perms.includes("*") || perms.includes(permission);
};
