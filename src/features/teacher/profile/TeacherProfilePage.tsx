import { useTeacherProfile } from "./hooks/useTeacherProfile";
import type { LeaveBalance } from "@/features/teacher/leave/types/leave.types";

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
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

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const StatusBadge = ({ status }: { status?: string }) => {
  const normalized = (status ?? "").toUpperCase();
  const active = normalized === "ACTIVE";
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
      active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    }`}>
      {normalized || "—"}
    </span>
  );
};

const ACCENT_BG: Record<string, string> = {
  sky: "bg-sky-50 text-sky-700 border-sky-100",
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  violet: "bg-violet-50 text-violet-700 border-violet-100",
  amber: "bg-amber-50 text-amber-700 border-amber-100",
};

const LeaveTile = ({ label, value, accent }: { label: string; value: number; accent?: string }) => (
  <div className="bg-[#F8FAFF] rounded-xl border border-gray-100 p-4 text-center">
    <p className={`text-xl font-bold tabular-nums ${accent ?? "text-gray-800"}`}>{value}</p>
    <p className="text-[11px] font-semibold text-gray-400 mt-0.5">{label}</p>
  </div>
);

export const TeacherProfilePage = () => {
  const { user, staff, leaveBalances, loading, error, reload } = useTeacherProfile();

  const name = staff?.name ?? user?.name ?? "Teacher";
  const initials = name.slice(0, 2).toUpperCase();
  const image = user?.image ?? null;
  const empNumber = staff?.emp_number ?? "";
  const userRoleName = user?.role && typeof user.role === "object" ? user.role.name : "";
  const role = staff?.role ?? userRoleName ?? "Teacher";
  const email = staff?.email ?? user?.email ?? "";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          {image ? (
            <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover border border-gray-100" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-base font-semibold text-gray-900 truncate">{name}</h1>
              <StatusBadge status={staff?.status} />
            </div>
            <p className="text-xs text-gray-400 mt-1 truncate">
              {role}
              {empNumber ? ` · ${empNumber}` : ""}
              {staff?.qualification ? ` · ${staff.qualification}` : ""}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl px-4 py-3">
          <p className="text-xs font-medium">{error}</p>
          <button
            onClick={reload}
            className="text-xs font-bold text-rose-700 hover:underline shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          <SectionCard title="Personal Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
              <InfoRow label="Name" value={name} />
              <InfoRow label="Employee ID" value={empNumber} />
              <InfoRow label="Role" value={role} />
              <InfoRow label="Qualification" value={staff?.qualification} />
              <InfoRow label="Phone" value={staff?.phone ?? user?.phone} />
              <InfoRow label="Email" value={email} />
              <InfoRow label="Date of Birth" value={formatDate(staff?.date_of_birth)} />
              <InfoRow label="Date of Joining" value={formatDate(staff?.date_of_join)} />
            </div>
          </SectionCard>

          <SectionCard title="Classes & Subjects">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-4">
              <InfoRow label="Class Teacher Of" value={staff?.class_teacher_of} />
              <InfoRow label="Subject Teacher Of" value={staff?.subject_teacher_of} />
            </div>
          </SectionCard>

          {staff?.bank_account_name || staff?.bank_account_number ? (
            <SectionCard title="Bank Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-4">
                <InfoRow label="Account Name" value={staff?.bank_account_name} />
                <InfoRow label="Account Number" value={staff?.bank_account_number} />
                <InfoRow label="IFSC Code" value={staff?.ifsc_code} />
              </div>
            </SectionCard>
          ) : null}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <SectionCard title="Leave Summary">
            {leaveBalances ? (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <LeaveTile label="Allocated" value={leaveBalances.totalAllocated} accent="text-indigo-600" />
                  <LeaveTile label="Used" value={leaveBalances.totalUsed} accent="text-rose-600" />
                  <LeaveTile label="Balance" value={leaveBalances.totalBalance} accent="text-emerald-600" />
                </div>
                {leaveBalances.balances.length > 0 && (
                  <div className="flex flex-col gap-2 pt-1">
                    {leaveBalances.balances.map((b: LeaveBalance) => (
                      <div
                        key={b.type}
                        className="flex items-center justify-between rounded-xl border px-3 py-2.5"
                      >
                        <span className="text-xs font-semibold text-gray-600">{b.label}</span>
                        <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${ACCENT_BG[b.accentColor] ?? ACCENT_BG.sky}`}>
                          {b.remaining} left / {b.total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Leave data not available.</p>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
