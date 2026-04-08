import { useApplications, useCreateApplication } from "./hooks/useAdmissions";
import { useState } from "react";
import { ApplicationTable } from "./components/ApplicationTable";
import { AdmissionForm } from "./components/AdmissionForm";
import { ReviewModal } from "./components/ReviewModal";

const AdmissionsPage = () => {
  const { data, isLoading } = useApplications();
  const createApplication = useCreateApplication();
  const [formOpen, setFormOpen] = useState(false);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const handleFormSubmit = (values: any) => {
    createApplication.mutate(values);
    setFormOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Admissions</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setFormOpen(true)}
        >
          New Application
        </button>
      </div>
      <ApplicationTable
        applications={data?.records ?? []}
        onReview={setReviewId}
      />
      {formOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded shadow p-6 w-96">
            <h2 className="font-semibold mb-4">New Admission Application</h2>
            <AdmissionForm
              onSubmit={handleFormSubmit}
              loading={createApplication.isLoading}
            />
            <button
              className="mt-4 px-3 py-1"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ReviewModal
        open={!!reviewId}
        applicationId={reviewId ?? ""}
        onClose={() => setReviewId(null)}
      />
    </div>
  );
};

export default AdmissionsPage;
