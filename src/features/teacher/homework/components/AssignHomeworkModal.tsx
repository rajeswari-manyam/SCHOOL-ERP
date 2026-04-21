import { useState, useRef } from "react";
import { MessageCircle,  UploadCloud } from "lucide-react";
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

const classOptions = [
  "Class 7-A",
  "Class 8-A",
  "Class 8-B",
  "Class 9-A",
  "Class 9-B",
  "Class 10-A",
];
const sectionOptions = ["A", "B", "C", "D"];
const subjectOptions = [
  "Mathematics",
  "English",
  "Science",
  "Geography",
  "History",
  "Hindi",
  "Social Studies",
];


import WAPreview from "./WAPreview";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: AssignHomeworkFormValues) => void;
  initialValues?: Partial<AssignHomeworkFormValues>;
  mode?: "assign" | "edit";
}

const AssignHomeworkModal = ({
  open,
  onClose,
  onConfirm,
  initialValues,
  mode = "assign",
}: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<FileList | null>(null);

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

  const selectedClass = useWatch({ control, name: "className", defaultValue: initialValues?.className ?? "Class 8-A" });
  const selectedSubject = useWatch({ control, name: "subject", defaultValue: initialValues?.subject ?? "" });
  const selectedSection = useWatch({ control, name: "section", defaultValue: initialValues?.section ?? "A" });
  const title = useWatch({ control, name: "title", defaultValue: initialValues?.title ?? "" });
  const dueDate = useWatch({ control, name: "dueDate", defaultValue: initialValues?.dueDate ?? "" });
  const trackSubmissions = useWatch({ control, name: "trackSubmissions", defaultValue: initialValues?.trackSubmissions ?? true });
  const notifyWA = useWatch({ control, name: "notifyWhatsApp", defaultValue: initialValues?.notifyWhatsApp ?? true });

  const handleClose = () => {
    reset();
    setFileName(null);
    setAttachment(null);
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    onConfirm({ ...values, attachment: attachment ?? undefined } as unknown as AssignHomeworkFormValues);
  };

  const onSubmitForm = handleSubmit(onSubmit);

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const files = event.dataTransfer.files;
    if (files?.[0]) {
      setFileName(files[0].name);
      setAttachment(files);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={mode === "edit" ? "Edit Homework" : "Assign Homework"}
      description="Fill in the details below and notify parents via WhatsApp"
      size="lg"
      footer={
        <ModalActions
          primary={
            <Button type="submit" form="assign-homework-form">
              {mode === "edit" ? "Save Changes" : notifyWA ? "Assign & Notify Parents" : "Assign Homework"}
            </Button>
          }
          secondary={
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          }
        />
      }
    >
      <Form id="assign-homework-form" onSubmit={onSubmitForm}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Class *" error={errors.className?.message as string | undefined}>
                <Select
                  options={classOptions.map((value) => ({ label: value, value }))}
                  placeholder="Select class"
                  {...register("className")}
                />
              </FormField>

              <FormField label="Section *" error={errors.section?.message as string | undefined}>
                <Select
                  options={sectionOptions.map((value) => ({ label: value, value }))}
                  placeholder="Select section"
                  {...register("section")}
                />
              </FormField>

              <FormField label="Subject *" error={errors.subject?.message as string | undefined}>
                <Select
                  options={subjectOptions.map((value) => ({ label: value, value }))}
                  placeholder="Select subject"
                  {...register("subject")}
                />
              </FormField>
            </div>

            <FormField label="Homework Title *" error={errors.title?.message as string | undefined}>
              <Input {...register("title")} placeholder="e.g. Chapter 5 – Exercise 5.2" />
            </FormField>

            <FormField label="Due Date *" error={errors.dueDate?.message as string | undefined}>
              <Input type="date" {...register("dueDate")} />
            </FormField>

            <FormField label="Instructions / Description *" error={errors.description?.message as string | undefined}>
              <Textarea
                {...register("description")}
                rows={4}
                placeholder="Describe what students need to do, page numbers, format required, etc."
              />
            </FormField>

            <FormField label="Attachment (optional)">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  dragOver ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <UploadCloud width={20} height={20} stroke={dragOver ? "#4f46e5" : "#9ca3af"} strokeWidth={1.5} className="inline-block" />
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
                  onChange={(e) => {
                    const files = e.target.files;
                    setFileName(files?.[0]?.name ?? null);
                    setAttachment(files ?? null);
                  }}
                />
              </div>
            </FormField>

            <div className="grid gap-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch
                  checked={trackSubmissions}
                  onCheckedChange={(checked) => {
                    setValue("trackSubmissions", checked);
                  }}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Track Submissions</p>
                  <p className="text-[10px] text-gray-400">Students can mark homework as submitted</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Switch
                  checked={notifyWA}
                  onCheckedChange={(checked) => {
                    setValue("notifyWhatsApp", checked);
                  }}
                />
                <div>
                  <p className="text-xs font-semibold text-gray-800">Notify via WhatsApp</p>
                  <p className="text-[10px] text-gray-400">Send WA message to all parents</p>
                </div>
              </label>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Label className="text-[11px] tracking-widest uppercase text-gray-400">Preview</Label>
            {notifyWA ? (
              <WAPreview
                title={title}
                subject={selectedSubject}
                className={`${selectedClass} – ${selectedSection}`}
                dueDate={dueDate}
              />
            ) : (
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-52 border border-gray-100">
                <MessageCircle className="text-2xl opacity-30 w-6 h-6" />
                <p className="text-xs text-gray-300 text-center">Enable WhatsApp notification to see preview</p>
              </div>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AssignHomeworkModal;
