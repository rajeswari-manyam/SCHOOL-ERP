import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useStudentProfile } from "../hooks/useStudents";
import { StatusBadge, FeeBadge } from "./StudentBadge";
import StudentAttendanceTab from "./StudentAttendanceTab";
import StudentFeeTab from "./StudentFeeTab";
import StudentDocumentsTab from "./StudentDocumentTab";

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
  const { student, loading, attendance, feePayments, documents } = useStudentProfile(id!);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm">Student not found.</p>
        <Button onClick={() => navigate("/school-admin/students")} variant="link" className="mt-4 text-indigo-600 text-sm font-semibold hover:underline">← Back to Students</Button>
      </div>
    );
  }

  const fullName = `${student.firstName} ${student.lastName}`;
  const outstanding = feePayments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const presentThisMonth = attendance.filter(d => d.status === "present").length;
  const totalDaysThisMonth = attendance.filter(d => d.status !== null).length;

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
        <Link to="/school-admin/students" className="hover:text-indigo-600 transition-colors font-medium">Students</Link>
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
            <Button variant="outline" size="sm" className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Student
            </Button>
            <Button variant="outline" size="sm" className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Issue TC
            </Button>
            <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Admission No" value={student.admissionNo} />
                <InfoRow label="Class" value={`${student.class}-${student.section}`} />
                <InfoRow label="Date of Birth" value={student.dob} />
                <InfoRow label="Age" value={student.dob ? `${new Date().getFullYear() - parseInt(student.dob.split(" ").pop()!)} years` : "—"} />
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
        <StudentAttendanceTab attendance={attendance} />
      )}

      {activeTab === "fee-history" && (
        <StudentFeeTab payments={feePayments} />
      )}

      {activeTab === "documents" && (
        <StudentDocumentsTab documents={documents} />
      )}
    </div>
  );
};

export default StudentProfilePage;