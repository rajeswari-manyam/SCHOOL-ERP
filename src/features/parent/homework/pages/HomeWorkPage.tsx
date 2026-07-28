import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { useHomeworkStore } from "../store/HomeWork.store";
import { groupBySubject, sortByDueDate, mapApiHomework } from "../utils/homework.utils";
import { getHomeworkThisWeek, getSubmissionsByStudentId } from "../../../../services/homework.api";
import { useStudyMaterials } from "../hooks/useStudymaterial";
import { HomeworkCard } from "../components/HomeWorkCard";
import { StudyMaterialCard } from "../components/StudyMaterialCard";
import { HomeworkProgress } from "../components/HomeWorkProgress";
import { RecommendedResources } from "../components/RecommendedResources";
import typography, { combineTypography } from "@/styles/typography";
import { useStudentById } from "../../dashboard/hooks/useStudent";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    section?: string;
    school: string;
    avatar: string;
    studentId?: string;
    classDetail?: { id: string; className: string } | null;
    sectionDetail?: { id: string; sectionName: string } | null;
  };
};

const TABS = [
  { id: "homeworks" as const, label: "Homeworks" },
  { id: "materials" as const, label: "Study Materials" },
];

const SUBJECT_ORDER = ["ENGLISH", "MATHEMATICS", "SCIENCE"];

const LoadingState = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 size={28} className="animate-spin text-[#3525CD]" />
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-2xl border border-red-100 px-5 py-8 flex flex-col items-center gap-2 text-center">
    <AlertCircle size={24} className="text-red-400" />
    <p className={combineTypography(typography.body.small, "text-red-500")}>
      {message}
    </p>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-2xl border border-[#E8EBF2] px-5 py-10 text-center">
    <p className={combineTypography(typography.body.small, "text-gray-400")}>
      {message}
    </p>
  </div>
);

const NeedHelpCard = () => (
  <div className="bg-white rounded-2xl border border-[#E8EBF2] p-4 flex gap-3">
    <div className="w-8 h-8 rounded-xl bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
      <HelpCircle size={16} color="#3525CD" strokeWidth={1.5} />
    </div>
    <div>
      <p className={combineTypography(typography.body.small, "font-semibold text-[#0B1C30] mb-0.5")}>
        Need Help?
      </p>
      <p className={combineTypography(typography.body.small, "text-gray-400 mb-2 leading-relaxed")}>
        Chat with the School Support Coordinator
      </p>
      <button className={combineTypography(typography.body.small, "font-semibold text-[#3525CD] hover:underline")}>
        Contact Admin
      </button>
    </div>
  </div>
);

