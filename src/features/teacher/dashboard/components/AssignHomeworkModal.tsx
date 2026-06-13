import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, RefreshCw, AlertCircle, BookOpen } from "lucide-react";
import { useAssignHomework, useAllHomeworkList } from "../hooks/useTeacherDashboard";

const schema = z.object({
  classId:     z.string().min(1, "Class required"),
  subject:     z.string().min(1, "Subject required"),
  title:       z.string().min(3, "Title required"),
  description: z.string().min(5, "Description required"),
  dueDate:     z.string().min(1, "Due date required"),
});
type FormValues = z.infer<typeof schema>;

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";
const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

interface Props { open: boolean; onClose: () => void; teacherId: string; }

const SkeletonRow = () => (
  <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
    <div className="h-3 flex-1 rounded bg-gray-200" />
    <div className="h-3 w-16 rounded bg-gray-200" />
    <div className="h-3 w-20 rounded bg-gray-200" />
    <div className="h-3 w-24 rounded bg-gray-200" />
  </div>
);

const AssignHomeworkModal = ({ open, onClose, teacherId }: Props) => {
  const { mutate, isPending } = useAssignHomework(teacherId);
  const { data: homeworkList, isLoading, isError, refetch } = useAllHomeworkList(teacherId, { enabled: open });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!open) return null;

  const onSubmit = (v: FormValues) => mutate(v, { onSuccess: () => { reset(); } });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* ── Header ─────────────────────────────────────────── */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Assign Homework</h2>
              {homeworkList && homeworkList.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">{homeworkList.length} homework items assigned</p>
              )}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <X size={18} className="text-current" />
            </button>
          </div>

          <div className="overflow-y-auto px-6 py-5 space-y-6">
            {/* ── Assign Form ────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelClass}>Class *</label>
                  <input {...register("classId")} placeholder="Class 8-A" className={inputClass} />
                  {errors.classId && <p className="text-xs text-red-500 mt-1">{errors.classId.message}</p>}</div>
                <div><label className={labelClass}>Subject *</label>
                  <input {...register("subject")} placeholder="Mathematics" className={inputClass} />
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}</div>
              </div>
              <div><label className={labelClass}>Title *</label>
                <input {...register("title")} placeholder="Chapter 5 – Exercise 5.2" className={inputClass} />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}</div>
              <div><label className={labelClass}>Description *</label>
                <textarea {...register("description")} rows={3} placeholder="Complete all problems from page 87" className={`${inputClass} h-auto py-2.5 resize-none`} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}</div>
              <div><label className={labelClass}>Due Date *</label>
                <input type="date" {...register("dueDate")} className={inputClass} />
                {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>}</div>
              <div className="flex items-center justify-between pt-2">
                <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
                <button type="submit" disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm">
                  {isPending ? "Assigning…" : "Assign Homework"}
                </button>
              </div>
            </form>

            {/* ── Assigned Homework List ──────────────────────────── */}
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Recently Assigned</h3>

              {/* Loading skeleton */}
              {isLoading && (
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-50">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
              )}

              {/* Error state */}
              {isError && (
                <div className="border border-red-100 rounded-xl bg-red-50/50 px-4 py-5 text-center">
                  <AlertCircle size={28} className="mx-auto text-red-300 mb-2" />
                  <p className="text-sm font-semibold text-red-600 mb-1">Failed to load homework list</p>
                  <p className="text-xs text-red-400 mb-3">Check your connection and try again</p>
                  <button onClick={() => refetch()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors">
                    <RefreshCw size={14} /> Retry
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !isError && homeworkList && homeworkList.length === 0 && (
                <div className="border border-dashed border-gray-200 rounded-xl px-4 py-6 text-center">
                  <BookOpen size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-semibold text-gray-500">No homework assigned yet</p>
                  <p className="text-xs text-gray-400 mt-1">Use the form above to assign homework to your classes</p>
                </div>
              )}

              {/* List */}
              {!isLoading && !isError && homeworkList && homeworkList.length > 0 && (
                <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 max-h-64 overflow-y-auto">
                  {homeworkList.map((hw) => (
                    <div key={hw.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-800 truncate">{hw.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {hw.class} &middot; {hw.subject}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs font-semibold text-gray-600">{hw.submittedCount}/{hw.totalCount}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{hw.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignHomeworkModal;
