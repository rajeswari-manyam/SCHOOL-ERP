import * as React from "react";
import { cn } from "../../utils/cn";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = "single",
  className,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (type === "single") {
      setOpenItems((prev) => (prev[0] === id ? [] : [id]));
    } else {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    }
  };

  return (
    <div className={cn("w-full rounded-md border", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);

        return (
          <div key={item.id} className="border-b last:border-none">
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left font-medium hover:bg-gray-100"
            >
              {item.title}
              <span
                className={cn("transition-transform", isOpen && "rotate-180")}
              >
                ▼
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 text-sm text-gray-600">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
