// components/SyllabusTable.tsx
import { FileText, Download } from "lucide-react"; // ← ADD Download here
import type { Syllabus } from "../types/exams.types";

export const SyllabusTable = ({ data }: { data: Syllabus[] }) => {
  return (
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
          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
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
  );
};