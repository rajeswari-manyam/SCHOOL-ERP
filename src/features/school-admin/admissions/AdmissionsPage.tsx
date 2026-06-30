import { useQuery } from '@tanstack/react-query';
import { Download, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { PipelineStats } from './components/PipelineStats';
import { PipelineBoard } from './components/PipelineBoard';
import { EnquiryDetailDrawer } from './components/EnquiryDetailDrawer';
import { AddEnquiryModal } from './components/AddEnquiryModal';
import { ConfirmAdmissionModal } from './components/ConfirmAdmissionModal';
import { useAdmissionsStore } from './hooks/useAdmissionsStore';
import { useUIStore } from '@/store/uiStore';
import { getAllAcademicYears } from '@/services/academicYear.api';

export function AdmissionsPage() {
  const { openAddEnquiry } = useAdmissionsStore();
  const storeYearId = useUIStore((s) => s.academicYearId);
  const { data: activeYear } = useQuery({
    queryKey: ['academic-years', storeYearId],
    queryFn: async () => {
      const res = await getAllAcademicYears();
      const years = res?.status && Array.isArray(res?.data) ? res.data : [];
      const selected = years.find((y) => y.id === storeYearId);
      if (selected) return selected;
      return years.find((y) => y.active) || years[0] || null;
    },
    staleTime: 5 * 60_000,
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <main className="px-3 py-4 sm:px-6 sm:py-6 max-w-[1480px] mx-auto">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                Admissions
              </h1>
              {activeYear?.yearName && (
                <span className="text-[11px] font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-full px-3 py-1 leading-none">
                  {activeYear.yearName} Academic Year
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Manage student journey from initial enquiry to final confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={15} />
              Export Pipeline
            </button>
            <button
              onClick={openAddEnquiry}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <UserPlus size={15} />
              + Add Enquiry
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-5">
          <PipelineStats />
        </div>

        {/* Pipeline Board */}
        <div className="overflow-x-auto pb-6">
          <PipelineBoard />
        </div>
      </main>

      {/* Modals & Drawers */}
      <AddEnquiryModal />
      <ConfirmAdmissionModal />
      <EnquiryDetailDrawer />
    </div>
  );
}
