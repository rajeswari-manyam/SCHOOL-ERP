import * as React from "react";
import { cn } from "../../utils/cn";

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border rounded-md overflow-hidden">
      <button
        className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span>{title}</span>
        <span className={cn("transition-transform", open && "rotate-180")}>
          ▼
        </span>
      </button>

      {open && <div className="px-4 py-2">{children}</div>}
    </div>
  );
};
