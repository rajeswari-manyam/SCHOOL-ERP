import { create } from 'zustand';
import type { PipelineStage } from '../types';

interface AdmissionsUIState {
  selectedEnquiryId: string | null;
  isConfirmAdmissionOpen: boolean;
  isDeclineOpen: boolean;
  confirmTargetId: string | null;
  searchQuery: string;
  filterStage: PipelineStage | 'all';

  setSelectedEnquiry: (id: string | null) => void;
  openConfirmAdmission: (id: string) => void;
  closeConfirmAdmission: () => void;
  openDecline: (id: string) => void;
  closeDecline: () => void;
  setSearchQuery: (q: string) => void;
  setFilterStage: (stage: PipelineStage | 'all') => void;
}

export const useAdmissionsStore = create<AdmissionsUIState>((set) => ({
  selectedEnquiryId: null,
  isConfirmAdmissionOpen: false,
  isDeclineOpen: false,
  confirmTargetId: null,
  searchQuery: '',
  filterStage: 'all',

  setSelectedEnquiry: (id) => set({ selectedEnquiryId: id }),
  openConfirmAdmission: (id) => set({ isConfirmAdmissionOpen: true, confirmTargetId: id }),
  closeConfirmAdmission: () => set({ isConfirmAdmissionOpen: false, confirmTargetId: null }),
  openDecline: (id) => set({ isDeclineOpen: true, confirmTargetId: id }),
  closeDecline: () => set({ isDeclineOpen: false, confirmTargetId: null }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterStage: (filterStage) => set({ filterStage }),
}));
