// HomeworkPage.tsx
import { useOutletContext } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { useHomeworkStore } from "../store/HomeWork.store";
import { homeworkData, studyMaterials } from "../data/HomeWork.data";
import { filterHomeworkByDay, groupBySubject, sortByDueDate } from "../utils/homework.utils";
import { DayFilter } from "../components/DayFilter";
import { HomeworkCard } from "../components/HomeWorkCard";
import { StudyMaterialCard } from "../components/StudyMaterialCard";
import { HomeworkProgress } from "../components/HomeWorkProgress";
import { RecommendedResources } from "../components/RecommendedResources";
import typography, { combineTypography } from "@/styles/typography";

type ParentLayoutContext = {
  activeChild: {
    id: number;
    name: string;
    class: string;
    school: string;
    avatar: string;
  };
};

const TABS = [
  { id: "week"      as const, label: "This Week"       },
  { id: "all"       as const, label: "All Homework"    },
  { id: "materials" as const, label: "Study Materials" },
];

const SUBJECT_ORDER = ["ENGLISH", "MATHEMATICS", "SCIENCE"];

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
  const { tab, setTab, day } = useHomeworkStore();
  const { activeChild } = useOutletContext<ParentLayoutContext>();

  const thisWeekHomework = sortByDueDate(filterHomeworkByDay(homeworkData, day));
  const allGrouped       = groupBySubject(sortByDueDate(homeworkData));

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-6 sm:pt-[28px] px-4 sm:px-6 md:px-8 lg:px-[40px]
      pb-16 sm:pb-[64px] bg-[#F8FAFF] min-h-screen flex flex-col gap-4 sm:gap-[20px]">

      {/* BREADCRUMB */}
      <p className={combineTypography(typography.body.xs, "text-gray-400")}>
        {activeChild.name} ›{" "}
        <span className="text-gray-600 font-medium">Homework</span>
      </p>

      {/* PAGE HEADER */}
      <div className="mb-5">
        <h1 className={combineTypography(typography.heading.h4, "text-[#0B1C30]")}>
          Homework &amp; Study Materials
        </h1>
        <p className={combineTypography(typography.body.small, "text-gray-400 mt-0.5")}>
          {activeChild.name} — Class {activeChild.class}
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

      {/* ── THIS WEEK TAB ── */}
      {tab === "week" && (
        <div className="flex flex-col gap-4">
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <DayFilter />
          </div>

          <div className="flex flex-col gap-3">
            {thisWeekHomework.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8EBF2] px-5 py-10 text-center">
                <p className={combineTypography(typography.body.small, "text-gray-400")}>
                  No homework for this day 🎉
                </p>
              </div>
            ) : (
              thisWeekHomework.map((hw) => (
                <HomeworkCard key={hw.id} hw={hw} variant="week" />
              ))
            )}
          </div>
        </div>
      )}

      {/* ── ALL HOMEWORK TAB ── */}
      {tab === "all" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Left: subject-grouped list */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {SUBJECT_ORDER.filter((s) => allGrouped[s]).map((subject) => {
              const items = allGrouped[subject];
              return (
                <div key={subject}>
                  {/* Subject header row */}
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

                  {/* White card wrapper with dividers between rows */}
                  <div className="bg-white rounded-2xl border border-[#E8EBF2] overflow-hidden">
                    {items.map((hw) => (
                      <HomeworkCard key={hw.id} hw={hw} variant="all" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: sidebar */}
          <div className="flex flex-col gap-3">
            <HomeworkProgress />
            <RecommendedResources />
            <NeedHelpCard />
          </div>
        </div>
      )}

      {/* ── STUDY MATERIALS TAB ── */}
      {tab === "materials" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyMaterials.map((item) => (
            <StudyMaterialCard key={item.id} item={item} />
          ))}
        </div>
      )}

    </div>
  );
}