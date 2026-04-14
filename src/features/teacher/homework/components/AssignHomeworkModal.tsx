import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AssignHomeworkFormValues } from "../types/homework.types";

const schema = z.object({
  className:        z.string().min(1, "Class required"),
  section:          z.string().min(1, "Section required"),
  subject:          z.string().min(1, "Subject required"),
  title:            z.string().min(3, "Title must be at least 3 characters"),
  dueDate:          z.string().min(1, "Due date required"),
  description:      z.string().min(10, "Please write a proper description"),
  trackSubmissions: z.boolean(),
  notifyWhatsApp:   z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const inputClass  = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
const selectClass = `${inputClass} appearance-none cursor-pointer pr-8`;
const labelClass  = "block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AssignHomeworkFormValues) => void;
  initialValues?: Partial<AssignHomeworkFormValues>;
  mode?: "assign" | "edit";
}

// ── WA Preview Bubble ─────────────────────────────────────────────────────
const WAPreview = ({ title, subject, className, dueDate }: { title: string; subject: string; className: string; dueDate: string }) => (
  <div className="bg-[#e5ddd5] rounded-2xl p-4">
    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2.5 flex items-center gap-1.5">
      <span className="text-[#25d366] text-base">💬</span> WhatsApp Preview
    </div>
    <div className="flex justify-end">
      <div className="max-w-[260px] bg-[#dcf8c6] rounded-2xl rounded-br-sm px-4 py-3 shadow-sm">
        <p className="text-[11px] font-black text-[#075e54] mb-1">📚 New Homework Assigned</p>
        <p className="text-[12px] text-gray-800 font-semibold leading-snug">{title || "Homework Title"}</p>
        <p className="text-[11px] text-gray-500 mt-1">Subject: <span className="font-semibold">{subject || "—"}</span></p>
        <p className="text-[11px] text-gray-500">Class: <span className="font-semibold">{className || "—"}</span></p>
        <p className="text-[11px] text-gray-500">Due: <span className="font-semibold text-red-600">{dueDate || "—"}</span></p>
        <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">Please ensure your child completes and submits this homework on time. Contact the class teacher for any queries.</p>
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-gray-400">10:30 AM ✓✓</span>
        </div>
      </div>
    </div>
  </div>
);

const AssignHomeworkModal = ({ open, onClose, onConfirm, initialValues, mode = "assign" }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      className:        initialValues?.className ?? "Class 8-A",
      section:          initialValues?.section ?? "A",
      subject:          initialValues?.subject ?? "",
      title:            initialValues?.title ?? "",
      dueDate:          initialValues?.dueDate ?? "",
      description:      initialValues?.description ?? "",
      trackSubmissions: initialValues?.trackSubmissions ?? true,
      notifyWhatsApp:   initialValues?.notifyWhatsApp ?? true,
    },
  });

  const [title, subject, className, section, dueDate, notifyWA] = watch(["title", "subject", "className", "section", "dueDate", "notifyWhatsApp"]);

  if (!open) return null;

  const handleClose = () => { reset(); setFileName(null); onClose(); };

  const onSubmit = (v: FormValues) => {
    onConfirm({ ...v, attachment: fileRef.current?.files ?? undefined } as unknown as AssignHomeworkFormValues);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  const ChevronIcon = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
  );

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-auto" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">
                {mode === "edit" ? "Edit Homework" : "Assign Homework"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the details below and notify parents via WhatsApp</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-5 gap-5">

              {/* ── Left: Form fields (3 cols) ── */}
              <div className="lg:col-span-3 flex flex-col gap-4">

                {/* Class + Section + Subject */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Class *</label>
                    <div className="relative">
                      <select {...register("className")} className={selectClass}>
                        {["Class 7-A","Class 8-A","Class 8-B","Class 9-A","Class 9-B","Class 10-A"].map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronIcon />
                    </div>
                    {errors.className && <p className="text-xs text-red-500 mt-1">{errors.className.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Section *</label>
                    <div className="relative">
                      <select {...register("section")} className={selectClass}>
                        {["A","B","C","D"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronIcon />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Subject *</label>
                    <div className="relative">
                      <select {...register("subject")} className={selectClass}>
                        <option value="">Select…</option>
                        {["Mathematics","English","Science","Geography","History","Hindi","Social Studies"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronIcon />
                    </div>
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className={labelClass}>Homework Title *</label>
                  <input {...register("title")} placeholder="e.g. Chapter 5 – Exercise 5.2" className={inputClass} />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                </div>

                {/* Due Date */}
                <div>
                  <label className={labelClass}>Due Date *</label>
                  <input type="date" {...register("dueDate")} className={inputClass} />
                  {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className={labelClass}>Instructions / Description *</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="Describe what students need to do, page numbers, format required, etc."
                    className={`${inputClass} h-auto py-2.5 resize-none`}
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                </div>

                {/* File drag-drop */}
                <div>
                  <label className={labelClass}>Attachment (optional)</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-2 px-4 py-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dragOver ? "#6c63ff" : "#9ca3af"} strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {fileName ? (
                      <p className="text-xs font-semibold text-indigo-600">{fileName}</p>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-gray-500">Drop file here or <span className="text-indigo-600">browse</span></p>
                        <p className="text-[10px] text-gray-300">PDF, DOC, PPT, JPG, PNG · Max 10 MB</p>
                      </>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3">
                  {[
                    { field: "trackSubmissions" as const, label: "Track Submissions", desc: "Students can mark homework as submitted" },
                    { field: "notifyWhatsApp"   as const, label: "Notify via WhatsApp", desc: "Send WA message to all parents" },
                  ].map(({ field, label, desc }) => (
                    <label key={field} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" {...register(field)} className="sr-only" />
                      <div className={`relative w-10 h-5 rounded-full transition-colors ${watch(field) ? "bg-indigo-600" : "bg-gray-200"}`}>
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${watch(field) ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{label}</p>
                        <p className="text-[10px] text-gray-400">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Right: WA Preview (2 cols) ── */}
              <div className="lg:col-span-2">
                <p className={labelClass}>Preview</p>
                {notifyWA ? (
                  <WAPreview
                    title={title}
                    subject={subject}
                    className={`${className} – ${section}`}
                    dueDate={dueDate}
                  />
                ) : (
                  <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-52 border border-gray-100">
                    <span className="text-2xl opacity-30">💬</span>
                    <p className="text-xs text-gray-300 text-center">Enable WhatsApp notification to see preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
              <button type="button" onClick={handleClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {mode === "edit" ? "Save Changes" : notifyWA ? "Assign & Notify Parents" : "Assign Homework"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AssignHomeworkModal;
