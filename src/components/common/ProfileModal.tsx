// src/components/common/ProfileModal.tsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Mail, Phone, MapPin, Shield, Loader2 } from "lucide-react";
import { getUserById } from "@/services/auth.api";
import { useAuthStore } from "@/store/authStore";

interface Props {
  onClose: () => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "—";

const resolveName = (d: Record<string, unknown>, fallback: string) => {
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined);
  return (
    str(d.parent_name) ?? str(d.teacher_name) ?? str(d.student_name) ??
    str(d.admin_name)  ?? str(d.accountant_name) ??
    (str(d.first_name) ? `${str(d.first_name)} ${str(d.last_name) ?? ""}`.trim() : undefined) ??
    str(d.name) ?? fallback
  );
};

export const ProfileModal = ({ onClose }: Props) => {
  const authUser       = useAuthStore((s) => s.user);
  const setUserProfile = useAuthStore((s) => s.setUserProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, unknown> | null>(null);
  const [role, setRole]       = useState<string>(authUser?.userType ?? "");

  useEffect(() => {
    const userId = authUser?.id ?? localStorage.getItem("userId");
    if (!userId) {
      setError("No logged-in user found.");
      setLoading(false);
      return;
    }
    getUserById(userId)
      .then((profile) => {
        if (!profile?.status) {
          setError("Could not load profile.");
          return;
        }
        setDetails(profile.data as unknown as Record<string, unknown>);
        setRole(profile.role?.name ?? profile.userType ?? authUser?.userType ?? "");
        setUserProfile(profile);
      })
      .catch(() => setError("Could not load profile."))
      .finally(() => setLoading(false));
  }, [authUser?.id, setUserProfile]);

  const name  = details ? resolveName(details, authUser?.name ?? "User") : authUser?.name ?? "User";
  const email = (details?.email as string | undefined) ?? authUser?.email;
  const phone = (details?.phone as string | undefined) ?? authUser?.phone;
  const address = (details?.address as string | undefined) ?? authUser?.address;
  const schoolCode = (details?.school_code as string | undefined) ?? authUser?.schoolcode;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-bold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 text-indigo-500 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-500 text-center py-6">{error}</p>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {authUser?.image ? (
                  <img src={authUser.image} alt={name} className="h-14 w-14 rounded-full object-cover ring-1 ring-black/5" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-base font-bold text-white">
                    {getInitials(name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                  {role && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      <Shield className="h-3 w-3" /> {role}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{email || "—"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{phone || "—"}</span>
                </div>
                {address && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{address}</span>
                  </div>
                )}
              </div>

              {schoolCode && (
                <div className="pt-3 border-t border-gray-50 text-xs text-gray-400">
                  School Code: <span className="font-semibold text-gray-600">{schoolCode}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProfileModal;