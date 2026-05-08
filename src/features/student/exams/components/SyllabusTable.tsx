// components/SyllabusTable.tsx
import { FileText, Download } from "lucide-react";
import type { Syllabus } from "../types/exams.types";

export const SyllabusTable = ({ data }: { data: Syllabus[] }) => {
  return (
    <div className="w-full">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-indigo-50/50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Subject</th>
              <th className="px-6 py-3 text-left">Syllabus File</th>
              <th className="px-6 py-3 text-left">Uploaded By</th>
              <th className="px-6 py-3 text-left">Upload Date</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.map((s, i) => (
              <tr
                key={i}
                className="
                  transition-all duration-200
                  hover:bg-indigo-50/30
                  hover:border-l-4 hover:border-indigo-500
                "
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {s.subject}
                </td>

                <td className="px-6 py-4">
                  <a
                    href={s.fileUrl}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <FileText className="w-4 h-4 text-red-500" />
                    {s.fileName}
                  </a>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {s.uploadedBy}
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {s.uploadDate}
                </td>

                <td className="px-6 py-4">
                  <a
                    href={s.fileUrl}
                    download
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden divide-y divide-gray-100">
        {data.map((s, i) => (
          <div
            key={i}
            className="
              p-4 bg-white border border-gray-100 rounded-xl
              transition-all duration-200
              hover:shadow-md
              hover:-translate-y-1
              hover:border-indigo-300
              active:scale-[0.98]
            "
          >
            {/* Top Section */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {s.subject}
                </p>

                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <FileText className="w-4 h-4 text-red-500" />
                  {s.fileName}
                </div>
              </div>

              <a
                href={s.fileUrl}
                download
                className="
                  inline-flex items-center gap-1.5
                  px-3 py-1.5 rounded-lg
                  bg-indigo-50 text-indigo-600
                  text-xs font-semibold
                  hover:bg-indigo-100
                "
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>

            {/* Bottom Info */}
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>By: {s.uploadedBy}</span>
              <span>{s.uploadDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};