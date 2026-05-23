import { useWorkflows } from "../hooks/useConfig";

import type {
  N8nWorkflow,
} from "../types/config.types";

interface WorkflowResponse {
  data?: N8nWorkflow[];
}

const statusStyles = {
  active:
    "bg-emerald-50 text-emerald-600",

  inactive:
    "bg-gray-100 text-gray-500",

  error:
    "bg-red-50 text-red-500",
};

const N8nWorkflowsTab = () => {
  const {
    data: workflowsData,
    isLoading,
  } = useWorkflows();

  /*
  ========================================
  SAFE DATA PARSING
  ========================================
  */

  const workflowsResponse =
    workflowsData as WorkflowResponse;

  const workflows: N8nWorkflow[] =
    Array.isArray(workflowsData)
      ? workflowsData
      : Array.isArray(
          workflowsResponse?.data
        )
      ? workflowsResponse.data
      : [];

  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
      "
    >
      {/* HEADER */}

      <div className="border-b border-gray-50 px-5 py-4">
        <h3 className="text-lg font-extrabold text-gray-900">
          n8n Workflows
        </h3>

        <p className="mt-0.5 text-sm text-gray-400">
          Automated workflow integrations
          via n8n
        </p>
      </div>

      {/* LOADING */}

      {isLoading ? (
        <div className="animate-pulse p-8 text-center text-sm text-gray-400">
          Loading workflows…
        </div>
      ) : (
        <div className="divide-y divide-gray-50">

          {/* WORKFLOWS */}

          {workflows.map((wf) => (
            <div
              key={wf.id}
              className="
                flex
                items-center
                justify-between
                gap-4
                px-5
                py-4
                transition-colors
                hover:bg-gray-50/50
              "
            >
              {/* LEFT */}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {wf.name}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Trigger: {wf.trigger}
                </p>

                {wf.lastRun && (
                  <p className="mt-1 text-[11px] text-gray-300">
                    Last run: {wf.lastRun}
                  </p>
                )}
              </div>

              {/* STATUS */}

              <span
                className={`
                  whitespace-nowrap
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  font-semibold
                  ${statusStyles[wf.status]}
                `}
              >
                {wf.status.charAt(0).toUpperCase() +
                  wf.status.slice(1)}
              </span>
            </div>
          ))}

          {/* EMPTY */}

          {!workflows.length && (
            <p className="px-5 py-8 text-center text-sm text-gray-400">
              No workflows configured
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default N8nWorkflowsTab;