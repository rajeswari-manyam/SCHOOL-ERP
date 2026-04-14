import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAssignHomework } from "../hooks/useTeacherDashboard";

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

interface Props { open: boolean; onClose: () => void; }

const AssignHomeworkModal = ({ open, onClose }: Props) => {
  const { mutate, isPending } = useAssignHomework();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (!open) return null;

  const onSubmit = (v: FormValues) => mutate(v, { onSuccess: () => { reset(); onClose(); } });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-extrabold text-gray-900">Assign Homework</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
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
        </div>
      </div>
    </>
  );
};

export default AssignHomeworkModal;