export default function HomeworkPage() {
  const { activeChild } = useOutletContext<ParentLayoutContext>();
  const studentId = String(activeChild?.studentId ?? activeChild?.id ?? "");
  const { student } = useStudentById(studentId);

  // Use context data immediately (already fetched by ParentLayout), fall back to API
  const classIdForApi   = activeChild?.classDetail?.id   ?? student?.classDetail?.id ?? "";
  const sectionIdForApi = activeChild?.sectionDetail?.id ?? student?.sectionDetail?.id ?? "";

  const displayClass   = student?.classDetail?.class_name ?? activeChild?.classDetail?.className ?? activeChild?.class ?? "";
  const displaySection = student?.sectionDetail?.sectionName ?? activeChild?.sectionDetail?.sectionName ?? activeChild?.section ?? "";

  const {
    tab, setTab,
    allHomeworks, allLoading, allError,
    setAllHomeworks, setAllLoading, setAllError,
  } = useHomeworkStore();

  const {
    materials,
    loading: materialsLoading,
    error: materialsError,
  } = useStudyMaterials(
    tab === "materials" ? classIdForApi : "",
    tab === "materials" ? sectionIdForApi : ""
  );

  // Fetch homeworks — waits for classIdForApi to resolve before calling API
  useEffect(() => {
    if (tab !== "homeworks") return;
    if (!classIdForApi) return; // prevents 400 — waits until student data loads

    let cancelled = false;
    setAllLoading(true);
    setAllError(null);

    Promise.all([
      getHomeworkThisWeek({
        class_id: classIdForApi,
        section_id: sectionIdForApi || undefined,
      }),
      studentId ? getSubmissionsByStudentId(studentId).catch(() => null) : Promise.resolve(null),
    ])
      .then(([res, subRes]) => {
        if (cancelled) return;
        if (res.status && Array.isArray(res.data)) {
          const submittedIds = new Set(
            (subRes?.data ?? [])
              .filter((s) => s.status === "submitted")
              .map((s) => s.homework_id)
          );
          setAllHomeworks(res.data.map((hw) => mapApiHomework(hw, submittedIds.has(hw.id))));
        } else {
          setAllError(res.message ?? "Failed to load homework.");
        }
      })
      .catch((err) => {
        if (!cancelled) setAllError(err?.message ?? "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setAllLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // re-fires once classIdForApi resolves from ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, classIdForApi, sectionIdForApi, studentId]);

  const allGrouped = groupBySubject(sortByDueDate(allHomeworks ?? []));

  if (!activeChild) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-[#3525CD]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-6 sm:pt-[28px] px-4 sm:px-6 md:px-8 lg:px-[40px]
      pb-16 sm:pb-[64px] bg-[#F8FAFF] min-h-screen flex flex-col gap-4 sm:gap-[20px]">

      {/* BREADCRUMB */}
      <p className={combineTypography(typography.body.xs, "text-gray-400")}>
       {activeChild?.name ?? ""} › {" "}
        <span className="text-gray-600 font-medium">Homework</span>
      </p>

      {/* PAGE HEADER */}
      <div className="mb-5">
        <h1 className="text-sm font-semibold text-[#0B1C30]">
          Homework &amp; Study Materials
        </h1>
        <p className={combineTypography(typography.body.small, "text-gray-400 mt-0.5")}>
          {activeChild?.name ?? ""} — {displayClass}{displaySection ? ` · ${displaySection}` : ""}
        </p>
      </div>

      {/* TAB BAR */}
      <div className="flex border-b border-[#E8EBF2] mb-6 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[13px] font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap
              ${tab === t.id
                ? "border-[#3525CD] text-[#3525CD]"
                : "border-transparent text-gray-400 hover:text-[#0B1C30]"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* HOMEWORKS TAB */}
      {tab === "homeworks" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 flex flex-col gap-5">
            {allLoading ? (
              <LoadingState />
            ) : allError ? (
              <ErrorState message={allError} />
            ) : allHomeworks.length === 0 ? (
              <EmptyState message="No homework found." />
            ) : (
              [
                ...SUBJECT_ORDER.filter((s) => allGrouped[s]),
                ...Object.keys(allGrouped).filter((s) => !SUBJECT_ORDER.includes(s)),
              ].map((subject) => {
                const items = allGrouped[subject];
                return (
                  <div key={subject}>
                    <div className="flex items-center justify-between px-1 mb-2">
                      <span className={combineTypography(
                        typography.body.small,
                        "font-bold text-gray-400 uppercase tracking-widest"
                      )}>
                        {subject}
                      </span>
                      <span className={combineTypography(
                        typography.body.small,
                        "rounded-full bg-[#E5EEFF] text-[#3525CD] px-2 py-1"
                      )}>
                        {items.length} assignment{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="bg-white rounded-2xl border border-[#E8EBF2] overflow-hidden">
                      {items.map((hw) => (
                        <HomeworkCard key={hw.id} hw={hw} variant="all" />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-col gap-3">
            <HomeworkProgress />
            <RecommendedResources />
            <NeedHelpCard />
          </div>
        </div>
      )}

      {/* STUDY MATERIALS TAB */}
      {tab === "materials" && (
        materialsLoading ? (
          <LoadingState />
        ) : materialsError ? (
          <ErrorState message={materialsError} />
        ) : materials.length === 0 ? (
          <EmptyState message="No study materials available for this class." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((item) => (
              <StudyMaterialCard key={item.id} item={item} />
            ))}
          </div>
        )
      )}

    </div>
  );
}