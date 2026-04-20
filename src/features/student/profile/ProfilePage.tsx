import { useProfile, useDownloadDocument } from "./hooks/useProfile";

// Components
import ProfileCard from "./components/ProfileCard.tsx";
import AcademicInfoCard from "./components/AcademicInfoCard.tsx";
import PersonalInfoCard from "./components/PersonalInfoCard.tsx";
import QuickDownloads from "./components/QuickDownloads.tsx";

const ProfilePage = () => {
  const { data, isLoading } = useProfile();
  const { download, downloadingId } = useDownloadDocument();

  if (isLoading || !data) {
    return <div className="p-6">Loading profile...</div>;
  }

  const { student, academic, personal, downloads } = data;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <ProfileCard student={student} />
          <AcademicInfoCard academic={academic} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <PersonalInfoCard personal={personal} />
          <QuickDownloads downloads={downloads} onDownload={download} downloadingId={downloadingId} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
