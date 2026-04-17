


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import ConfigTabs from "./components/ConfigTabs";
import DialogConfigCard from "./components/DialogConfigCard";
import RazorpayConfigCard from "./components/RazorpayConfigCard";
import EmailSmsConfigCard from "./components/EmailSmsConfigCard";
import WATemplatesTab from "./components/WATemplatesTab";
import FeatureFlagsTab from "./components/FeatureFlagsTab";
import N8nWorkflowsTab from "./components/N8nWorkflowsTab";
import { useConfig, useConfigMutations } from "./hooks/useConfig";
import type { ConfigTab } from "./types/config.types";
import { Button } from "@/components/ui/button";

const PlatformConfigPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ConfigTab>("integrations");
  const { data: config } = useConfig();
  const { resetConfig, saveAll } = useConfigMutations();

  const handleSaveAll = () => {
    if (config) saveAll.mutate(config);
  };

  return (
    <div className="flex flex-col gap-6 min-h-full">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Platform Config
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage integrations, templates, and system settings
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="outline"
            onClick={() =>
              confirm("Reset all settings to defaults?") &&
              resetConfig.mutate()
            }
            disabled={resetConfig.isPending}
          >
            Reset
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={saveAll.isPending}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saveAll.isPending ? "Saving…" : "Save Settings"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <ConfigTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === "integrations" && (
        <div className="flex flex-col gap-5">
          <DialogConfigCard config={config?.dialog} />
          <RazorpayConfigCard config={config?.razorpay} />
          <EmailSmsConfigCard config={config?.emailSms} />
        </div>
      )}
      {activeTab === "wa-templates" && <WATemplatesTab />}
      {activeTab === "feature-flags" && <FeatureFlagsTab />}
      {activeTab === "n8n-workflows" && <N8nWorkflowsTab />}
    </div>
  );
};

export default PlatformConfigPage;
