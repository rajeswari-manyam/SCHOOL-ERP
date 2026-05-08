import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ── Utility ──────────────────────────────────────────────────────────────────
const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

// ── Zod Schema ───────────────────────────────────────────────────────────────
const ACCEPTED_MIME_TYPES: string[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const submitHomeworkSchema = z
  .object({
    submitAs: z.enum(["upload", "text"]),
    file: z
      .instanceof(File)
      .refine((f) => ACCEPTED_MIME_TYPES.includes(f.type), {
        message: "Only PDF, DOC, JPG or PNG files are accepted.",
      })
      .refine((f) => f.size <= MAX_FILE_SIZE, {
        message: "File size must not exceed 10 MB.",
      })
      .nullable()
      .optional(),
    textResponse: z.string().optional(),
    notes: z.string().max(500, "Notes must be under 500 characters.").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.submitAs === "upload" && !data.file) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["file"],
        message: "Please attach a file before submitting.",
      });
    }
    if (
      data.submitAs === "text" &&
      (!data.textResponse || data.textResponse.trim().length < 10)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["textResponse"],
        message: "Please write at least 10 characters.",
      });
    }
  });

type SubmitHomeworkFormValues = z.infer<typeof submitHomeworkSchema>;

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface SubmitHomeworkModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (values: SubmitHomeworkFormValues) => void | Promise<void>;
  assignment?: {
    title?: string;
    subject?: string;
    className?: string;
    dueLabel?: string;
    assignedBy?: string;
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function SubmitHomeworkModal({
  open,
  onClose,
  onSubmit,
  assignment = {
    title: "English Essay — My Favourite Festival",
    subject: "English",
    className: "10A",
    dueLabel: "7 April 2025 (Tomorrow)",
    assignedBy: "Priya Reddy ma'am",
  },
}: SubmitHomeworkModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubmitHomeworkFormValues>({
    resolver: zodResolver(submitHomeworkSchema),
    defaultValues: {
      submitAs: "upload",
      file: null,
      textResponse: "",
      notes: "",
    },
  });

  const submitAs = watch("submitAs");
  const currentFile = watch("file");
  const notesValue = watch("notes") ?? "";

  // ── Dropzone ────────────────────────────────────────────────────────────────
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setValue("file", accepted[0], { shouldValidate: true });
      }
    },
    [setValue]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleFormSubmit = async (values: SubmitHomeworkFormValues) => {
    await onSubmit?.(values);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      reset();
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
 <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/40 backdrop-blur-sm">
       <div
  className={cn(
    "relative w-full sm:max-w-lg bg-white shadow-2xl",
"rounded-2xl",
  "max-h-[90vh] overflow-y-auto",
    "animate-in fade-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
  )}
>
        
          <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            {/* ── Header ── */}
            <div className="flex items-start justify-between px-4 sm:px-6 pt-5 sm:pt-6 pb-3 sm:pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Submit Homework
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  {assignment.title}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Meta ── */}
   <div className="mx-4 sm:mx-6 mb-4 flex flex-wrap gap-x-2 gap-y-1 rounded-xl bg-indigo-50 px-3 sm:px-4 py-3 text-[11px] sm:text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-gray-500">Subject:</span>
                <span className="font-semibold text-indigo-600">
                  {assignment.subject}
                </span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Class:</span>
                <span className="font-semibold text-gray-700">
                  {assignment.className}
                </span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-gray-500">Due:</span>
                <span className="font-semibold text-red-500">
                  {assignment.dueLabel}
                </span>
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-500">
                Assigned by:{" "}
                <span className="font-semibold text-gray-700">
                  {assignment.assignedBy}
                </span>
              </span>
            </div>

         <div className="space-y-4 sm:space-y-5 px-4 sm:px-6 pb-6">
              {/* ── Submit As Tabs ── */}
              <Controller
                name="submitAs"
                control={control}
                render={({ field }) => (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                      Submit As
                    </p>
                    <div className="flex gap-2">
                      {(
                        [
                          { value: "upload", label: "Upload File", icon: <Upload size={14} /> },
                          { value: "text", label: "Text Response", icon: <FileText size={14} /> },
                        ] as const
                      ).map((tab) => (
                        <button
                          key={tab.value}
                          type="button"
                          onClick={() => {
                            field.onChange(tab.value);
                            setValue("file", null);
                            setValue("textResponse", "");
                          }}
                          className={cn(
                            "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200",
                            field.value === tab.value
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          )}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />

              {/* ── Upload Zone ── */}
              {submitAs === "upload" && (
                <Controller
                  name="file"
                  control={control}
                  render={() => (
                    <div>
                      {currentFile ? (
                        /* File preview */
                        <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                              <FileText size={18} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="max-w-[200px] truncate text-sm font-semibold text-gray-800">
                                {currentFile.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatBytes(currentFile.size)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setValue("file", null, { shouldValidate: true })}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        /* Drop zone */
                        <div
                          {...getRootProps()}
                          className={cn(
                            "cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200",
                            isDragActive
                              ? "border-indigo-500 bg-indigo-50"
                              : errors.file
                              ? "border-red-400 bg-red-50"
                              : "border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50"
                          )}
                        >
                          <input {...getInputProps()} />
                          <div
                            className={cn(
                              "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
                              isDragActive ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"
                            )}
                          >
                            <Upload size={22} />
                          </div>
                          <p className="text-sm font-semibold text-gray-700">
                            {isDragActive
                              ? "Drop your file here"
                              : "Drag your completed assignment here"}
                          </p>
                          <p className="my-2 text-xs text-gray-400">or</p>
                          <span className="inline-block rounded-lg border border-indigo-500 px-4 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">
                            Browse File
                          </span>
                          <p className="mt-3 text-xs text-gray-400">
                            PDF, DOC, JPG, PNG &nbsp;|&nbsp; Max 10MB
                          </p>
                        </div>
                      )}

                      {errors.file && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle size={12} />
                          {errors.file.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {/* ── Text Response ── */}
              {submitAs === "text" && (
                <Controller
                  name="textResponse"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <textarea
                        {...field}
                        rows={5}
                        placeholder="Write your assignment response here…"
                        className={cn(
                          "w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                          errors.textResponse ? "border-red-400" : "border-gray-200"
                        )}
                      />
                      {errors.textResponse && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle size={12} />
                          {errors.textResponse.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              )}

              {/* ── Notes ── */}
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-gray-500">
                      Notes to Teacher{" "}
                      <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Any notes or comments for the teacher…"
                      className={cn(
                        "w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500",
                        errors.notes ? "border-red-400" : "border-gray-200"
                      )}
                    />
                    <div className="mt-1 flex items-center justify-between">
                      {errors.notes ? (
                        <p className="flex items-center gap-1 text-xs text-red-500">
                          <AlertCircle size={12} />
                          {errors.notes.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-gray-400">
                        {notesValue.length}/500
                      </p>
                    </div>
                  </div>
                )}
              />

              {/* ── Actions ── */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-80",
                    isSubmitted
                      ? "bg-green-500 shadow-green-200"
                      : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg"
                  )}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 size={16} />
                      Submitted!
                    </>
                  ) : isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Assignment"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}