import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Plus, Pencil, Trash2, X, Loader2, BookOpen,
  GraduationCap, Bus, Library, Activity,
  FlaskConical, Eye, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddFeeHeadModal } from "./AddFeeHeadModal";
import { Concessions } from "./ConcessionTable";
import { FEE_HEAD_COLORS } from "../constants/fee.constants";
import { formatINR } from "../../../../utils/formatters";
import {
  getFeeHeads,
  getFeeStructures,
  deleteFeeHeadMapping,
  deleteFeeHeadById,
} from "@/services/fee.api";
import type { FeeHeadDTO, FeeHeadMappingDTO } from "@/services/fee.api";
import type { FeeStructureAssignment } from "../types/fees.types";
import type { FeeStructureProps } from "../types/fees.types";

const feeHeadIcons: Record<string, React.ReactNode> = {
  "Tuition Fee":     <BookOpen className="w-3.5 h-3.5 text-white" />,
  "Examination Fee": <GraduationCap className="w-3.5 h-3.5 text-white" />,
  "Transport Fee":   <Bus className="w-3.5 h-3.5 text-white" />,
  "Activity Fee":    <Activity className="w-3.5 h-3.5 text-white" />,
  "Library Fee":     <Library className="w-3.5 h-3.5 text-white" />,
  "Lab Fee":         <FlaskConical className="w-3.5 h-3.5 text-white" />,
};

// ── Student Side Panel ────────────────────────────────────────────────────────

