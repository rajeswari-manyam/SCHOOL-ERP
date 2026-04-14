import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { StudyMaterial, UploadMaterialFormValues } from "../types/homework.types";

// ── File type icon + colour ───────────────────────────────────────────────
const FILE_TYPE_CONFIG = {
  PDF:   { icon: "📄", bg: "bg-red-50",    text: "text-red-600",    label: "PDF"  },
  DOC:   { icon: "📝", bg: "bg-blue-50",   text: "text-blue-600",   label: "DOC"  },
  PPT:   { icon: "📊", bg: "bg-orange-50", text: "text-orange-600", label: "PPT"  },
  IMAGE: { icon: "🖼️",  bg: "bg-purple-50", text: "text-purple-600", label: "IMG"  },
  LINK:  { icon: "🔗", bg: "bg-teal-50",   text: "text-teal-600",   label: "LINK" },
};

// ── Study Material Card ───────────────────────────────────────────────────
interface CardProps {
  material: StudyMaterial;
  onDelete: () => void;
}

export const StudyMaterialCard = ({ material, onDelete }: CardProps) => {
  const cfg = FILE_TYPE_CONFIG[material.fileType];
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center text-xl flex-shrink-0`}>
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-900 leading-tight truncate">{material.title}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {material.subject} · {material.className}
          </p>
        </div>
        <button
          onClick={onDelete}
          title="Delete material"
          className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
        </button>
      </div>

      {material.description && (
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{material.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
          {material.size && <span className="text-[10px] text-gray-300">{material.size}</span>}
        </div>
        <span className="text-[10px] text-gray-300">{material.uploadedAt}</span>
      </div>

      <a
        href={material.url ?? "#"}
        target="_blank"
        rel="noreferrer"
        className={`flex items-center justify-center gap-1.5 h-8 rounded-xl border text-xs font-semibold transition-colors ${cfg.bg} ${cfg.text} border-current/20 hover:opacity-80`}
      >
        {material.type === "LINK" ? "Open Link" : "Download"}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          {material.type === "LINK"
            ? <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>
            : <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>
          }
        </svg>
      </a>
    </div>
  );
};

// ── Upload Material Modal ─────────────────────────────────────────────────
const schema = z.object({
  className:    z.string().min(1),
  section:      z.string().min(1),
  subject:      z.string().min(1, "Subject required"),
  title:        z.string().min(3, "Title required"),
  materialType: z.enum(["FILE", "LINK"]),
  url:          z.string().optional(),
  description:  z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const inputClass  = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
const selectClass = `${inputClass} appearance-none cursor-pointer pr-8`;
const labelClass  = "block text-[11px] font-bold tracking-widest uppercase text-gray-400 mb-1.5";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: UploadMaterialFormValues) => void;
}

export const UploadMaterialModal = ({ open, onClose, onUpload }: ModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { className: "Class 8-A", section: "A", materialType: "FILE" },
  });

  const materialType = watch("materialType");

  if (!open) return null;

  const handleClose = () => { reset(); setFileName(null); onClose(); };
  const onSubmit = (v: FormValues) => {
    onUpload({ ...v, file: fileRef.current?.files ?? undefined } as UploadMaterialFormValues);
    handleClose();
  };

  const ChevronIcon = () => (
    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
  );

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>

          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Upload Study Material</h2>
              <p className="text-xs text-gray-400 mt-0.5">Share files or links with your students</p>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 flex flex-col gap-4">
            {/* Class / Section / Subject */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Class</label>
                <div className="relative">
                  <select {...register("className")} className={selectClass}>
                    {["Class 7-A","Class 8-A","Class 9-A","Class 10-A"].map((c) => <option key={c}>{c}</option>)}
                  </select><ChevronIcon />
                </div>
              </div>
              <div>
                <label className={labelClass}>Section</label>
                <div className="relative">
                  <select {...register("section")} className={selectClass}>
                    {["A","B","C"].map((s) => <option key={s}>{s}</option>)}
                  </select><ChevronIcon />
                </div>
              </div>
              <div>
                <label className={labelClass}>Subject *</label>
                <div className="relative">
                  <select {...register("subject")} className={selectClass}>
                    <option value="">—</option>
                    {["Mathematics","English","Science","Geography","Hindi","History"].map((s) => <option key={s}>{s}</option>)}
                  </select><ChevronIcon />
                </div>
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className={labelClass}>Title *</label>
              <input {...register("title")} placeholder="e.g. Chapter 5 Full Notes" className={inputClass} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Type toggle */}
            <div>
              <label className={labelClass}>Type</label>
              <div className="flex gap-2">
                {(["FILE", "LINK"] as const).map((t) => (
                  <label key={t} className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl border-2 cursor-pointer text-sm font-semibold transition-all ${
                    materialType === t
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}>
                    <input type="radio" {...register("materialType")} value={t} className="sr-only" />
                    {t === "FILE" ? "📎 File" : "🔗 Link"}
                  </label>
                ))}
              </div>
            </div>

            {/* File drag-drop or URL */}
            {materialType === "FILE" ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault(); setDragOver(false);
                  const f = e.dataTransfer.files?.[0]; if (f) setFileName(f.name);
                }}
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={dragOver ? "#6c63ff" : "#d1d5db"} strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {fileName
                  ? <p className="text-xs font-semibold text-indigo-600">{fileName}</p>
                  : <><p className="text-xs font-semibold text-gray-500">Drop file here or <span className="text-indigo-600">browse</span></p>
                      <p className="text-[10px] text-gray-300">PDF, DOC, PPT, JPG, PNG · Max 20 MB</p></>
                }
                <input ref={fileRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
              </div>
            ) : (
              <div>
                <label className={labelClass}>URL *</label>
                <input {...register("url")} placeholder="https://youtube.com/watch?v=…" className={inputClass} />
              </div>
            )}

            {/* Description */}
            <div>
              <label className={labelClass}>Description (optional)</label>
              <textarea {...register("description")} rows={2} placeholder="Brief description of the material…"
                className={`${inputClass} h-auto py-2.5 resize-none`} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={handleClose} className="text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">Cancel</button>
              <button type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                Upload Material
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
