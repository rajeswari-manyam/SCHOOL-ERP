import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { templatesApi } from "../api/templates.api";
import type { TemplateFilters, TemplateFormValues } from "../types/templates.types";

export const TEMPLATE_KEYS = {
  all:    ["super-admin", "whatsapp-templates"] as const,
  list:   (f: Partial<TemplateFilters>) => [...TEMPLATE_KEYS.all, "list", f] as const,
  stats:  () => [...TEMPLATE_KEYS.all, "stats"] as const,
  detail: (id: string) => [...TEMPLATE_KEYS.all, "detail", id] as const,
};

export const useTemplates = (filters: Partial<TemplateFilters>) =>
  useQuery({
    queryKey: TEMPLATE_KEYS.list(filters),
    queryFn: () => templatesApi.getTemplates(filters),
    staleTime: 1000 * 60 * 2,
    placeholderData: (prev) => prev,
  });

export const useTemplateStats = () =>
  useQuery({
    queryKey: TEMPLATE_KEYS.stats(),
    queryFn: templatesApi.getStats,
    staleTime: 1000 * 60 * 5,
  });

export const useTemplateMutations = () => {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: TEMPLATE_KEYS.all });

  const createTemplate = useMutation({
    mutationFn: (payload: TemplateFormValues) => templatesApi.createTemplate(payload),
    onSuccess: invalidate,
  });

  const updateTemplate = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TemplateFormValues> }) =>
      templatesApi.updateTemplate(id, payload),
    onSuccess: invalidate,
  });

  const deleteTemplate = useMutation({
    mutationFn: (id: string) => templatesApi.deleteTemplate(id),
    onSuccess: invalidate,
  });

  const submitToMeta = useMutation({
    mutationFn: (ids: string[]) => templatesApi.submitToMeta(ids),
    onSuccess: invalidate,
  });

  return { createTemplate, updateTemplate, deleteTemplate, submitToMeta };
};
