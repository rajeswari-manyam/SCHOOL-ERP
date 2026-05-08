
import { Lightbulb, ArrowRight } from "lucide-react";

export const PreparationTips = () => {
  return (
   <div className="bg-indigo-600 rounded-xl p-5 text-white border border-transparent hover:border-indigo-300 transition-all duration-300 hover:shadow-lg"> 
      <div className="flex items-center gap-2 mb-2">
       <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-200" />
       <h3 className="text-sm sm:text-base font-semibold"> Preparation Tips</h3>
      </div>
     <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed mb-4">
        Maximize your scores with our expert-curated study plan for Unit Test 1.
      </p>
<button className="w-full inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-indigo-700 text-xs sm:text-sm font-semibold rounded-lg hover:bg-indigo-50 active:scale-[0.98] transition-all">
        View Study Guide
    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
};