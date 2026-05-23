const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-indigo-50 text-indigo-700 border-indigo-200",
  English:     "bg-blue-50 text-blue-700 border-blue-200",
  Science:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  Geography:   "bg-amber-50 text-amber-700 border-amber-200",
  History:     "bg-orange-50 text-orange-700 border-orange-200",
  Hindi:       "bg-rose-50 text-rose-700 border-rose-200",
};

interface SubjectPillProps {
  subject: string;
}

const SubjectPill = ({ subject }: SubjectPillProps) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${SUBJECT_COLORS[subject] ?? "bg-purple-50 text-purple-700 border-purple-200"}`}>
    {subject}
  </span>
);

export default SubjectPill;
