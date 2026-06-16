import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit3, FileText, MoreVertical, MessageCircle } from "lucide-react";
import { useStudentProfile } from "../hooks/useStudents";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { StatusBadge, FeeBadge } from "./StudentBadge";
import StudentAttendanceTab from "./StudentAttendanceTab";
import StudentFeeTab from "./StudentFeeTab";
import StudentDocumentsTab from "./StudentDocumentTab";
import { EditStudentModal } from "./EditStudentModal";
import { studentsApi } from "@/services/school-students.api";
import { useUIStore } from "@/store/uiStore";

type Tab = "overview" | "attendance" | "fee-history" | "documents";

const Avatar = ({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) => {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const sz = size === "lg" ? "w-14 h-14 text-xl" : "w-9 h-9 text-sm";
  return (
    <div className={`${sz} rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
  </div>
);

const StudentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, loading, error, feePayments, documents, retry } = useStudentProfile(id!);
  const attendanceHook = useStudentAttendance(student ?? null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [showEdit, setShowEdit] = useState(false);
  const setPageTitle = useUIStore((s) => s.setPageTitle);

  useEffect(() => {
    if (student) setPageTitle(`${student.firstName} ${student.lastName}`);
    return () => setPageTitle(null);
  }, [student, setPageTitle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={retry}
            className="rounded-lg bg-red-100 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
          <Button onClick={() => navigate("/schooladmin/students")} variant="link" className="text-xs text-gray-400 hover:text-gray-600">
            ← Back to Students
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm">Student not found.</p>
        <Button onClick={() => navigate("/schooladmin/students")} variant="link" className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">← Back to Students</Button>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const outstanding = feePayments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const presentThisMonth = attendanceHook.monthlyData?.summary?.present ?? 0;
  const totalDaysThisMonth = attendanceHook.monthlyData?.summary?.total ?? 0;

  const TABS: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "attendance", label: "Attendance" },
    { key: "fee-history", label: "Fee History" },
    { key: "documents", label: "Documents" },
  ];

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Link to="/schooladmin/students" className="hover:text-indigo-600 transition-colors font-medium">Students</Link>
        <span>›</span>
        <span className="text-gray-700 font-semibold">{fullName}</span>
      </div>

      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={fullName} size="lg" />
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-extrabold text-gray-900">{fullName}</h1>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  CLASS {student.class}-{student.section}
                </span>
                <StatusBadge status={student.status} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Student ID: {student.admissionNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700"
              onClick={() => setShowEdit(true)}>
              <Edit3 className="h-3 w-3" />
              Edit Student
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
              <FileText className="h-3 w-3" />
              Issue TC
            </Button>
            <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mt-5 border-b border-gray-100">
          {TABS.map(t => (
            <Button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              variant="ghost"
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === t.key
                  ? "border-indigo-600 text-indigo-600 hover:bg-transparent"
                  : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-transparent"
              }`}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-3 gap-4">
          {/* Left: Personal info */}
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Personal Information</h3>
                <Button variant="link" size="sm" className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors flex items-center gap-1">
                  <Edit3 className="h-3 w-3" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Admission No" value={student.admissionNo} />
                <InfoRow label="Class" value={`${student.class}-${student.section}`} />
                <InfoRow label="Date of Birth" value={student.dob} />
                <InfoRow label="Age" value={student.dob ? `${new Date().getFullYear() - new Date(student.dob).getFullYear()} years` : "—"} />
                <InfoRow label="Gender" value={student.gender} />
                <InfoRow label="Blood Group" value={student.bloodGroup} />
                <InfoRow label="Father's Name" value={student.fatherName} />
                <InfoRow label="Father's Phone" value={student.fatherPhone} />
                <InfoRow label="Mother's Name" value={student.motherName} />
                <InfoRow label="Mother's Phone" value={student.motherPhone} />
                <InfoRow label="Emergency Contact" value={student.emergencyContact} />
                <InfoRow label="WhatsApp Alert" value={student.whatsappNumber} />
              </div>
              {student.residentialAddress && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <InfoRow label="Address" value={student.residentialAddress} />
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Admitted On" value={student.admittedOn} />
                <InfoRow label="Academic Year" value={student.academicYear} />
              </div>
            </div>
          </div>

          {/* Right: Quick stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Attendance This Month</p>
                  <div className="flex items-end gap-2">
                    <p className="text-xl font-extrabold text-gray-900">{presentThisMonth} / {totalDaysThisMonth} days present</p>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${totalDaysThisMonth ? (presentThisMonth / totalDaysThisMonth) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{totalDaysThisMonth ? Math.round((presentThisMonth / totalDaysThisMonth) * 100) : 0}% attendance rate overall</p>
                </div>

                <div className="pt-3 border-t border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Fee Status</p>
                  {outstanding > 0 ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                      <p className="text-lg font-extrabold text-red-600">₹{outstanding.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-red-400 font-semibold">pending</p>
                      <p className="text-xs text-red-400 mt-1">{feePayments.find(p => p.status === "PENDING")?.description}</p>
                      <p className="text-[10px] text-red-300 mt-1">12 days overdue</p>
                      <Button variant="ghost" size="sm" className="mt-2 w-full py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">
                        Send Reminder
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FeeBadge status="PAID" />
                      <span className="text-xs text-gray-500">All fees cleared</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-50">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Last Activity</p>
                  <p className="text-xs text-gray-600 font-semibold">Today 8:47 AM</p>
                  <p className="text-xs text-gray-400">Attendance marked for 7 Apr 2025</p>
                </div>
              </div>
            </div>

            {/* WhatsApp concierge */}
            <div className="bg-[#25d366] rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold">Parent Concierge</p>
                  <p className="text-[10px] opacity-80">Direct support via WhatsApp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <StudentAttendanceTab
          todayData={attendanceHook.todayData}
          todayLoading={attendanceHook.todayLoading}
          monthlyData={attendanceHook.monthlyData}
          yearlyData={attendanceHook.yearlyData}
          viewMonth={attendanceHook.viewMonth}
          viewYear={attendanceHook.viewYear}
          monthlyLoading={attendanceHook.monthlyLoading}
          prevMonth={attendanceHook.prevMonth}
          nextMonth={attendanceHook.nextMonth}
        />
      )}

      {activeTab === "fee-history" && (
        <StudentFeeTab payments={feePayments} />
      )}

      {activeTab === "documents" && (
        <StudentDocumentsTab documents={documents} />
      )}

      {showEdit && student && (
        <EditStudentModal
          student={student}
          onClose={() => setShowEdit(false)}
          onSave={async (_, payload) => {
            const updated = await studentsApi.updateStudent(student.id, payload);
            window.location.reload();
            return updated;
          }}
        />
      )}
    </div>
  );
};

export default StudentProfilePage;