import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { TransportSlab } from "../types/fees.types";
import { useTransportFees } from "../hooks/useFees";
import { TransportSlabsTable } from "./TransportSlabTab";
import { SlabModal } from "./SlabModal";
import { StudentSlabAssignment } from "./StudentSlabAssignment";

export function TransportFees() {
  const {
    slabs,
    search,
    setSearch,
    pendingSlabs,
    setPendingSlabs,
    filteredStudents,
    handleSaveSlab,
    handleDeleteSlab,
    handleSaveStudentSlab,
  } = useTransportFees();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlab, setEditingSlab] = useState<TransportSlab | null>(null);
  const [isAdd, setIsAdd] = useState(false);

  const openAdd = () => {
    setEditingSlab(null);
    setIsAdd(true);
    setModalOpen(true);
  };

  const openEdit = (slab: TransportSlab) => {
    setEditingSlab(slab);
    setIsAdd(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSlab(null);
  };

  const handleSave = (data: Omit<TransportSlab, "id" | "students">) => {
    handleSaveSlab(editingSlab, data);
    closeModal();
  };

  const handleSlabChange = (studentId: string, slabId: string) => {
    setPendingSlabs((prev) => ({
      ...prev,
      [studentId]: slabId,
    }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        {/* Left side */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Fee Management
          </h2>
          <p className="text-xs text-gray-500">
            Academic Year 2024–25
          </p>
        </div>

        {/* Right side actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="text-xs h-8 bg-[#3525CD] hover:bg-[#2a1fb5] text-white"
            onClick={openAdd}
          >
            + Add Slab
          </Button>

          {/* optional edit global action (if you want later) */}
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 text-[#3525CD] border-indigo-200"
          >
            Edit Slabs
          </Button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <SlabModal
          slab={editingSlab}
          isAdd={isAdd}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Slabs Table */}
      <TransportSlabsTable
        slabs={slabs}
        onEdit={openEdit}
        onDelete={handleDeleteSlab}
      />

      {/* Student Assignment Table */}
      <StudentSlabAssignment
        students={filteredStudents}
        slabs={slabs}
        search={search}
        onSearchChange={setSearch}
        pendingSlabs={pendingSlabs}
        onSlabChange={handleSlabChange}
        onSaveStudentSlab={handleSaveStudentSlab}
      />
    </div>
  );
}