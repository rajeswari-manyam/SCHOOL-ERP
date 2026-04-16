import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useConfigMutations } from "../hooks/useConfig";
import type { ConfigTemplateFormValues } from "../types/config.types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const schema = z.object({
  name: z
    .string()
    .min(2, "Template name is required")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, underscores"),
  category: z.enum(["Utility", "Marketing", "Authentication"]),
  language: z.enum(["Telugu", "English", "Telugu+English", "Hindi"]),
  body: z.string().min(10, "Template body is required"),
  variables: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof schema>;

interface AddNewTemplateModalProps {
  open: boolean;
  onClose: () => void;
}

const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

const AddNewTemplateModal = ({ open, onClose }: AddNewTemplateModalProps) => {
  const { createTemplate } = useConfigMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      category: "Utility",
      language: "Telugu",
      variables: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({ category: "Utility", language: "Telugu", variables: [] });
    }
  }, [open, reset]);

  if (!open) return null;

  const onSubmit = (values: FormValues) => {
    const payload: ConfigTemplateFormValues = values;
    createTemplate.mutate(payload, { onSuccess: onClose });
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">Add New WhatsApp Template</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                Create a new template and submit it to WhatsApp Meta for approval.
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
            <div>
              <Label className={labelClass} required>
                Template Name
              </Label>
              <Input {...register("name")} placeholder="e.g. fee_reminder_3day" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className={labelClass} required>
                  Category
                </Label>
                <Select
                  {...register("category")}
                  options={[
                    { value: "Utility", label: "Utility" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Authentication", label: "Authentication" },
                  ]}
                />
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <Label className={labelClass} required>
                  Language
                </Label>
                <Select
                  {...register("language")}
                  options={[
                    { value: "Telugu", label: "Telugu" },
                    { value: "English", label: "English" },
                    { value: "Telugu+English", label: "Telugu+English" },
                    { value: "Hindi", label: "Hindi" },
                  ]}
                />
                {errors.language && <p className="text-xs text-red-500 mt-1">{errors.language.message}</p>}
              </div>
            </div>

            <div>
              <Label className={labelClass} required>
                Template Body
              </Label>
              <textarea
                {...register("body")}
                rows={4}
                placeholder="Dear {{1}}, your fee of ₹{{2}} is due on {{3}}."
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Use {'{{1}}'}, {'{{2}}'} etc. for dynamic placeholders.</p>
              {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="outline" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                Cancel
              </Button>
              <Button type="submit" disabled={createTemplate.isPending} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm">
                {createTemplate.isPending ? "Saving…" : "Add Template"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddNewTemplateModal;
