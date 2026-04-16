import { useHomework, useHomeworkPageState, useStudyMaterials, useSubmitAssignment, useDownloadMaterial } from "./hooks/Usehomework";

// Components
import AssignmentCard from "./components/Assignmentcard";
import WeekdayNav from "./components/Weekdaynav";
import StudyMaterialsGrid from "./components/Studymaterialsgrid";
import SubmitModal from "./components/Submitmodal";

const HomeworkPage = () => {
  // ─── API DATA ───────────────────────────────
  const { data, isLoading } = useHomework();
  const { data: materials } = useStudyMaterials();
  const submitAssignmentMutation = useSubmitAssignment();
  const { download, loadingId } = useDownloadMaterial();

  // ─── UI STATE ──────────────────────────────
  const {
    state,
    setActiveTab,
    setSelectedDate,
    openSubmitModal,
    closeSubmitModal,
  } = useHomeworkPageState();

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading homework...</div>;
  }

  const handleSubmit = async (payload: any) => {
    try {
      await submitAssignmentMutation.mutateAsync(payload);
      closeSubmitModal();
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* ─── HEADER ───────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Homework</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage your weekly assignments
        </p>
      </div>

      {/* ─── WEEK NAVIGATION ───────────────── */}
      {data?.weekView && (
        <WeekdayNav
          days={data.weekView.days}
          selectedDate={state.selectedDate}
          onSelect={setSelectedDate}
        />
      )}

      {/* ─── TAB SWITCH ───────────────────── */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("THIS_WEEK")}
          className={`px-4 py-1 rounded ${
            state.activeTab === "THIS_WEEK"
              ? "bg-indigo-600 text-white"
              : "border text-gray-600"
          }`}
        >
          This Week
        </button>

        <button
          onClick={() => setActiveTab("ALL_HOMEWORK")}
          className={`px-4 py-1 rounded ${
            state.activeTab === "ALL_HOMEWORK"
              ? "bg-indigo-600 text-white"
              : "border text-gray-600"
          }`}
        >
          All Homework
        </button>

        <button
          onClick={() => setActiveTab("STUDY_MATERIALS")}
          className={`px-4 py-1 rounded ${
            state.activeTab === "STUDY_MATERIALS"
              ? "bg-indigo-600 text-white"
              : "border text-gray-600"
          }`}
        >
          Study Materials
        </button>
      </div>

      {/* ─── CONTENT ──────────────────────── */}
      <div className="space-y-4">

        {/* THIS WEEK */}
        {state.activeTab === "THIS_WEEK" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.assignments?.map((item: any) => (
              <AssignmentCard
                key={item.id}
                assignment={item}
                onSubmit={() => openSubmitModal(item)}
              />
            ))}
          </div>
        )}

        {/* ALL HOMEWORK */}
        {state.activeTab === "ALL_HOMEWORK" && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.assignments?.map((item: any) => (
              <AssignmentCard
                key={item.id}
                assignment={item}
                onSubmit={() => openSubmitModal(item)}
              />
            ))}
          </div>
        )}

        {/* STUDY MATERIALS */}
        {state.activeTab === "STUDY_MATERIALS" && (
          <StudyMaterialsGrid
            materials={materials?.materials || []}
            onDownload={download}
            downloadingId={loadingId}
          />
        )}

      </div>

      {/* ─── SUBMIT MODAL ─────────────────── */}
      {state.submitModalOpen && state.selectedAssignment && (
        <SubmitModal
          assignment={state.selectedAssignment}
          isSubmitting={submitAssignmentMutation.isPending}
          onSubmit={handleSubmit}
          onClose={closeSubmitModal}
        />
      )}

    </div>
  );
};

export default HomeworkPage;