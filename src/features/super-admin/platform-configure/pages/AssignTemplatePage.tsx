import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAllSchools } from "../../schools/hooks/useSchools";
import { useConfigMutations } from "../hooks/useConfig";
import type { ConfigTemplate, ConfigTemplateAssignPayload } from "../types/config.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const schema = z.object({
  assignTo: z.enum(["ALL", "SPECIFIC"]),
  schoolIds: z.array(z.string()).optional(),
}).superRefine((data, ctx) => {
  if (data.assignTo === "SPECIFIC" && !data.schoolIds?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["schoolIds"],
      message: "Select at least one school",
    });
  }
});

type FormValues = z.infer<typeof schema>;

interface AssignTemplateLocationState {
  template?: ConfigTemplate | null;
}

const AssignTemplatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const template = (location.state as AssignTemplateLocationState | null)?.template ?? null;
  const goBackToConfig = () => navigate("/superadmin/config");

  const [search, setSearch] = useState("");
  const { data: schoolsData, isFetching } = useAllSchools(search);
  const schools = schoolsData ?? [];

  const { assignTemplateToSchools } = useConfigMutations();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: { assignTo: "ALL", schoolIds: [] },
  });

  const assignTo = useWatch({ control, name: "assignTo" });
  const selectedIds = useWatch({ control, name: "schoolIds" }) ?? [];

  if (!template) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-8 text-center">
          <p className="text-sm text-gray-500">No template selected.</p>
          <Button className="mt-4" onClick={goBackToConfig}>
            Back to Platform Configuration
          </Button>
        </div>
      </div>
    );
  }

  const selectedCount = selectedIds.length;
  const totalCount = schools.length;

  const toggleSchool = (schoolId: string) => {
    const next = new Set(selectedIds);
    if (next.has(schoolId)) {
      next.delete(schoolId);
    } else {
      next.add(schoolId);
    }
    setValue("schoolIds", Array.from(next), { shouldValidate: true });
  };

  const onSubmit = (values: FormValues) => {
    const payload: ConfigTemplateAssignPayload = {
      assignTo: values.assignTo,
      schoolIds: values.assignTo === "SPECIFIC" ? values.schoolIds : undefined,
    };

    assignTemplateToSchools.mutate(
      { templateId: template.id, payload },
      { onSuccess: goBackToConfig }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <button
          type="button"
          onClick={goBackToConfig}
          className="hover:text-gray-600 dark:hover:text-gray-300"
        >
          Platform Configuration
        </button>
        <span>›</span>
        <span className="text-gray-600 dark:text-gray-300">Assign Template</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 dark:border-white/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shrink-0">
              <Send size={18} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Assign Template to Schools</h1>
              <p className="mt-1 text-sm text-gray-500">Assign the approved WhatsApp template to all or selected schools.</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="font-semibold text-gray-900 dark:text-white">{template.name}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">{template.metaStatus}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goBackToConfig}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900"
            aria-label="Back to platform configuration"
          >
            <ArrowLeft size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 px-6 pb-6 pt-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setValue("assignTo", "ALL", { shouldValidate: true })}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${assignTo === "ALL" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300"}`}
            >
              All Schools
              <p className="mt-1 text-xs font-normal text-gray-500">Assign this template across the full network.</p>
            </button>
            <button
              type="button"
              onClick={() => setValue("assignTo", "SPECIFIC", { shouldValidate: true })}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${assignTo === "SPECIFIC" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-white text-gray-700 hover:border-indigo-300"}`}
            >
              Specific Schools
              <p className="mt-1 text-xs font-normal text-gray-500">Select individual schools for this assignment.</p>
            </button>
          </div>

          {assignTo === "SPECIFIC" ? (
            <div className="space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <Label className="text-[11px] font-bold uppercase tracking-widest text-gray-500" htmlFor="school-search">
                    Search school
                  </Label>
                  <Input
                    id="school-search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search school..."
                    className="mt-2 bg-[#EFF4FF]"
                  />
                </div>
                <div className="rounded-3xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                  {selectedCount} of {totalCount} selected
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto rounded-3xl border border-gray-200 bg-white p-3">
                {isFetching ? (
                  <div className="text-sm text-gray-500">Loading schools…</div>
                ) : schools.length === 0 ? (
                  <div className="text-sm text-gray-500">No schools found.</div>
                ) : (
                  <div className="space-y-2">
                    {schools.map((school) => (
                      <label key={school.id} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-3 py-3 text-sm hover:border-indigo-300">
                        <Checkbox
                          checked={selectedIds.includes(school.id)}
                          onChange={() => toggleSchool(school.id)}
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{school.name}</div>
                          <div className="text-xs text-gray-500">{school.city}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {errors.schoolIds && (
                <p className="text-xs text-red-500">{errors.schoolIds.message}</p>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50 px-5 py-4 text-sm text-indigo-700">
              <div className="font-semibold">All schools will receive this template.</div>
              <p className="mt-1 text-sm text-indigo-700/80">This will assign the template to every active school in the system.</p>
            </div>
          )}

          <div className="space-y-2 rounded-3xl bg-gray-100 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-500">Triggers this template for</div>
            <div className="grid gap-2 sm:grid-cols-2 text-sm text-gray-700">
              <div className="rounded-2xl bg-white px-3 py-3">Event: <span className="font-semibold">Student marked absent</span></div>
              <div className="rounded-2xl bg-white px-3 py-3">Auto-send: <span className="font-semibold text-emerald-700">Yes</span></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1">Parent Name</span>
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1">Student Name</span>
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1">Class</span>
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1">Date</span>
              <span className="rounded-full border border-gray-300 bg-white px-3 py-1">School Name</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={goBackToConfig} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={assignTemplateToSchools.isPending || (assignTo === "SPECIFIC" && selectedCount === 0)}
              className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {assignTemplateToSchools.isPending ? "Assigning…" : "Assign to Schools"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTemplatePage;
