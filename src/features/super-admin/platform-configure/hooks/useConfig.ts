import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configApi } from "../api/config.api";
import type { DialogConfig, RazorpayConfig, EmailSmsConfig, PlatformConfigData } from "../types/config.types";

export const CONFIG_KEYS = {
  all:       ["super-admin", "config"] as const,
  main:      () => [...CONFIG_KEYS.all, "main"] as const,
  flags:     () => [...CONFIG_KEYS.all, "flags"] as const,
  workflows: () => [...CONFIG_KEYS.all, "workflows"] as const,
  templates: () => [...CONFIG_KEYS.all, "wa-templates"] as const,
};

export const useConfig = () =>
  useQuery({ queryKey: CONFIG_KEYS.main(), queryFn: configApi.getConfig, staleTime: 1000 * 60 * 5 });

export const useFeatureFlags = () =>
  useQuery({ queryKey: CONFIG_KEYS.flags(), queryFn: configApi.getFeatureFlags, staleTime: 1000 * 60 });

export const useWorkflows = () =>
  useQuery({ queryKey: CONFIG_KEYS.workflows(), queryFn: configApi.getWorkflows, staleTime: 1000 * 60 });

export const useConfigTemplates = () =>
  useQuery({ queryKey: CONFIG_KEYS.templates(), queryFn: configApi.getTemplates, staleTime: 1000 * 60 });

export const useConfigMutations = () => {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: CONFIG_KEYS.all });
  return {
    saveDialog:    useMutation({ mutationFn: (p: DialogConfig) => configApi.saveDialog(p), onSuccess: inv }),
    testDialog:    useMutation({ mutationFn: () => configApi.testDialog() }),
    saveRazorpay:  useMutation({ mutationFn: (p: RazorpayConfig) => configApi.saveRazorpay(p), onSuccess: inv }),
    testRazorpay:  useMutation({ mutationFn: () => configApi.testRazorpay() }),
    saveEmailSms:  useMutation({ mutationFn: (p: EmailSmsConfig) => configApi.saveEmailSms(p), onSuccess: inv }),
    toggleFlag:    useMutation({ mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) => configApi.toggleFlag(id, enabled), onSuccess: inv }),
    syncTemplates: useMutation({ mutationFn: () => configApi.syncTemplatesFromMeta(), onSuccess: inv }),
    resetConfig:   useMutation({ mutationFn: () => configApi.resetConfig(), onSuccess: inv }),
    saveAll:       useMutation({ mutationFn: (p: PlatformConfigData) => configApi.saveAllSettings(p), onSuccess: inv }),
  };
};
