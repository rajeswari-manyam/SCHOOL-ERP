export { default as WhatsAppTemplatesPage } from "./WhatsAppTemplatesPage";
export { default as TemplatesTable } from "./components/TemplatesTable";
export { default as TemplateFilterBar } from "./components/TemplateFilterBar";
export { default as TemplateTabs } from "./components/TemplateTabs";
export { default as TemplateStatCards } from "./components/TemplateStatCards";
export { default as AddEditTemplateModal } from "./components/AddEditTemplateModal";
export { CategoryBadge, MetaStatusBadge } from "./components/TemplateBadges";
export { useTemplates, useTemplateStats, useTemplateMutations } from "./hooks/useTemplates";
export type {
  WhatsAppTemplate, TemplateStats, TemplateFilters,
  TemplateCategory, MetaStatus, TemplateTab,
} from "./types/templates.types";
