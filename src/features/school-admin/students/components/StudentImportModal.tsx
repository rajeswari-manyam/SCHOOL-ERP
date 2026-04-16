// import { useImportStudents } from "../hooks/useStudents";
// import { useRef } from "react";

// export const StudentImportModal = ({
//   open,
//   onClose,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const { mutate, isLoading } = useImportStudents();

//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
//       <div className="bg-white rounded shadow p-6 w-80">
//         <h2 className="font-semibold mb-4">Import Students (CSV)</h2>
//         <input ref={inputRef} type="file" accept=".csv" className="mb-4" />
//         <div className="flex gap-2 justify-end">
//           <button className="px-3 py-1" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="bg-blue-600 text-white px-3 py-1 rounded"
//             disabled={isLoading}
//             onClick={() => {
//               const file = inputRef.current?.files?.[0];
//               if (file) mutate(file, { onSuccess: onClose });
//             }}
//           >
//             {isLoading ? "Importing..." : "Import"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
