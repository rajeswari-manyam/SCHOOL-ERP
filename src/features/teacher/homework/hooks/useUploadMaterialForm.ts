import { useState, useEffect } from "react";
import { getAllClasses, getSectionsByClassId } from "@/services/class.api";
import { getSubjectsBySectionId } from "@/services/subject.api";
import type { ClassRecord, SectionRecord } from "@/services/class.api";
import type { SubjectRecord } from "@/services/subject.api";

interface UseUploadMaterialFormOptions {
  open: boolean;
  selectedClassId: string;
  selectedSectionId: string;
  onClassChange: (classId: string) => void;
  onSectionChange: (sectionId: string) => void;
}

interface UseUploadMaterialFormResult {
  classes: ClassRecord[];
  sections: SectionRecord[];
  subjects: SubjectRecord[];
  sectionsLoading: boolean;
  subjectsLoading: boolean;
}

export const useUploadMaterialForm = ({
  open,
  selectedClassId,
  selectedSectionId,
  onClassChange,
  onSectionChange,
}: UseUploadMaterialFormOptions): UseUploadMaterialFormResult => {
  const [classes,          setClasses]          = useState<ClassRecord[]>([]);
  const [sections,         setSections]         = useState<SectionRecord[]>([]);
  const [subjects,         setSubjects]         = useState<SubjectRecord[]>([]);
  const [sectionsLoading,  setSectionsLoading]  = useState(false);
  const [subjectsLoading,  setSubjectsLoading]  = useState(false);

  // Load classes when modal opens
  useEffect(() => {
    if (!open) return;
    setSections([]);
    setSubjects([]);
    getAllClasses()
      .then((res) => setClasses(res.data ?? []))
      .catch(() => {});
  }, [open]);

  // Cascade: class → sections
  useEffect(() => {
    if (!selectedClassId) {
      setSections([]);
      setSubjects([]);
      onClassChange("");
      onSectionChange("");
      return;
    }
    setSectionsLoading(true);
    getSectionsByClassId(selectedClassId)
      .then((res) => setSections(res.data ?? []))
      .catch(() => setSections([]))
      .finally(() => setSectionsLoading(false));
    onSectionChange("");
    setSubjects([]);
  }, [selectedClassId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cascade: section → subjects
  useEffect(() => {
    if (!selectedSectionId) {
      setSubjects([]);
      onSectionChange("");
      return;
    }
    setSubjectsLoading(true);
    getSubjectsBySectionId(selectedSectionId)
      .then((res) => setSubjects(res.data ?? []))
      .catch(() => setSubjects([]))
      .finally(() => setSubjectsLoading(false));
  }, [selectedSectionId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { classes, sections, subjects, sectionsLoading, subjectsLoading };
};
