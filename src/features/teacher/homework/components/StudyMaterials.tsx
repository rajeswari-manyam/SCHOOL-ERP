import { useState, useRef, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Upload, Download, ExternalLink, Pencil, FileText, Presentation, Image, Link, File } from "lucide-react";
import type { StudyMaterial, UploadMaterialFormValues } from "../types/homework.types";
import { downloadStudyMaterial } from "@/services/studymaterial.api";
import { downloadBlob } from "@/features/school-admin/attendance/utils/attendance.utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { useUploadMaterialForm } from "../hooks/useUploadMaterialForm";
import toast from "react-hot-toast";

const FILE_TYPE_CONFIG = {
  PDF:   { Icon: File,         bg: "bg-red-50",    text: "text-red-600",    badgeBg: "bg-red-50",    badgeText: "text-red-600",    label: "PDF"  },
  DOC:   { Icon: FileText,     bg: "bg-blue-50",   text: "text-blue-600",   badgeBg: "bg-blue-50",   badgeText: "text-blue-600",   label: "DOC"  },
  PPT:   { Icon: Presentation, bg: "bg-orange-50", text: "text-orange-600", badgeBg: "bg-orange-50", badgeText: "text-orange-600", label: "PPT"  },
  IMAGE: { Icon: Image,        bg: "bg-purple-50", text: "text-purple-600", badgeBg: "bg-purple-50", badgeText: "text-purple-600", label: "IMG"  },
  LINK:  { Icon: Link,         bg: "bg-emerald-50",text: "text-emerald-600",badgeBg: "bg-emerald-50",badgeText: "text-emerald-600",label: "LINK" },
};

interface CardProps {
  material: StudyMaterial;
  onEdit: () => void;
  onDelete: () => void;
}

