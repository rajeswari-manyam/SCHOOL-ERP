import { useQuery } from '@tanstack/react-query';
import { Download, UserPlus} from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
     

      {/* Main Content */}
      <main className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight truncate">Admissions</h1>
              {activeYear?.yearName && (
                <span className="text-xs font-semibold text-indigo-600 border border-indigo-300 rounded-full px-2 sm:px-3 py-1 whitespace-nowrap">
                  {activeYear.yearName} Academic Year
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-1 line-clamp-2">
              Manage student journey from initial enquiry to final confirmation.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={14} />
              <span className="hidden sm:inline">Export Pipeline</span><span className="sm:hidden">Export</span>
            </button>
            <button
              onClick={openAddEnquiry}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
            >
              <UserPlus size={14} />
              + Add Enquiry
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mb-6">
          <PipelineStats />
        </div>

        {/* Pipeline Board */}
        <div className="overflow-x-auto pb-4">
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
