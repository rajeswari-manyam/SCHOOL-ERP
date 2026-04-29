import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Upload } from "lucide-react";
import type { StudyMaterial, UploadMaterialFormValues } from "../types/homework.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
  

const FILE_TYPE_CONFIG = {
  PDF:   { icon: "📄", bg: "bg-red-50",    text: "text-red-600",    label: "PDF"  },
  DOC:   { icon: "📝", bg: "bg-blue-50",   text: "text-blue-600",   label: "DOC"  },
  PPT:   { icon: "📊", bg: "bg-orange-50", text: "text-orange-600", label: "PPT"  },
  IMAGE: { icon: "🖼️",  bg: "bg-purple-50", text: "text-purple-600", label: "IMG"  },
  LINK:  { icon: "🔗", bg: "bg-teal-50",   text: "text-teal-600",   label: "LINK" },
};

interface CardProps {
  material: StudyMaterial;
  onDelete: () => void;
}

export const StudyMaterialCard = ({ material, onDelete }: CardProps) => {
  const cfg = FILE_TYPE_CONFIG[material.fileType];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center text-xl flex-shrink-0`}>
            {cfg.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-gray-900 leading-tight truncate">{material.title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{material.subject} · {material.className}</p>
          </div>
          <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-red-500" onClick={onDelete}>
            <Trash2 size={13} className="text-current" />
          </Button>
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
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-50"
        >
          {material.type === "LINK" ? "Open Link" : "Download"}
        </a>
      </CardContent>
    </Card>
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

  const handleClose = () => {
    reset();
    setFileName(null);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    onUpload({ ...values, file: fileRef.current?.files ?? undefined } as UploadMaterialFormValues);
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
      title="Upload Study Material"
      description="Share files or links with your students"
      size="md"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="upload-material-form">Upload Material</Button>
        </div>
      }
    >
      <Form id="upload-material-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-3">
          <FormField label="Class">
            <Select
              options={["Class 7-A", "Class 8-A", "Class 9-A", "Class 10-A"].map((value) => ({ label: value, value }))}
              placeholder="Select class"
              {...register("className")}
            />
          </FormField>
          <FormField label="Section">
            <Select
              options={["A", "B", "C"].map((value) => ({ label: value, value }))}
              placeholder="Select section"
              {...register("section")}
            />
          </FormField>
          <FormField label="Subject *" error={errors.subject?.message as string | undefined}>
            <Select
              options={["Mathematics", "English", "Science", "Geography", "Hindi", "History"].map((value) => ({ label: value, value }))}
              placeholder="Select subject"
              {...register("subject")}
            />
          </FormField>
        </div>

        <FormField label="Title *" error={errors.title?.message as string | undefined}>
          <Input {...register("title")} placeholder="e.g. Chapter 5 Full Notes" />
        </FormField>

        <FormField label="Type">
          <div className="grid grid-cols-2 gap-2">
            {(["FILE", "LINK"] as const).map((type) => (
              <Button
                key={type}
                type="button"
                variant={materialType === type ? "default" : "outline"}
                className="justify-center gap-2"
                onClick={() => register("materialType").onChange({ target: { value: type } } as any)}
              >
                {type === "FILE" ? "📎 File" : "🔗 Link"}
              </Button>
            ))}
          </div>
        </FormField>

        {materialType === "FILE" ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
            }`}
          >
            <Upload size={22} className={dragOver ? "text-indigo-600" : "text-gray-300"} strokeWidth={1.5} />
            {fileName ? (
              <p className="text-xs font-semibold text-indigo-600">{fileName}</p>
            ) : (
              <>
                <p className="text-xs font-semibold text-gray-500">Drop file here or <span className="text-indigo-600">browse</span></p>
                <p className="text-[10px] text-gray-300">PDF, DOC, PPT, JPG, PNG · Max 20 MB</p>
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

        <FormField label="Description (optional)">
          <Textarea {...register("description")} rows={2} placeholder="Brief description of the material…" />
        </FormField>
      </Form>
    </Modal>
  );
};
