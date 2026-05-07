// components/PreparationTips.tsx
import { Lightbulb, ArrowRight } from "lucide-react";

export const PreparationTips = () => {
  return (
    <div className="bg-indigo-600 rounded-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-indigo-200" />
        <h3 className="text-sm font-semibold">Preparation Tips</h3>
      </div>
      <p className="text-xs text-indigo-100 leading-relaxed mb-4">
        Maximize your scores with our expert-curated study plan for Unit Test 1.
      </p>
      <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-indigo-700 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors">
        View Study Guide
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};