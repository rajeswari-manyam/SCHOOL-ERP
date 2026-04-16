import { useExamStore } from "../store/ExamStore";

interface ExamCardProps {
  title: string;
  date: string;
  daysToGo: number;
}

export default function ExamCard({ title, date, daysToGo }: ExamCardProps) {
  const { checklist, toggleChecklistItem } = useExamStore();

  return (
    <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white shadow-sm p-6">
      <div className="rounded-[1.75rem] bg-indigo-600 p-6 text-white shadow-lg">
        <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
          Next Priority
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Next Test</p>
            <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-2xl">
            📅
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-200/90">{date}</p>
        <div className="mt-6 rounded-[1.5rem] bg-white/10 p-4">
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-200/75">
            Countdown
          </p>
          <p className="mt-2 text-3xl font-bold">{daysToGo} days to go</p>
          <button className="mt-4 inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
            Add to Calendar
          </button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Preparation Checklist
        </p>
        <div className="mt-4 space-y-3">
          {checklist.map((item) => (
            <label key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm transition hover:border-indigo-400">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleChecklistItem(item.id)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}