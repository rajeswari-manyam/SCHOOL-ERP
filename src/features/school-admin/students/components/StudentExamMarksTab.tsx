import { useState, useEffect } from "react";
import { Loader2, BookOpen } from "lucide-react";
import { getMarksByStudentId, type Mark } from "@/services/marks.api";

interface Props {
  studentId: string;
  studentName: string;
}

const MarksTable = ({ marks }: { marks: Mark[] }) => {
  const examGroups: Record<string, Mark[]> = {};
  for (const m of marks) {
    const key = m.exam_name || m.exam_id;
    if (!examGroups[key]) examGroups[key] = [];
    examGroups[key].push(m);
  }

  return (
    <div className="space-y-6">
      {Object.entries(examGroups).map(([examName, subjects]) => (
        <div key={examName} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h4 className="text-sm font-bold text-gray-800">{examName}</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-gray-400">Subject</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400">Max Marks</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400">Marks Obtained</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400">Grade</th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subjects.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800">{m.subject_name || m.subject_id}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{m.max_marks}</td>
                    <td className="px-4 py-3 text-center">
                      {m.is_absent ? (
                        <span className="text-red-500 font-semibold">Absent</span>
                      ) : (
                        <span className="font-semibold text-gray-800">{m.marks_obtained}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                        m.grade?.startsWith("A") ? "bg-green-100 text-green-700" :
                        m.grade?.startsWith("B") ? "bg-blue-100 text-blue-700" :
                        m.grade?.startsWith("C") ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {m.grade || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {m.is_absent ? (
                        <span className="text-xs text-red-500 font-semibold">Absent</span>
                      ) : (
                        <span className={`text-xs font-semibold ${m.marks_obtained >= m.max_marks * 0.35 ? "text-green-600" : "text-red-500"}`}>
                          {m.marks_obtained >= m.max_marks * 0.35 ? "Pass" : "Fail"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

const StudentExamMarksTab: React.FC<Props> = ({ studentId, studentName }) => {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    setError(null);
    getMarksByStudentId(studentId)
      .then((res) => {
        if (res.status && Array.isArray(res.data)) {
          setMarks(res.data);
        } else {
          setMarks([]);
        }
      })
      .catch((err) => {
        // Backend returns 404 (not an empty array) when no marks exist yet for this student.
        if (err?.response?.status !== 404) {
          setError(err instanceof Error ? err.message : "Failed to load marks");
        }
        setMarks([]);
      })
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-52 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-52 bg-white rounded-2xl border border-red-100 shadow-sm gap-2">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (marks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-52 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm gap-3">
        <BookOpen size={32} className="text-gray-300" />
        <p className="text-sm text-gray-400">Marks have not been assigned for {studentName} yet.</p>
      </div>
    );
  }

  return <MarksTable marks={marks} />;
};

export default StudentExamMarksTab;