function StudentSidePanel({ assignment, onClose }: { assignment: FeeStructureAssignment | null; onClose: () => void }) {
  const [allStudents] = useState<{ name: string; admissionNo: string }[]>([]);
  const [loading] = useState(false);

  const isSelectedStudents = assignment?.applicableTo === "SELECTED_STUDENTS";
  const assignedList = assignment?.assignedStudents ?? [];

  const displayStudents: { name: string; admissionNo: string }[] = isSelectedStudents
    ? assignedList.map((s) => ({ name: `${s.first_name} ${s.last_name}`.trim(), admissionNo: s.admission_number }))
    : allStudents;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div>
          <p className="text-sm font-semibold text-slate-800">{assignment?.feeHeadName ?? "Fee Structure"}</p>
          <p className="text-[11px] text-slate-400">
            {assignment?.className}{assignment?.sectionName ? ` · ${assignment.sectionName}` : ""} · {assignment?.academicYear ?? ""}
          </p>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Detail grid */}
        <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
          {([
            ["Billing Cycle", assignment?.billingCycle],
            ["Amount",        assignment?.amount != null ? formatINR(assignment.amount) : "—"],
            ["Due Date",      assignment?.dueDate],
            ["Mandatory",     assignment?.mandatory ? "Yes" : "No"],
            ["Allow Concession", assignment?.allowConcession ? "Yes" : "No"],
            ["Status",        assignment?.status ?? "—"],
          ] as [string, string | undefined][]).map(([label, val]) => (
            <div key={label} className="bg-slate-50 rounded p-2">
              <span className="text-slate-400 block mb-0.5">{label}</span>
              <span className="font-medium text-slate-700">{val}</span>
            </div>
          ))}
        </div>

        {/* Applicable-to badge */}
        <div className="mb-3 flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
            isSelectedStudents
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}>
            {isSelectedStudents ? "Selected Students" : "All Students"}
          </span>
          <span className="text-[11px] text-slate-400">{displayStudents.length} student{displayStudents.length !== 1 ? "s" : ""}</span>
        </div>

        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {isSelectedStudents ? "Assigned Students" : "Students in Class"}
        </h4>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
          </div>
        ) : displayStudents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">No students found</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {displayStudents.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-100">
                <div>
                  <p className="text-xs font-medium text-slate-700">{s.name}</p>
                  <p className="text-[10px] text-slate-400">{s.admissionNo}</p>
                </div>
                <p className="text-xs font-semibold text-slate-700">{formatINR(assignment?.amount ?? 0)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main FeeStructure Component ───────────────────────────────────────────────

const SUB_TABS = ["Fee Heads", "Fee Structures", "Concessions"] as const;
type SubTab = typeof SUB_TABS[number];

export const FeeStructure = ({ showModal, setShowModal }: FeeStructureProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubTab, setActiveSubTab]             = useState<SubTab>(
    ((location.state as { activeSubTab?: SubTab } | null)?.activeSubTab) ?? "Fee Heads"
  );
  const [assignments, setAssignments]               = useState<FeeStructureAssignment[]>([]);
  const [feeHeadsList, setFeeHeadsList]             = useState<FeeHeadDTO[]>([]);
  const [viewingAssignment, setViewingAssignment]   = useState<FeeStructureAssignment | null>(null);
  const [deletingId, setDeletingId]                 = useState<string | null>(null);
  const [editingFeeHead, setEditingFeeHead]         = useState<FeeHeadDTO | null>(null);
  const [deletingFeeHeadId, setDeletingFeeHeadId]  = useState<string | null>(null);
  const [triggerAddConcession, setTriggerAddConcession] = useState(false);

  const refreshFeeHeads = useCallback(() => {
    getFeeHeads().then((res) => {
      if (res.status) setFeeHeadsList(res.data);
    }).catch(() => {});
  }, []);

  const refreshFeeStructures = useCallback(() => {
    getFeeStructures({ class_id: "", section_id: "", fromDate: "2020-01-01", toDate: "2030-12-31" }).then((res) => {
      if (res.status) {
        setAssignments(res.data.map((m: FeeHeadMappingDTO) => ({
          id: m.id,
          feeHeadId: m.feeHeadId,
          feeHeadName: m.feeHeadName,
          classId: m.classId,
          className: m.className,
          sectionId: m.sectionId,
          sectionName: m.sectionName,
          mandatory: m.isMandatory,
          billingCycle: m.billingCycle as FeeStructureAssignment["billingCycle"],
          dueDate: m.dueDate,
          amount: m.amount,
          annualTotal: m.billingCycle === "Monthly" ? m.amount * 12 : m.billingCycle === "Quarterly" ? m.amount * 4 : m.amount,
          applicableTo: m.applicableTo as "ALL_STUDENTS" | "SELECTED_STUDENTS",
          allowConcession: m.allowConcession,
          status: m.status,
          academicYear: m.academicYear,
          assignedStudents: m.assignedStudents.map((s) => ({
            id: s.id,
            first_name: s.first_name,
            last_name: s.last_name,
            admission_number: s.admission_number,
          })),
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    refreshFeeHeads();
    refreshFeeStructures();
  }, [refreshFeeHeads, refreshFeeStructures]);

  useEffect(() => {
    if (showModal) setActiveSubTab("Fee Heads");
  }, [showModal]);

  const handleDeleteFeeStructure = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFeeHeadMapping(id);
      toast.success("Fee structure deleted");
      refreshFeeStructures();
    } catch {
      toast.error("Failed to delete fee structure");
    } finally {
      setDeletingId(null);
    }
  }, [refreshFeeStructures]);

  const handleDeleteFeeHead = useCallback(async (id: string) => {
    setDeletingFeeHeadId(id);
    try {
      await deleteFeeHeadById(id);
      toast.success("Fee head deleted");
      refreshFeeHeads();
    } catch {
      toast.error("Failed to delete fee head");
    } finally {
      setDeletingFeeHeadId(null);
    }
  }, [refreshFeeHeads]);

  return (
    <div className="px-3 md:px-5 pt-3 pb-10 font-sans">

      {/* Modals */}
      {(showModal || editingFeeHead !== null) && (
        <AddFeeHeadModal
          onClose={() => { setShowModal(false); setEditingFeeHead(null); }}
          onSuccess={() => { refreshFeeHeads(); }}
          editData={editingFeeHead ?? undefined}
        />
      )}
      {viewingAssignment && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setViewingAssignment(null)} />
          <StudentSidePanel assignment={viewingAssignment} onClose={() => setViewingAssignment(null)} />
        </>
      )}

      {/* ── Sub-tab bar ── */}
      <div className="flex items-center gap-1 border-b border-slate-200 mb-5 overflow-x-auto scrollbar-hide">
        {SUB_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
              activeSubTab === tab
                ? "border-[#3525CD] text-[#3525CD]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
        {activeSubTab === "Concessions" && (
          <Button
            size="sm"
            className="ml-auto mb-1 h-7 text-xs bg-[#3525CD] text-white whitespace-nowrap"
            onClick={() => setTriggerAddConcession(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Concession
          </Button>
        )}
      </div>

      {/* ── Fee Heads Tab ── */}
      {activeSubTab === "Fee Heads" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Fee Heads</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
                {feeHeadsList.length}
              </span>
            </div>
            <Button size="sm" className="h-8 text-xs bg-[#3525CD] text-white" onClick={() => setShowModal(true)}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Fee Head
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            {feeHeadsList.length === 0 ? (
              <div className="p-10 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">No fee heads yet. Click "+ Add Fee Head" to create one.</p>
              </div>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    {["Fee Name", "Description", "Order", "Status", "Actions"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider ${["Order","Actions","Status"].includes(h) ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feeHeadsList.map((fh) => {
                    const isDeleting = deletingFeeHeadId === fh.id;
                    const isActive   = (fh.status ?? "Active").toLowerCase() === "active";
                    return (
                      <tr key={fh.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center shrink-0">
                              <BookOpen className="w-3.5 h-3.5 text-[#3525CD]" />
                            </div>
                            <span className="text-[13px] font-medium text-slate-800">{fh.feeName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-500 max-w-[200px] truncate">{fh.description || "—"}</td>
                        <td className="px-4 py-3 text-center text-[13px] text-slate-600">{fh.displayOrder}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {fh.status ?? "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setEditingFeeHead(fh)} className="p-1.5 rounded text-slate-400 hover:text-[#3525CD] hover:bg-indigo-50 transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteFeeHead(fh.id)} disabled={isDeleting} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50" title="Delete">
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Fee Structures Tab ── */}
      {activeSubTab === "Fee Structures" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">Fee Structures</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50 text-[#3525CD] text-[11px] font-semibold">
                {assignments.length}
              </span>
            </div>
            <Button size="sm" className="h-8 text-xs bg-[#3525CD] text-white" onClick={() => navigate("/accountant/fees/structure/add")}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Fee Structure
            </Button>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-600">No fee structures configured</p>
              <p className="text-xs text-slate-400 mt-1">Click "Add Fee Structure" to create one</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {["Fee Head", "Class", "Section", "Billing Cycle", "Amount", "Annual Total", "Due Date", "Type", "Actions"].map((h) => (
                      <th key={h} className={`px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap ${["Amount", "Annual Total"].includes(h) ? "text-right" : ["Type", "Actions"].includes(h) ? "text-center" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => {
                    const isDeleting = deletingId === a.id;
                    const bgColor = FEE_HEAD_COLORS[a.feeHeadName] ?? "bg-slate-400";
                    const icon = feeHeadIcons[a.feeHeadName] ?? <BookOpen className="w-3 h-3 text-white" />;
                    return (
                      <tr key={a.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-7 h-7 rounded-md flex items-center justify-center ${bgColor}`}>{icon}</span>
                            <span className="text-[13px] font-medium text-slate-800 whitespace-nowrap">{a.feeHeadName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-700">{a.className}</td>
                        <td className="px-4 py-3 text-[13px] text-slate-500">{a.sectionName ?? "All"}</td>
                        <td className="px-4 py-3 text-[12px] text-slate-600">{a.billingCycle}</td>
                        <td className="px-4 py-3 text-right text-[13px] font-medium text-slate-800">{a.amount != null ? formatINR(a.amount) : "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-[13px] font-semibold text-[#3525CD]">{a.annualTotal != null ? formatINR(a.annualTotal) : "—"}</span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-slate-600 whitespace-nowrap">{a.dueDate || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${a.mandatory ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {a.mandatory ? "Mandatory" : "Optional"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setViewingAssignment(a)} className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View Students">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => navigate(`/accountant/fees/structure/edit/${a.id}`, { state: { editData: a } })} className="p-1.5 rounded text-slate-400 hover:text-[#3525CD] hover:bg-indigo-50 transition-colors" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteFeeStructure(a.id)} disabled={isDeleting} className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50" title="Delete">
                              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Concessions Tab ── */}
      {activeSubTab === "Concessions" && (
        <Concessions
          triggerAdd={triggerAddConcession}
          onAddHandled={() => setTriggerAddConcession(false)}
        />
      )}

    </div>
  );
};
