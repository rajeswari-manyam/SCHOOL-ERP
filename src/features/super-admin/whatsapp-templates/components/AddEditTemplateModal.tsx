import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { WhatsAppTemplate, TemplateFormValues } from "../types/templates.types";
import { useTemplateMutations } from "../hooks/useTemplates";

const schema = z.object({
  name: z.string().min(2, "Name required").regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, underscores"),
  category: z.enum(["UTILITY", "MARKETING", "AUTHENTICATION"]),
  language: z.enum(["Telugu", "English", "Telugu+English", "Hindi"]),
  body: z.string().min(10, "Template body required"),
  variables: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof schema>;

interface AddEditTemplateModalProps {
  open: boolean;
  template?: WhatsAppTemplate | null;
  onClose: () => void;
}

const inputClass = "w-full h-10 px-3 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
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
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900">{isEdit ? "Edit Template" : "Add Template"}</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {isEdit ? "Update the WhatsApp template" : "Create a new Meta-approved template"}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <label className={labelClass}>Template Name *</label>
              <input {...register("name")} placeholder="e.g. fee_reminder_3day" className={inputClass} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className={labelClass}>Category *</label>
                <div className="relative">
                  <select {...register("category")} className={`${inputClass} appearance-none pr-8 cursor-pointer`}>
                    <option value="UTILITY">Utility</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="AUTHENTICATION">Authentication</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className={labelClass}>Language *</label>
                <div className="relative">
                  <select {...register("language")} className={`${inputClass} appearance-none pr-8 cursor-pointer`}>
                    <option value="Telugu">Telugu</option>
                    <option value="English">English</option>
                    <option value="Telugu+English">Telugu+English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </div>
              </div>
            </div>

            {/* Body */}
            <div>
              <label className={labelClass}>Template Body *</label>
              <textarea
                {...register("body")}
                rows={4}
                placeholder={`Dear {{1}}, your fee of ₹{{2}} is due on {{3}}.`}
                className={`${inputClass} h-auto py-2.5 resize-none`}
              />
              <p className="text-xs text-gray-400 mt-1">Use {"{{1}}"}, {"{{2}}"} etc. for dynamic variables</p>
              {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 transition-colors shadow-sm"
              >
                {isPending ? "Saving…" : isEdit ? "Save Changes" : "Add Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEditTemplateModal;
