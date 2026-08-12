import { useState } from "react";
import { Mail, Phone, MapPin, Hash, Calendar, RefreshCw } from "lucide-react";
import { useUserProfile } from "@/components/common/hooks/useUserProfile";
import { ImagePreviewModal } from "@/components/common/ImagePreviewModal";
import { SchoolInfoCard } from "@/components/common/SchoolInfoCard";

const InfoRow = ({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string | null }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-indigo-500" />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
    </div>
  </div>
);

const formatDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "—";

const ProfilePage = () => {
  const { profile, loading, error, reload } = useUserProfile();
  const [showPhoto, setShowPhoto] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-sm text-gray-500">{error ?? "Could not load profile."}</p>
        <button
          onClick={reload}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-semibold hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-base font-semibold text-gray-900">My Profile</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your account details</p>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-4">
          {profile.image ? (
            <button type="button" onClick={() => setShowPhoto(true)} className="shrink-0">
              <img src={profile.image} alt={profile.name} className="w-16 h-16 rounded-full object-cover border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity" />
            </button>
          ) : (
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
              {getInitials(profile.name)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-semibold text-gray-900 truncate">{profile.name}</h2>
              {profile.status && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  profile.status.toUpperCase() === "ACTIVE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {profile.status}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">{profile.roleName ?? "Accountant"}</p>
          </div>
        </div>
      </div>

      <SchoolInfoCard
        schoolName={profile.schoolName}
        schoolImage={profile.schoolImage}
        schoolLogo={profile.schoolLogo}
        principalName={profile.principalName}
      />

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-800 mb-4 text-sm">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={Mail} label="Email" value={profile.email} />
          <InfoRow icon={Phone} label="Phone" value={profile.phone} />
          <InfoRow icon={MapPin} label="Address" value={profile.address} />
          <InfoRow icon={Hash} label="School Code" value={profile.schoolCode} />
          <InfoRow icon={Calendar} label="Joined" value={formatDate(profile.createdAt)} />
        </div>
      </div>

      {showPhoto && profile.image && (
        <ImagePreviewModal src={profile.image} alt={profile.name} title={profile.name} subtitle={profile.roleName} onClose={() => setShowPhoto(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
