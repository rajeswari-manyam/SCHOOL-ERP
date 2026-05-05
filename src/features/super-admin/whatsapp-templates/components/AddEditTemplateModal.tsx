import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type { WhatsAppTemplate, TemplateFormValues } from "../types/templates.types";
import { useTemplateMutations } from "../hooks/useTemplates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(2, "Name required").regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, underscores"),
  category: z.enum(["UTILITY", "MARKETING", "AUTHENTICATION"]),
  language: z.enum(["Telugu", "English", "Telugu+English", "Hindi"]),
  body: z.string().min(10, "Template body required"),
  variables: z.array(z.string()), // required string[] to match TemplateFormValues
});

type FormValues = z.infer<typeof schema>;

interface AddEditTemplateModalProps {
  open: boolean;
  template?: WhatsAppTemplate | null;
  onClose: () => void;
}

const labelClass = "block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1.5";

const AddEditTemplateModal = ({ open, template, onClose }: AddEditTemplateModalProps) => {
  const { createTemplate, updateTemplate } = useTemplateMutations();
  const isEdit = !!template;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: "UTILITY", language: "Telugu", variables: [] },
  });

  useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        category: template.category,
        language: template.language,
        body: template.body ?? "",
        variables: template.variables ?? [],
      });
    } else {
      reset({ category: "UTILITY", language: "Telugu", variables: [] });
    }
  }, [template, reset]);

  if (!open) return null;

  const onSubmit = (values: FormValues) => {
    const payload = values as TemplateFormValues;
    if (isEdit && template) {
      updateTemplate.mutate({ id: template.id, payload }, { onSuccess: onClose });
    } else {
      createTemplate.mutate(payload, { onSuccess: onClose });
    }
  };

  const isPending = createTemplate.isPending || updateTemplate.isPending;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">{isEdit ? "Edit Template" : "Add Template"}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {isEdit ? "Update the WhatsApp template" : "Create a new Meta-approved template"}
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
              <X className="w-4 h-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <Label className={labelClass} required>
                Template Name
              </Label>
              <Input {...register("name")} placeholder="e.g. fee_reminder_3day" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <Label className={labelClass} required>
                  Category
                </Label>
                <Select
                  {...register("category")}
                  options={[
                    { value: "UTILITY", label: "Utility" },
                    { value: "MARKETING", label: "Marketing" },
                    { value: "AUTHENTICATION", label: "Authentication" },
                  ]}
                />
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>

              {/* Language */}
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

            {/* Body */}
            <div>
              <Label className={labelClass} required>
                Template Body
              </Label>
              <Textarea
                {...register("body")}
                rows={4}
                placeholder={`Dear {{1}}, your fee of ₹{{2}} is due on {{3}}.`}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Use {"{{1}}"}, {"{{2}}"} etc. for dynamic variables</p>
              {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="text-sm font-semibold text-gray-600 hover:text-gray-900">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
              >
                {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Template"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddEditTemplateModal;
