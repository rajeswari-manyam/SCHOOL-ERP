import { cn } from "../../utils/cn";

export interface TabItem {
  label: string;
  value: string;
}

export interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex space-x-2 border-b border-gray-200", className)}>
      {items.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={cn(
              "px-3 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-[1px]",
              isActive
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
