import React from "react";
import { Button } from "@/components/ui/button";

interface Tab {
  id: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ClassTabs: React.FC<Props> = ({ tabs, selectedId, onSelect }) => {
  return (
    <div className="flex border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === selectedId;
        return (
          <Button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            variant="ghost"
            className={`px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors border-b-2 -mb-px rounded-none ${
              isActive
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ClassTabs;