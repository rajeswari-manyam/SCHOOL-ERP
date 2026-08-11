import { useState, useRef, useEffect } from "react";
import { Send, UploadCloud, X, FileText, ImageIcon, BookOpen, CalendarDays, Paperclip } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { AssignHomeworkFormValues } from "../types/homework.types";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Modal, ModalActions } from "@/components/ui/modal";

import { getAllClasses, getSectionsByClassId } from "../../../../services/class.api";
import { getSubjectsBySectionId } from "../../../../services/subject.api";
import { getAllAcademicYears } from "../../../../services/academicYear.api";
import type { ClassRecord, SectionRecord } from "../../../../services/class.api";
import type { SubjectRecord } from "../../../../services/subject.api";
import type { AcademicYearRecord } from "../../../../services/academicYear.api";

const hasValue = (v: string | undefined | null): v is string => !!v;

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  class_id:        z.string().min(1, "Class required"),
  section_id:      z.string().min(1, "Section required"),
  subject_id:      z.string().min(1, "Subject required"),
  academicYearId:  z.string().min(1, "Academic year required"),
  title:           z.string().min(3, "Title must be at least 3 characters"),
  submission_date: z.string().min(1, "Due date required"),
  description:     z.string().min(10, "Please write a proper description"),
  is_published:    z.boolean(),
  submission_type: z.enum(["physical", "online", "both"]).optional(),
});
type FormValues = z.infer<typeof schema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AssignHomeworkFormValues) => void;
  initialValues?: Partial<AssignHomeworkFormValues>;
  mode?: "assign" | "edit";
  isSubmitting?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const CardSection = ({
  icon,
  iconBg,
  iconColor,
  title,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>
        <span className={`${iconColor} w-4 h-4`}>{icon}</span>
      </div>
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
        {title}
      </span>
    </div>
    {children}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const AssignHomeworkModal = ({
  open,
  onClose,
  onConfirm,
  initialValues,
  mode = "assign",
  isSubmitting,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver]             = useState(false);
  const [attachedFiles, setAttachedFiles]   = useState<File[]>([]);
  const initializingRef = useRef(false);

  const [academicYears,   setAcademicYears]   = useState<AcademicYearRecord[]>([]);
  const [classes,         setClasses]         = useState<ClassRecord[]>([]);
  const [sections,        setSections]        = useState<SectionRecord[]>([]);
  const [subjects,        setSubjects]        = useState<SubjectRecord[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      class_id:        initialValues?.class_id        ?? "",
      section_id:      initialValues?.section_id      ?? "",
      subject_id:      initialValues?.subject_id      ?? "",
      academicYearId:  initialValues?.academicYearId  ?? "",
      title:           initialValues?.title           ?? "",
      submission_date: initialValues?.submission_date ?? "",
      description:     initialValues?.description     ?? "",
      is_published:    initialValues?.is_published    ?? true,
      submission_type: initialValues?.submission_type,
    },
  });

  const selectedClassId   = useWatch({ control, name: "class_id" });
  const selectedSectionId = useWatch({ control, name: "section_id" });
  const isPublished       = useWatch({ control, name: "is_published" });

  // ─── Reset form & load data on open ─────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    initializingRef.current = true;
    reset({
      class_id:        initialValues?.class_id        ?? "",
      section_id:      initialValues?.section_id      ?? "",
      subject_id:      initialValues?.subject_id      ?? "",
      academicYearId:  initialValues?.academicYearId  ?? "",
      title:           initialValues?.title           ?? "",
      submission_date: initialValues?.submission_date ?? "",
      description:     initialValues?.description     ?? "",
      is_published:    initialValues?.is_published    ?? true,
      submission_type: initialValues?.submission_type,
    });
    getAllAcademicYears().then((res) => {
      setAcademicYears(res.data);
      const active = res.data.find((y) => y.active);
      if (active && !initialValues?.academicYearId) {
        setValue("academicYearId", active.id);
      }
    });
    getAllClasses().then((res) => setClasses(res.data));
  }, [open]);

  // ─── Clear initialising flag after cascades settle ──────────────────────

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => { initializingRef.current = false; }, 150);
    return () => clearTimeout(t);
  }, [open]);

  // ─── Cascade: class → sections ────────────────────────────────────────────

  useEffect(() => {
    if (!selectedClassId) {
      setSections([]);
      setValue("section_id", "");
      setValue("subject_id", "");
      setSubjects([]);
      return;
    }
    setSectionsLoading(true);
    getSectionsByClassId(selectedClassId)
      .then((res) => setSections(res.data))
      .finally(() => setSectionsLoading(false));
    // During initialisation (edit mode) keep the pre-set section/subject values
    if (!(initializingRef.current && hasValue(initialValues?.section_id))) {
      setValue("section_id", "");
      setValue("subject_id", "");
      setSubjects([]);
    }
  }, [selectedClassId]);

  // ─── Cascade: section → subjects ─────────────────────────────────────────

  useEffect(() => {
    if (!selectedSectionId) {
      setSubjects([]);
      setValue("subject_id", "");
      return;
    }
    setSubjectsLoading(true);
    getSubjectsBySectionId(selectedSectionId)
      .then((res) => setSubjects(res.data))
      .finally(() => setSubjectsLoading(false));
    // During initialisation (edit mode) keep the pre-set subject value
    if (!(initializingRef.current && hasValue(initialValues?.subject_id))) {
      setValue("subject_id", "");
    }
  }, [selectedSectionId]);

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleClose = () => {
    reset();
    setAttachedFiles([]);
    setSections([]);
    setSubjects([]);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    onConfirm({
      ...values,
      attachmentFile: attachedFiles.length > 0 ? attachedFiles : undefined,
      attachments: initialValues?.attachments ?? [],
    });
  };

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setAttachedFiles((prev) => [...prev, ...arr]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText size={12} />;
    if (["jpg", "jpeg", "png"].includes(ext ?? "")) return <ImageIcon size={12} />;
    return <Paperclip size={12} />;
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
<Modal
  open={open}
  onClose={handleClose}
  title={mode === "edit" ? "Edit homework" : "Assign homework"}
  description="Fill in the details below and publish for students"
  size="lg"
  className="sm:min-w-[580px] sm:max-w-xl overflow-hidden"
  
     
      footer={
        <ModalActions
          primary={
            <Button
              type="submit"
              form="assign-homework-form"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-[10px] text-[13px] font-semibold bg-indigo-600 hover:bg-indigo-700 gap-2"
            >
              <Send size={13} />
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Save Changes"
                : isPublished
                ? "Publish homework"
                : "Save as Draft"}
            </Button>
          }
          secondary={
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="h-9 rounded-[10px] text-[13px] font-semibold border-slate-200"
            >
              Cancel
            </Button>
          }
        />
      }
    >
