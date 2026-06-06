// import { BookOpen } from "lucide-react";
// import type { UnitSyllabus } from "../types/exams.types";

// interface UnitTestSyllabusProps {
//   data?: UnitSyllabus[];
// }

// export const UnitTestSyllabus = ({ data }: UnitTestSyllabusProps) => {
//   if (!data || data.length === 0) return null;

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:border-indigo-200 hover:shadow-sm">

//       {/* ================= HEADER ================= */}
//       <div className="flex items-start justify-between mb-5">
//         <div>
//           <h3 className="text-base font-semibold text-gray-900">
//             Unit Test 1 — April 2025 Syllabus
//           </h3>
//           <p className="text-sm text-gray-500 mt-0.5">
//             Topics to be covered in upcoming test
//           </p>
//         </div>

//         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
//           Coming Soon
//         </span>
//       </div>

//       {/* ================= LIST ================= */}
//       <div className="space-y-4">
//         {data.map((unit, i) => (
//           <div
//             key={i}
//             className="
//               flex gap-4 p-3 rounded-lg
//               border border-transparent
//               transition-all duration-200
//               hover:border-indigo-200
//               hover:bg-indigo-50/30
//               hover:-translate-y-1
//               hover:shadow-sm
//               active:scale-[0.98]
//             "
//           >
//             {/* Icon */}
//             <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
//               <BookOpen className="w-5 h-5 text-indigo-600" />
//             </div>

//             {/* Content */}
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-2">
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   {unit.subject}
//                 </h4>

//                 <span className="text-xs text-indigo-600 font-medium">
//                   {unit.chapters}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
//                 {unit.topics}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };