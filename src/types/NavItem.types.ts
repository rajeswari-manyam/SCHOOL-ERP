import type { ReactNode } from "react";

export interface NavItem {
  label: string;
  to: string;
  icon?: ReactNode;
  locked?: boolean;
  /** Optional section header this item is grouped under (e.g. "Overview", "Management").
   *  Items without a group render as a flat list, same as before. */
  group?: string;
}