<Form
  id="assign-homework-form"
  onSubmit={handleSubmit(onSubmit)}
  className="flex flex-col gap-3"
>
  {/* ── Close button ── */}
  <button
    type="button"
    onClick={handleClose}
    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors z-10"
    aria-label="Close"
  >
    <X size={15} />
  </button>
        {/* ── 1. Academic Information ── */}
        <CardSection
          icon={<CalendarDays size={15} />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-500"
          title="Academic information"
        >
          <div className="grid grid-cols-1 gap-3 mb-3">
            <FormField
              label="Academic year *"
              error={errors.academicYearId?.message}
            >
              <Select
                options={academicYears.map((y) => ({ label: y.yearName, value: y.id }))}
                placeholder="Select academic year"
                {...register("academicYearId")}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormField label="Class *" error={errors.class_id?.message}>
              <Select
                options={classes.map((c) => ({ label: c.class_name, value: c.id }))}
                placeholder="Select class"
                {...register("class_id")}
              />
            </FormField>
            <FormField label="Section *" error={errors.section_id?.message}>
              <Select
                options={sections.map((s) => ({ label: s.sectionName, value: s.id }))}
                placeholder={
                  sectionsLoading
                    ? "Loading…"
                    : selectedClassId
                    ? "Select section"
                    : "Select class first"
                }
                disabled={!selectedClassId || sectionsLoading}
                {...register("section_id")}
              />
            </FormField>
            <FormField label="Subject *" error={errors.subject_id?.message}>
              <Select
                options={subjects.map((s) => ({ label: s.subject_name, value: s.id }))}
                placeholder={
                  subjectsLoading
                    ? "Loading…"
                    : selectedSectionId
                    ? "Select subject"
                    : "Select section first"
                }
                disabled={!selectedSectionId || subjectsLoading}
                {...register("subject_id")}
              />
            </FormField>
          </div>
        </CardSection>

        {/* ── 2. Homework Details ── */}
        <CardSection
          icon={<BookOpen size={15} />}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
          title="Homework details"
        >
          <div className="flex flex-col gap-3">
            <FormField label="Title *" error={errors.title?.message}>
              <Input
                {...register("title")}
                placeholder="e.g. Chapter 5 – Exercise 5.2"
              />
            </FormField>
            <FormField label="Instructions *" error={errors.description?.message}>
              <Textarea
                {...register("description")}
                rows={3}
                placeholder="Describe what students need to do, page numbers, format required…"
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Homework type">
                <Select
                  options={[
                    { label: "Written assignment", value: "written" },
                    { label: "Project", value: "project" },
                    { label: "Reading", value: "reading" },
                    { label: "Practice", value: "practice" },
                  ]}
                  placeholder="Select type"
                />
              </FormField>
              <FormField label="Priority">
                <Select
                  options={[
                    { label: "Normal", value: "normal" },
                    { label: "High", value: "high" },
                    { label: "Low", value: "low" },
                  ]}
                  placeholder="Select priority"
                />
              </FormField>
            </div>
          </div>
        </CardSection>

        {/* ── 3. Assignment Settings ── */}
        <CardSection
          icon={<CalendarDays size={15} />}
          iconBg="bg-amber-50"
          iconColor="text-amber-500"
          title="Assignment settings"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Assigned date">
              <Input type="date" />
            </FormField>
            <FormField label="Due date *" error={errors.submission_date?.message}>
              <Input type="date" {...register("submission_date")} />
            </FormField>
            <FormField label="Submission type">
              <Select
                {...register("submission_type")}
                options={[
                  { label: "Physical", value: "physical" },
                  { label: "Online upload", value: "online" },
                  { label: "Both", value: "both" },
                ]}
                placeholder="Select type"
              />
            </FormField>
          </div>
        </CardSection>

        {/* ── 4. Attachments ── */}
        {/* Editing an existing homework can't attach files — the update endpoint
            doesn't accept them (confirmed: it 500s on a multipart request). Only
            show the upload UI when creating, so this section never looks like it
            saved something it silently didn't. */}
        {mode !== "edit" && (
        <CardSection
          icon={<Paperclip size={15} />}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
          title="Attachments"
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addFiles(e.dataTransfer.files);
            }}
            onClick={() => fileRef.current?.click()}
            className={[
              "flex flex-col items-center justify-center gap-2 px-4 py-6",
              "border-2 border-dashed rounded-xl cursor-pointer transition-all text-center",
              dragOver
                ? "border-indigo-400 bg-indigo-50"
                : "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50",
            ].join(" ")}
          >
            <div className={[
              "w-10 h-10 rounded-xl flex items-center justify-center",
              dragOver ? "bg-indigo-100" : "bg-slate-100",
            ].join(" ")}>
              <UploadCloud
                size={20}
                className={dragOver ? "text-indigo-500" : "text-slate-400"}
              />
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-600">
                Drop file here or{" "}
                <span className="text-indigo-600 font-semibold">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PDF, DOC, PPT, JPG · Max 10 MB
              </p>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {attachedFiles.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[11px] font-medium text-indigo-700"
                >
                  <span className="text-indigo-400">{fileIcon(f.name)}</span>
                  <span className="max-w-[120px] truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="ml-0.5 text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardSection>
        )}

        {/* ── 5. Publish toggle ── */}
        <div className="flex items-center justify-between gap-3 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
          <div>
            <p className="text-[13px] font-semibold text-slate-800">
              {isPublished ? "Publish immediately" : "Save as draft"}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isPublished
                ? "Visible to students and parents right away"
                : "Draft – students won't see it yet"}
            </p>
          </div>
          <Switch
            checked={isPublished}
            onCheckedChange={(checked) => setValue("is_published", checked)}
          />
        </div>

      </Form>
    </Modal>
  );
};

export default AssignHomeworkModal;