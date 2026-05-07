// components/UpcomingDeadlines.tsx
import {  MessageCircle } from "lucide-react";
import type { Deadline } from "../types/exams.types";

interface UpcomingDeadlinesProps {
  deadlines?: Deadline[];
}

export const UpcomingDeadlines = ({ deadlines }: UpcomingDeadlinesProps) => {
  if (!deadlines || deadlines.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Upcoming Deadlines
        </h3>
        <button className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors">
          <MessageCircle className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="space-y-3">
        {deadlines.map((d, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{d.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{d.dueText}</p>
              {d.date && (
                <p className="text-xs text-gray-400 mt-0.5">{d.date}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};