export const StudyMaterialCard = ({ material, onEdit, onDelete }: CardProps) => {
  const cfg = FILE_TYPE_CONFIG[material.fileType];
  const IconComp = cfg.Icon;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await downloadStudyMaterial(material.id);
      downloadBlob(blob, material.title || "study-material");
    } catch {
      toast.error("Failed to download file");
    } finally {
      setDownloading(false);
    }
  }, [material.id, material.title]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-[11px] transition-all duration-200 hover:shadow-[0_4px_18px_rgba(15,23,42,0.07)] hover:border-slate-300 hover:-translate-y-px">
      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className={`w-[42px] h-[42px] rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <IconComp size={20} className={cfg.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-slate-900 leading-tight mb-[3px]">{material.title}</p>
          <p className="text-[11px] text-slate-500">{material.subject} · {material.className}</p>
        </div>
        <div className="flex items-center gap-0.5 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            className="p-[6px] h-auto rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50"
            onClick={onEdit}
            title="Edit"
          >
            <Pencil size={13} className="text-current" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-[6px] h-auto rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 size={13} className="text-current" />
          </Button>
        </div>
      </div>

      {/* Description */}
      {material.description && (
        <p className="text-[11px] text-slate-500 leading-[1.55] line-clamp-2">{material.description}</p>
      )}

      {/* Footer meta */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <span className={`text-[10px] font-bold px-[7px] py-[2px] rounded-[6px] ${cfg.badgeBg} ${cfg.badgeText}`}>
            {cfg.label}
          </span>
          {material.size && <span className="text-[11px] text-slate-400">{material.size}</span>}
        </div>
        <span className="text-[11px] text-slate-400">{material.uploadedAt}</span>
      </div>

      {/* Action button */}
      {material.type === "LINK" ? (
        <a
          href={material.url ?? material.openLink ?? "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 h-[30px] rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          <ExternalLink size={12} className="text-current" /> Open link
        </a>
      ) : (
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex w-full items-center justify-center gap-2 h-[30px] rounded-xl border border-slate-200 bg-slate-50 text-[12px] font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={12} className={downloading ? "animate-bounce text-current" : "text-current"} />
          {downloading ? "Downloading…" : "Download"}
        </button>
      )}
    </div>
  );
};

// ── Upload Material Modal ─────────────────────────────────────────────────
const schema = z.object({
  classId:      z.string().min(1, "Class required"),
  sectionId:    z.string().min(1, "Section required"),
  subjectId:    z.string().min(1, "Subject required"),
  title:        z.string().min(3, "Title required"),
  materialType: z.enum(["FILE", "LINK"]),
  url:          z.string().optional(),
  description:  z.string().optional(),
}) satisfies z.ZodType<UploadMaterialFormValues>;
type FormValues = z.infer<typeof schema>;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onUpload?: (data: UploadMaterialFormValues) => void;
  editMaterial?: StudyMaterial | null;
  onUpdate?: (id: string, data: UploadMaterialFormValues) => void;
}

export const UploadMaterialModal = ({ open, onClose, onUpload, editMaterial, onUpdate }: ModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const isEdit = !!editMaterial;

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { materialType: "FILE" },
  });

  const selectedClassId   = useWatch({ control, name: "classId" });
  const selectedSectionId = useWatch({ control, name: "sectionId" });
  const materialType      = useWatch({ control, name: "materialType" });

  const { classes, sections, subjects, sectionsLoading, subjectsLoading } = useUploadMaterialForm({
    open,
    selectedClassId,
    selectedSectionId,
    onClassChange:   () => { setValue("sectionId", ""); setValue("subjectId", ""); },
    onSectionChange: () => { setValue("subjectId", ""); },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (!open) return;
    if (editMaterial) {
      reset({
        materialType: editMaterial.type,
        classId: editMaterial.class?.id ?? "",
        sectionId: editMaterial.section?.id ?? "",
        subjectId: editMaterial.subject?.id ?? "",
        title: editMaterial.title,
        url: editMaterial.openLink ?? "",
        description: editMaterial.description ?? "",
      });
      if (editMaterial.type === "FILE" && editMaterial.pdf) {
        setFileName(editMaterial.pdf.split("/").pop() ?? "file");
      }
    } else {
      reset({ materialType: "FILE" });
      setFileName(null);
    }
  }, [open, editMaterial]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    reset();
    setFileName(null);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    if (isEdit && editMaterial && onUpdate) {
      onUpdate(editMaterial.id, { ...values, file: fileRef.current?.files ?? undefined } as UploadMaterialFormValues);
    } else if (onUpload) {
      onUpload({ ...values, file: fileRef.current?.files ?? undefined } as UploadMaterialFormValues);
    }
    handleClose();
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) setFileName(file.name);
  };

  if (!open) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload study material"
      description={isEdit ? "Update the study material details" : "Share files or links with your students"}
      size="md"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
          <Button variant="outline" onClick={handleClose} className="rounded-[10px] h-9 text-[13px] font-semibold border-slate-200">Cancel</Button>
          <Button type="submit" form="upload-material-form" className="rounded-[10px] h-9 text-[13px] font-semibold bg-indigo-600 hover:bg-indigo-700 gap-1.5">
            {isEdit ? <Pencil size={14} className="text-current" /> : <Upload size={14} className="text-current" />}
            {isEdit ? "Update material" : "Upload material"}
          </Button>
        </div>
      }
    >
      <Form id="upload-material-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Academic details */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[.1em] mb-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-100">
            Academic details
          </div>
          <div className="grid grid-cols-3 gap-[10px]">
            <FormField label="Class *" error={errors.classId?.message as string | undefined}>
              <Select
                options={classes.map((c) => ({ label: c.class_name, value: c.id }))}
                placeholder="Select class"
                {...register("classId")}
              />
            </FormField>
            <FormField label="Section *" error={errors.sectionId?.message as string | undefined}>
              <Select
                options={sections.map((s) => ({ label: s.sectionName, value: s.id }))}
                placeholder={sectionsLoading ? "Loading…" : selectedClassId ? "Select section" : "Select class first"}
                disabled={!selectedClassId || sectionsLoading}
                {...register("sectionId")}
              />
            </FormField>
            <FormField label="Subject *" error={errors.subjectId?.message as string | undefined}>
              <Select
                options={subjects.map((s) => ({ label: s.subject_name, value: s.id }))}
                placeholder={subjectsLoading ? "Loading…" : selectedSectionId ? "Select subject" : "Select section first"}
                disabled={!selectedSectionId || subjectsLoading}
                {...register("subjectId")}
              />
            </FormField>
          </div>
        </div>

        {/* Material info */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[.1em] mb-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-100">
            Material information
          </div>
          <FormField label="Title *" error={errors.title?.message as string | undefined}>
            <Input {...register("title")} placeholder="e.g. Chapter 5 Full Notes" className="mb-[10px]" />
          </FormField>
          <FormField label="Description (optional)">
            <Textarea {...register("description")} rows={2} placeholder="Brief description of the material…" />
          </FormField>
        </div>

        {/* Upload type toggle */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[.1em] mb-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-100">
            Upload type
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(["FILE", "LINK"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue("materialType", type)}
                className={`flex items-center justify-center gap-2 px-[14px] py-[10px] rounded-xl border-[1.5px] text-[13px] font-semibold cursor-pointer transition-all ${
                  materialType === type
                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }`}
              >
                {type === "FILE" ? <><Paperclip size={17} /> File upload</> : <><Link size={17} /> External link</>}
              </button>
            ))}
          </div>

          {materialType === "FILE" ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-[7px] px-4 py-[22px] border-2 border-dashed rounded-xl cursor-pointer transition-all text-center ${
                fileName
                  ? "border-emerald-400 bg-emerald-50"
                  : dragOver
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50"
              }`}
            >
              <Upload size={26} className={fileName ? "text-emerald-500" : dragOver ? "text-indigo-500" : "text-slate-400"} strokeWidth={1.5} />
              {fileName ? (
                <p className="text-[13px] font-semibold text-emerald-700">{fileName}</p>
              ) : (
                <>
                  <p className="text-[13px] font-semibold text-slate-500">
                    Drop file here or <span className="text-indigo-600">browse</span>
                  </p>
                  <small className="text-[11px] text-slate-400">PDF, DOC, PPT, JPG, PNG · Max 20 MB</small>
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
          ) : (
            <FormField label="URL *">
              <Input {...register("url")} placeholder="https://youtube.com/watch?v=…" />
            </FormField>
          )}
        </div>
      </Form>
    </Modal>
  );
};

// Local helper — Paperclip icon not re-exported from lucide alias above
function Paperclip({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}