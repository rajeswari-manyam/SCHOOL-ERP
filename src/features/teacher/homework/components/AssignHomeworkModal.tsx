import { useState, useRef } from "react";
import { MessageCircle, UploadCloud } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Modal, ModalActions } from "@/components/ui/modal";

import WAPreview from "./WAPreview";

const schema = z.object({
  className:        z.string().min(1, "Class required"),
  sectionName:      z.string().min(1, "Section required"),
  subjectName:      z.string().min(1, "Subject required"),
  title:            z.string().min(3, "Title must be at least 3 characters"),
  submission_date:  z.string().min(1, "Due date required"),
  description:      z.string().min(10, "Please write a proper description"),
  is_published:     z.boolean(),
});
type FormValues = z.infer<typeof schema>;

const classOptions   = ["7", "8", "9", "10", "11", "12"];
const sectionOptions = ["A", "B", "C", "D"];
const subjectOptions = ["Mathematics", "English", "Science", "Geography", "History", "Hindi", "Social Studies"];

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AssignHomeworkFormValues) => void;
  initialValues?: Partial<AssignHomeworkFormValues>;
  mode?: "assign" | "edit";
  isSubmitting?: boolean;
}

const AssignHomeworkModal = ({
  open,
  onClose,
  onConfirm,
  initialValues,
  mode = "assign",
  isSubmitting,
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver]     = useState(false);
  const [fileName, setFileName]     = useState<string | null>(null);
  const [attachmentFile, setAttachmentFile] = useState<FileList | null>(null);

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
      className:        initialValues?.className        ?? "Class 10-A",
      sectionName:      initialValues?.sectionName      ?? "B",
      subjectName:      initialValues?.subjectName      ?? "",
      title:            initialValues?.title            ?? "",
      submission_date:  initialValues?.submission_date  ?? "",
      description:      initialValues?.description      ?? "",
      is_published:     initialValues?.is_published     ?? true,
    },
  });

  const selectedClass   = useWatch({ control, name: "className",       defaultValue: initialValues?.className      ?? "Class 10-A" });
  const selectedSubject = useWatch({ control, name: "subjectName",     defaultValue: initialValues?.subjectName    ?? "" });
  const selectedSection = useWatch({ control, name: "sectionName",     defaultValue: initialValues?.sectionName    ?? "B" });
  const title           = useWatch({ control, name: "title",           defaultValue: initialValues?.title          ?? "" });
  const dueDate         = useWatch({ control, name: "submission_date", defaultValue: initialValues?.submission_date ?? "" });
  const isPublished     = useWatch({ control, name: "is_published",    defaultValue: initialValues?.is_published   ?? true });

  const handleClose = () => {
    reset();
    setFileName(null);
    setAttachmentFile(null);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    onConfirm({
      ...values,
      attachmentFile: attachmentFile ?? undefined,
      attachments: initialValues?.attachments ?? [],
    });
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files?.[0]) {
      setFileName(files[0].name);
      setAttachmentFile(files);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "edit" ? "Edit Homework" : "Assign Homework"}
      description="Fill in the details below and publish for students"
      size="lg"
      className="sm:min-w-[680px] sm:max-w-3xl"
      footer={
        <ModalActions
          primary={
            <Button
              type="submit"
              form="assign-homework-form"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "edit"
                ? "Save Changes"
                : isPublished
                ? "Publish Homework"
                : "Save as Draft"
              }
            </Button>
          }
          secondary={
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          }
        />
      }
    >
      <Form id="assign-homework-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

          <div className="md:col-span-3 flex flex-col gap-4">

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FormField label="Class *" error={errors.className?.message as string | undefined}>
                <Select
                  options={classOptions.map((v) => ({ label: v, value: v }))}
                  placeholder="Select class"
                  className="h-11 sm:h-9"
                  {...register("className")}
                />
              </FormField>

              <FormField label="Section *" error={errors.sectionName?.message as string | undefined}>
                <Select
                  options={sectionOptions.map((v) => ({ label: v, value: v }))}
                  placeholder="Select section"
                  className="h-11 sm:h-9"
                  {...register("sectionName")}
                />
              </FormField>

              <FormField label="Subject *" error={errors.subjectName?.message as string | undefined}>
                <Select
                  options={subjectOptions.map((v) => ({ label: v, value: v }))}
                  placeholder="Select subject"
                  className="h-11 sm:h-9"
                  {...register("subjectName")}
                />
              </FormField>
            </div>

            <FormField label="Homework Title *" error={errors.title?.message as string | undefined}>
              <Input
                {...register("title")}
                placeholder="e.g. Chapter 5 – Exercise 5.2"
                className="h-11 sm:h-9"
              />
            </FormField>

            <FormField label="Due Date *" error={errors.submission_date?.message as string | undefined}>
              <Input
                type="date"
                {...register("submission_date")}
                className="h-11 sm:h-9"
              />
            </FormField>

            <FormField
              label="Instructions / Description *"
              error={errors.description?.message as string | undefined}
            >
              <Textarea
                {...register("description")}
                rows={4}
                placeholder="Describe what students need to do, page numbers, format required, etc."
              />
            </FormField>

            <FormField label="Attachment (optional)">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileRef.current?.click()}
                className={[
                  "flex flex-col items-center justify-center gap-2 px-4 py-5",
                  "border-2 border-dashed rounded-xl cursor-pointer transition-all",
                  "min-h-[72px] sm:min-h-0",
                  dragOver
                    ? "border-indigo-400 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50",
                ].join(" ")}
              >
                <UploadCloud
                  width={20}
                  height={20}
                  stroke={dragOver ? "#4f46e5" : "#9ca3af"}
                  strokeWidth={1.5}
                />
                {fileName ? (
                  <p className="text-xs font-semibold text-indigo-600 text-center break-all">
                    {fileName}
                  </p>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-gray-500 text-center">
                      Drop file here or{" "}
                      <span className="text-indigo-600">browse</span>
                    </p>
                    <p className="text-[10px] text-gray-300 text-center">
                      PDF, DOC, PPT, JPG, PNG · Max 10 MB
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.png"
                  onChange={(e) => {
                    const files = e.target.files;
                    setFileName(files?.[0]?.name ?? null);
                    setAttachmentFile(files ?? null);
                  }}
                />
              </div>
            </FormField>

            <div className="grid gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch
                  checked={isPublished}
                  onCheckedChange={(checked) => setValue("is_published", checked)}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Publish immediately</p>
                  <p className="text-[10px] text-gray-400">
                    {isPublished
                      ? "Homework will be visible to students right away"
                      : "Save as draft — students won't see it"
                    }
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label className="text-[11px] tracking-widest uppercase text-gray-400">
              Preview
            </Label>

            {isPublished ? (
              <WAPreview
                title={title}
                subject={selectedSubject}
                className={`${selectedClass} – ${selectedSection}`}
                dueDate={dueDate}
              />
            ) : (
              <div className="hidden md:flex bg-gray-50 rounded-2xl p-4 flex-col items-center justify-center gap-2 h-52 border border-gray-100">
                <MessageCircle className="text-2xl opacity-30 w-6 h-6" />
                <p className="text-xs text-gray-300 text-center">
                  Publish to see preview
                </p>
              </div>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AssignHomeworkModal;
