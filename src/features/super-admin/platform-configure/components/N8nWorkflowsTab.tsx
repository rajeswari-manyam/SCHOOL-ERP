import { useWorkflows } from "../hooks/useConfig";

const statusStyles = {
  active:   "bg-emerald-50 text-emerald-600",
  inactive: "bg-gray-100 text-gray-500",
  error:    "bg-red-50 text-red-500",
};

const N8nWorkflowsTab = () => {
  const { data: workflowsData, isLoading } = useWorkflows();

  const workflows = Array.isArray(workflowsData)
    ? workflowsData
    : workflowsData?.data ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h3 className="font-extrabold text-gray-900">n8n Workflows</h3>
        <p className="text-sm text-gray-400 mt-0.5">Automated workflow integrations via n8n</p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading workflows…</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {(workflows ?? []).map((wf) => (
            <div key={wf.id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors">
              <div>
                <p className="text-sm font-semibold text-gray-900">{wf.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Trigger: {wf.trigger}</p>
                {wf.lastRun && <p className="text-[11px] text-gray-300 mt-0.5">Last run: {wf.lastRun}</p>}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[wf.status]}`}>
                {wf.status.charAt(0).toUpperCase() + wf.status.slice(1)}
              </span>
            </div>
          ))}
          {!workflows?.length && (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No workflows configured</p>
          )}
        </div>
      )}
    </div>
  );
};

export default N8nWorkflowsTab;
