import type { SyllabusFile, UnitTestSyllabus } from "../types/Exam.types";
import { getTagColor, getTagTextColor } from "../utils/Exam.utils";

interface SyllabusProps {
  files: SyllabusFile[];
  unitTest: UnitTestSyllabus[];
}

export default function Syllabus({ files, unitTest }: SyllabusProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">
              Syllabus — Academic Year 2024-25
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Uploaded by subject teachers
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Filter
            </button>
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
              Download All
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.24em] text-slate-400">
              <tr>
                <th className="px-4 py-4">Subject</th>
                <th className="px-4 py-4">Syllabus File</th>
                <th className="px-4 py-4">Uploaded By</th>
                <th className="px-4 py-4">Upload Date</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {files.map((f) => (
                <tr key={f.subject} className="hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900">{f.subject}</td>
                  <td className="px-4 py-4 text-slate-600">
                    <div className="inline-flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        📄
                      </span>
                      <a href="#" className="font-medium text-slate-900 hover:text-indigo-600">
                        {f.fileName}
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{f.uploadedBy}</td>
                  <td className="px-4 py-4 text-slate-600">{f.uploadDate}</td>
                  <td className="px-4 py-4">
                    <button className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {unitTest.map((u) => (
          <div key={u.subject} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <strong className="text-base text-slate-950">{u.subject}</strong>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
                style={{ backgroundColor: getTagColor(u.tag), color: getTagTextColor(u.tag) }}
              >
                {u.tag}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{u.chapters}</p>
          </div>
        ))}

        <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-100">
            Study Guide
          </p>
          <h3 className="mt-4 text-xl font-semibold">Prepare with previous year papers?</h3>
          <p className="mt-3 text-sm text-indigo-100/90">
            Review archived question papers to improve speed and accuracy before the exam.
          </p>
          <button className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-slate-100">
            Browse Archive
          </button>
        </div>
      </div>
    </div>
  );
}