import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApplyLeave, useUploadMaterial } from "../hooks/useTeacherDashboard";

// ── Apply Leave Modal ──────────────────────────────────────
const leaveSchema = z.object({
  fromDate: z.string().min(1),
  toDate:   z.string().min(1),
  type:     z.enum(["SICK", "CASUAL", "EARNED", "OTHER"]),
  reason:   z.string().min(5, "Please provide a reason"),
});
type LeaveValues = z.infer<typeof leaveSchema>;

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";
const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

interface ModalProps { open: boolean; onClose: () => void; }

export const ApplyLeaveModal = ({ open, onClose }: ModalProps) => {
  const { mutate, isPending } = useApplyLeave();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LeaveValues>({ resolver: zodResolver(leaveSchema), defaultValues: { type: "CASUAL" } });

  if (!open) return null;
  const onSubmit = (v: LeaveValues) => mutate(v, { onSuccess: () => { reset(); onClose(); } });

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-extrabold text-gray-900">Apply Leave</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={labelClass}>From Date *</label>
                <input type="date" {...register("fromDate")} className={inputClass} /></div>
              <div><label className={labelClass}>To Date *</label>
                <input type="date" {...register("toDate")} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Leave Type *</label>
              <div className="relative">
                <select {...register("type")} className={`${inputClass} appearance-none pr-8 cursor-pointer`}>
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="EARNED">Earned Leave</option>
                  <option value="OTHER">Other</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            </div>
            <div><label className={labelClass}>Reason *</label>
              <textarea {...register("reason")} rows={3} placeholder="Brief reason for leave" className={`${inputClass} h-auto py-2.5 resize-none`} />
              {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason.message}</p>}</div>
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
              <button type="submit" disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:opacity-60 transition-colors shadow-sm">
                {isPending ? "Submitting…" : "Apply Leave"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// ── Upload Material Modal ──────────────────────────────────
export const UploadMaterialModal = ({ open, onClose }: ModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadMaterial();

  if (!open) return null;

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("class", "Class 8-A");
    mutate(fd, { onSuccess: onClose });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-extrabold text-gray-900">Upload Material</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="px-6 py-5 space-y-4">
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition cursor-pointer" />
            <p className="text-xs text-gray-400">Supported: PDF, DOC, PPT, JPG, PNG</p>
            <div className="flex items-center justify-between pt-1">
              <button onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
              <button onClick={handleUpload} disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 disabled:opacity-60 transition-colors shadow-sm">
                {isPending ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
