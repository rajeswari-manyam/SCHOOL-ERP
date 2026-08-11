import { useParams, useNavigate, Link } from "react-router-dom";
import { useStaffStore } from "../store/usestore";
import { StaffAvatar } from "../components/StaffAvathar";
import { StatusBadge } from "../components/Statusbadge";
import { SubjectPill } from "../components/SubjectPill";
import { ArrowLeft, Edit3, Hash, BookOpen, Users, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const InfoRow = ({ label, value }: { label: string; value?: string | number }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value ?? "—"}</p>
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
    <h3 className="font-bold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const StaffProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const staffData = useStaffStore((s) => s.staffData);
  const loading = useStaffStore((s) => s.loading);

  const staff = id ? staffData.find((s) => s.id === id) ?? null : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FB] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-[#F7F8FB] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400 text-sm">Staff member not found.</p>
        <Button onClick={() => navigate("/schooladmin/staff")} variant="link" className="text-indigo-600 text-sm font-semibold hover:underline">
          ← Back to Staff
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FB] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Link to="/schooladmin/staff" className="hover:text-indigo-600 transition-colors font-medium">Staff</Link>
          <span>›</span>
          <span className="text-gray-700 font-semibold">{staff.name}</span>
        </div>

        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <StaffAvatar initials={staff.initials} status={staff.status} />
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-base font-semibold text-gray-900">{staff.name}</h1>
                  <StatusBadge status={staff.status} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{staff.role} · {staff.employeeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-gray-700"
                onClick={() => navigate(`/schooladmin/staff/${staff.id}/edit`)}>
                <Edit3 className="h-3 w-3" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                onClick={() => navigate("/schooladmin/staff")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
                <InfoRow label="Name" value={staff.name} />
                <InfoRow label="Employee ID" value={staff.employeeId} />
                <InfoRow label="Role" value={staff.role} />
                <InfoRow label="Department" value={staff.isTeaching ? "Teaching" : "Non-Teaching"} />
                <InfoRow label="Phone" value={staff.phone} />
                <InfoRow label="Email" value={staff.email} />
                <InfoRow label="Leave Balance" value={`${staff.leaveBalance} days`} />
              </div>
            </SectionCard>

            <SectionCard title="Assigned Classes">
              {staff.classes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {staff.classes.map((c) => (
                    <span key={c} className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg">{c}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No classes assigned</p>
              )}
            </SectionCard>

            <SectionCard title="Subjects">
              {staff.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {staff.subjects.map((sub) => (
                    <SubjectPill key={sub} label={sub} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No subjects assigned</p>
              )}
            </SectionCard>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <SectionCard title="Quick Info">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</p>
                    <StatusBadge status={staff.status} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</p>
                    <p className="text-sm font-semibold text-gray-800">{staff.isTeaching ? "Teaching" : "Non-Teaching"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subjects</p>
                    <p className="text-sm font-semibold text-gray-800">{staff.subjects.length || "None"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Leave Balance</p>
                    <p className="text-sm font-semibold text-gray-800">{staff.leaveBalance} days</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            {staff.leaveRequest && (
              <SectionCard title="Leave Request">
                <div className="space-y-2">
                  <InfoRow label="Type" value={staff.leaveRequest.type} />
                  <InfoRow label="From" value={staff.leaveRequest.from} />
                  <InfoRow label="To" value={staff.leaveRequest.to} />
                  <InfoRow label="Days" value={staff.leaveRequest.days} />
                  <InfoRow label="Reason" value={staff.leaveRequest.reason} />
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status</p>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      staff.leaveRequest.status === "APPROVED" ? "bg-green-100 text-green-600" :
                      staff.leaveRequest.status === "REJECTED" ? "bg-red-100 text-red-600" :
                      "bg-yellow-100 text-yellow-600"
                    }`}>
                      {staff.leaveRequest.status}
                    </span>
                  </div>
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfilePage;
